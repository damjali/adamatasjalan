"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { Shot } from "@/lib/data";

type Span = [cols: number, rows: number];

// Every block is a full-width rectangle on the 3-column mobile grid, so any
// sequence of blocks tiles with no holes. Tile order matches grid auto-placement.
const S: Span = [1, 1];
const BLOCKS: Span[][] = [
  [S, S, S],
  [[2, 2], S, S],
  [S, [2, 2], S],
  [[1, 2], S, S, S, S],
  [S, S, [1, 2], S, S],
  [[2, 1], S],
  [S, [2, 1]],
];
const BANNER: Span = [3, 1];

// Deterministic, so server and client render the same layout.
function layout(count: number): Span[] {
  let seed = count * 7919 + 1;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const spans: Span[] = [];
  let last = -1;
  while (spans.length < count) {
    const left = count - spans.length;
    const fits = BLOCKS.map((b, i) => i).filter((i) => BLOCKS[i].length <= left && i !== last);
    if (fits.length === 0) {
      // 1 photo left (or only the repeat fits): fill the row with a full-width banner
      if (left === 1) spans.push(BANNER);
      else {
        const i = BLOCKS.findIndex((b) => b.length <= left);
        spans.push(...BLOCKS[i]);
      }
      break;
    }
    last = fits[Math.floor(rand() * fits.length)];
    spans.push(...BLOCKS[last]);
  }
  return spans.slice(0, count);
}

export default function Gallery({ shots }: { shots: Shot[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const spans = useMemo(() => layout(shots.length), [shots.length]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const go = useCallback(
    (step: number) => setIndex((i) => (i === null ? i : (i + step + shots.length) % shots.length)),
    [shots.length]
  );

  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, go]);

  return (
    <>
      <div className="gallery">
        {shots.map((s, i) => (
          <button
            key={s.src}
            className="gallery-item"
            style={{ "--c": spans[i][0], "--r": spans[i][1] } as React.CSSProperties}
            onClick={() => setIndex(i)}
            aria-label={`Open ${s.alt}`}
          >
            <Image
              src={s.src}
              alt={s.alt}
              width={s.w}
              height={s.h}
              sizes="(max-width: 560px) 34vw, (max-width: 1000px) 50vw, 33vw"
            />
            <span className="idx eyebrow">{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      {mounted &&
        index !== null &&
        createPortal(
          <div className="lightbox" onClick={() => setIndex(null)}>
            <div className="lightbox-top">
              <span className="eyebrow">
                {String(index + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
              </span>
              <button className="eyebrow nav-link" onClick={() => setIndex(null)}>
                Close ✕
              </button>
            </div>
            <div className="lightbox-stage">
              <div className="img-fill" style={{ position: "absolute", inset: 0 }}>
                <Image src={shots[index].src} alt={shots[index].alt} fill sizes="100vw" />
              </div>
            </div>
            <div className="lightbox-bottom" onClick={(e) => e.stopPropagation()}>
              <button className="eyebrow nav-link" onClick={() => go(-1)}>
                ← Prev
              </button>
              <span className="eyebrow muted">{shots[index].alt}</span>
              <button className="eyebrow nav-link" onClick={() => go(1)}>
                Next →
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
