"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type HeroShot = { src: string; name: string };

const INTERVAL = 5000;

export default function GenreHero({ shots }: { shots: HeroShot[] }) {
  const [index, setIndex] = useState(0);
  const count = shots.length;

  // Every 5s jump to a random photo; any manual change restarts the timer.
  useEffect(() => {
    if (count < 2) return;
    const t = setTimeout(() => {
      setIndex((i) => {
        const r = Math.floor(Math.random() * (count - 1));
        return r >= i ? r + 1 : r;
      });
    }, INTERVAL);
    return () => clearTimeout(t);
  }, [index, count]);

  if (count === 0) return null;
  const shot = shots[index];
  const step = (d: number) => setIndex((i) => (i + d + count) % count);

  return (
    <div className="genre-hero">
      <div className="img-fill hero-slide" key={shot.src}>
        <Image src={shot.src} alt={shot.name} fill priority sizes="100vw" style={{ objectFit: "cover" }} />
      </div>
      <div className="hero-bar">
        <button className="eyebrow hero-btn" onClick={() => step(-1)} aria-label="Previous photo">
          ←
        </button>
        <span className="eyebrow hero-name">{shot.name}</span>
        <button className="eyebrow hero-btn" onClick={() => step(1)} aria-label="Next photo">
          →
        </button>
      </div>
    </div>
  );
}
