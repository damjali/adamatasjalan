"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Shot } from "@/lib/data";

export default function Gallery({ shots }: { shots: Shot[] }) {
  const [index, setIndex] = useState<number | null>(null);
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
