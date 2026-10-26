"use client";

import { useState } from "react";
import { genres, pricing } from "@/lib/data";

export default function BookingForm({ genre, pkg }: { genre: string; pkg?: string }) {
  const [selected, setSelected] = useState(genre);
  const [sent, setSent] = useState(false);

  // No backend yet — wire this up to email, a form service or an API route later.
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div>
        <p className="eyebrow muted" style={{ marginBottom: 24 }}>
          ( Received )
        </p>
        <p className="serif h2">
          Thank you — <em>talk soon.</em>
        </p>
        <p className="muted" style={{ marginTop: 24, maxWidth: "40ch" }}>
          Your enquiry is in. I personally reply to every message within 24 hours with availability
          and next steps.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label className="eyebrow" htmlFor="name">Full name</label>
        <input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="field">
        <label className="eyebrow" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label className="eyebrow" htmlFor="phone">Phone / WhatsApp</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="field">
        <label className="eyebrow" htmlFor="date">Event date</label>
        <input id="date" name="date" type="date" required />
      </div>
      <div className="field">
        <label className="eyebrow" htmlFor="genre">Type of shoot</label>
        <select id="genre" name="genre" value={selected} onChange={(e) => setSelected(e.target.value)}>
          {genres.map((g) => (
            <option key={g.slug} value={g.slug}>{g.title}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label className="eyebrow" htmlFor="package">Package</label>
        <select id="package" name="package" key={selected} defaultValue={pkg}>
          {pricing[selected].map((t) => (
            <option key={t.name} value={t.name}>
              {t.name} — RM {t.price.toLocaleString()}
            </option>
          ))}
          <option value="custom">Something custom</option>
        </select>
      </div>
      <div className="field full">
        <label className="eyebrow" htmlFor="location">Location</label>
        <input id="location" name="location" placeholder="Venue, city" />
      </div>
      <div className="field full">
        <label className="eyebrow" htmlFor="message">Tell me about it</label>
        <textarea id="message" name="message" placeholder="The story, the vibe, anything I should know…" />
      </div>
      <div className="field full">
        <button type="submit" className="btn" style={{ justifySelf: "start" }}>
          Send enquiry →
        </button>
      </div>
    </form>
  );
}
