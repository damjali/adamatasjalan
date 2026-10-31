"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Shot } from "@/lib/data";
import { rich } from "@/lib/rich";

export type GalleryText = { close: string; prev: string; next: string; watermark: string };

// Justified rows: every photo keeps its own aspect ratio (portraits stay tall, landscapes
// stay wide, nothing is cropped) and each row is scaled to fill the full width, so no gaps.
const MAX_PER_ROW = 5;

function targetHeight(width: number) {
  return width < 560 ? 170 : width < 1000 ? 240 : 300;
}

// Split photos into consecutive rows whose heights are all as close to the target as possible.
function partition(aspects: number[], width: number, gap: number): number[][] {
  const n = aspects.length;
  const target = targetHeight(width);
  const best = new Array<number>(n + 1).fill(Infinity);
  const from = new Array<number>(n + 1).fill(0);
  best[0] = 0;
  for (let j = 1; j <= n; j++) {
    let sum = 0;
    for (let i = j - 1; i >= Math.max(0, j - MAX_PER_ROW); i--) {
      sum += aspects[i];
      const height = (width - gap * (j - i - 1)) / sum;
      const cost = best[i] + (height - target) ** 2;
      if (cost < best[j]) {
        best[j] = cost;
        from[j] = i;
      }
    }
  }
  const rows: number[][] = [];
  for (let j = n; j > 0; j = from[j]) {
    rows.unshift(Array.from({ length: j - from[j] }, (_, k) => from[j] + k));
  }
  return rows;
}

export default function Gallery({ shots, text }: { shots: Shot[]; text: GalleryText }) {
  const [index, setIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(390);
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const measure = () => setWidth(Math.round(el.clientWidth) || 390);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const gap = width < 560 ? 4 : 12;
  const rows = useMemo(
    () =>
      partition(
        shots.map((s) => s.w / s.h),
        width,
        gap
      ),
    [shots, width, gap]
  );
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
      <div className="gallery" ref={galleryRef} style={{ "--g": `${gap}px` } as React.CSSProperties}>
        {rows.map((row) => {
          const aspects = row.map((i) => shots[i].w / shots[i].h);
          const sum = aspects.reduce((x, y) => x + y, 0);
          const rowHeight = (width - gap * (row.length - 1)) / sum;
          return (
            <div className="gallery-row" key={row[0]} style={{ aspectRatio: width / rowHeight }}>
              {row.map((i, k) => (
                <button
                  key={shots[i].src}
                  className="gallery-item"
                  style={{ flex: `${aspects[k]} 1 0%` }}
                  onClick={() => setIndex(i)}
                  aria-label={`Open ${shots[i].alt}`}
                >
                  <Image
                    src={shots[i].src}
                    alt={shots[i].alt}
                    fill
                    sizes="(max-width: 560px) 70vw, (max-width: 1000px) 45vw, 30vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="idx eyebrow">{String(i + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          );
        })}
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
                {text.close}
              </button>
            </div>
            <div className="lightbox-stage">
              <div className="img-fill" style={{ position: "absolute", inset: 0 }}>
                <Image src={shots[index].src} alt={shots[index].alt} fill sizes="100vw" />
              </div>
              <span className="watermark" aria-hidden>
                {rich(text.watermark)}
              </span>
            </div>
            <div className="lightbox-bottom" onClick={(e) => e.stopPropagation()}>
              <button className="eyebrow nav-link" onClick={() => go(-1)}>
                {text.prev}
              </button>
              <span className="eyebrow muted">{shots[index].alt}</span>
              <button className="eyebrow nav-link" onClick={() => go(1)}>
                {text.next}
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
