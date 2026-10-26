"use client";

import Link from "next/link";
import { useState } from "react";
import { genres, pricing } from "@/lib/data";

export default function PricingTabs({ initial }: { initial: string }) {
  const [active, setActive] = useState(initial);

  return (
    <>
      <div className="tabs" role="tablist">
        {genres.map((g) => (
          <button
            key={g.slug}
            role="tab"
            aria-selected={active === g.slug}
            className={`tab${active === g.slug ? " active" : ""}`}
            onClick={() => setActive(g.slug)}
          >
            {g.title}
          </button>
        ))}
      </div>

      <div className="container" style={{ paddingBlock: "clamp(48px, 6vw, 96px)" }}>
        <div className="tiers">
          {pricing[active].map((t) => (
            <article key={t.name} className={`tier${t.featured ? " featured dark" : " light"}`}>
              <div className="flex-between" style={{ alignItems: "center" }}>
                <span className="eyebrow">{t.name}</span>
                {t.featured && <span className="eyebrow muted">Most loved</span>}
              </div>
              <div>
                <p className="serif price">
                  <small>RM</small>
                  {t.price.toLocaleString()}
                </p>
                <p className="muted" style={{ marginTop: 10 }}>
                  {t.duration}
                </p>
              </div>
              <ul>
                {t.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link href={`/book?genre=${active}&package=${encodeURIComponent(t.name)}`} className="btn">
                Book {t.name} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
