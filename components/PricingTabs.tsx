"use client";

import Link from "next/link";
import { useState } from "react";
import { E } from "@/components/E";
import type { Genre } from "@/lib/data";
import type { PriceText, PriceTier } from "@/lib/content";

export default function PricingTabs({
  initial,
  pricing,
  text,
  genres,
}: {
  initial: string;
  pricing: Record<string, PriceTier[]>;
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
            <E k={`genre.${g.slug}.title`} raw={g.title}>
              {g.title}
            </E>
          </button>
        ))}
      </div>

      <div className="container" style={{ paddingBlock: "clamp(48px, 6vw, 96px)" }}>
        <div className="tiers">
          {pricing[active].map((t) => (
            <article key={t.id} className={`tier${t.featured ? " featured dark" : " light"}`}>
              <div className="flex-between" style={{ alignItems: "center" }}>
                <span className="eyebrow">
                  <E k={`${t.id}.name`} raw={t.name}>
                    {t.name}
                  </E>
                </span>
                {t.featured && (
                  <span className="eyebrow muted">
                    <E k="most_loved_label" raw={text.most_loved_label}>
                      {text.most_loved_label}
                    </E>
                  </span>
                )}
              </div>
              <div>
                <p className="serif price">
                  <small>
                    <E k="currency" raw={text.currency}>
                      {text.currency}
                    </E>
                  </small>
                  <E k={`${t.id}.price`} raw={String(t.price)}>
                    {t.price.toLocaleString()}
                  </E>
                </p>
                <p className="muted" style={{ marginTop: 10 }}>
                  <E k={`${t.id}.duration`} raw={t.duration}>
                    {t.duration}
                  </E>
                </p>
              </div>
              <ul>
                {t.features.map((f, j) => (
                  <li key={j}>
                    <E k={`${t.id}.f${j}`} raw={f}>
                      {f}
                    </E>
                  </li>
                ))}
              </ul>
              <Link href={`/book?genre=${active}&package=${encodeURIComponent(t.name)}`} className="btn">
                <E k="book_button" raw={text.book_button}>
                  {text.book_button.replace("{name}", t.name)}
                </E>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
