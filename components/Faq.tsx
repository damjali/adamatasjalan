"use client";

import { useState } from "react";
import type { Faq as FaqItem } from "@/lib/sheet";

export default function Faq({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="rows">
      {faqs.map((f, i) => (
        <div key={f.q} style={{ borderBottom: "1px solid var(--line-light)" }}>
          <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            {f.q}
            <span className="plus">+</span>
          </button>
          {open === i && (
            <div className="faq-a">
              <p>{f.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
