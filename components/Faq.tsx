"use client";

import { useState } from "react";
import { E } from "@/components/E";
import type { Faq as FaqItem } from "@/lib/content";

export default function Faq({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="rows">
      {faqs.map((f, i) => (
        <div key={f.i} style={{ borderBottom: "1px solid var(--line-light)" }}>
          <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            <E k={`faq.${f.i}.q`} raw={f.q}>
              {f.q}
            </E>
            <span className="plus">+</span>
          </button>
          {open === i && (
            <div className="faq-a">
              <p>
                <E k={`faq.${f.i}.a`} raw={f.a}>
                  {f.a}
                </E>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
