"use client";

import Link from "next/link";
import { useState } from "react";
import type { Genre, Tier } from "@/lib/data";
import type { PriceText } from "@/lib/sheet";

export default function PricingTabs({
  initial,
  pricing,
  text,
  genres,
}: {
  initial: string;
  pricing: Record<string, Tier[]>;
  text: PriceText;
  genres: Genre[];
}) {
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
                {t.featured && <span className="eyebrow muted">{text.most_loved_label}</span>}
              </div>
              <div>
                <p className="serif price">
                  <small>{text.currency}</small>
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
                {text.book_button.replace("{name}", t.name)}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
