"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroShot = { src: string; name: string; w: number; h: number };

const INTERVAL = 5000;
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

export default function GenreHero({ shots }: { shots: HeroShot[] }) {
  // Phones get portrait photos, larger screens get landscape ones (all, if none match).
  const [pool, setPool] = useState<HeroShot[]>(shots);
  const [current, setCurrent] = useState<HeroShot | undefined>(shots[0]);
  const history = useRef<HeroShot[]>([]);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 860px)").matches;
    const fit = shots.filter((s) => (mobile ? s.h > s.w : s.w >= s.h));
    const next = fit.length ? fit : shots;
    setPool(next);
    setCurrent(pick(next));
    history.current = [];
  }, [shots]);

  // Jump to a photo from a different event than the current one, favouring a mix.
  const advance = useCallback(
    (from: HeroShot | undefined) => {
      const others = pool.filter((s) => s.name !== from?.name);
      const choices = others.length ? others : pool.filter((s) => s !== from);
      return choices.length ? pick(choices) : from;
    },
    [pool]
  );

  const forward = useCallback(() => {
    if (current) history.current.push(current);
    setCurrent(advance(current));
  }, [advance, current]);

  const back = () => {
    const prev = history.current.pop();
    if (prev) setCurrent(prev);
  };

  // Auto-advance every 5s; any manual change restarts the timer.
  useEffect(() => {
    if (pool.length < 2) return;
    const t = setTimeout(forward, INTERVAL);
    return () => clearTimeout(t);
  }, [current, pool, forward]);

  if (!current) return null;

  return (
    <div className="genre-hero">
      <div className="img-fill hero-slide" key={current.src}>
        <Image src={current.src} alt={current.name} fill priority sizes="100vw" style={{ objectFit: "cover" }} />
      </div>
      <div className="hero-bar">
        <button className="eyebrow hero-btn" onClick={back} aria-label="Previous photo">
          ←
        </button>
        <span className="eyebrow hero-name">{current.name}</span>
        <button className="eyebrow hero-btn" onClick={forward} aria-label="Next photo">
          →
        </button>
      </div>
    </div>
  );
}
