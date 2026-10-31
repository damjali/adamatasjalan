"use client";

import { useState } from "react";
import type { Genre, Tier } from "@/lib/data";
import { rich } from "@/lib/rich";

export default function BookingForm({
  genre,
  pkg,
  pricing,
  currency,
  genres,
  text,
}: {
  genre: string;
  pkg?: string;
  pricing: Record<string, Tier[]>;
  currency: string;
  genres: Genre[];
  text: Record<string, string>;
}) {
  const [selected, setSelected] = useState(genre);
  const [sent, setSent] = useState(false);

  // Opens WhatsApp with the enquiry details pre-filled for the photographer.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const genreTitle = genres.find((g) => g.slug === get("genre"))?.title ?? get("genre");
    const lines = [
      text.wa_intro,
      "",
      `*${text.form_name}:* ${get("name")}`,
      `*${text.form_email}:* ${get("email")}`,
      get("phone") ? `*${text.form_phone}:* ${get("phone")}` : false,
      `*${text.form_date}:* ${get("date")}`,
      `*${text.form_genre}:* ${genreTitle}`,
      `*${text.form_package}:* ${get("package")}`,
      get("location") ? `*${text.form_location}:* ${get("location")}` : false,
      get("message") ? `*${text.form_message}:* ${get("message")}` : false,
    ].filter((l): l is string => l !== false);
    const url = `https://wa.me/${text.contact_whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
    setSent(true);
  };

  if (sent) {
    return (
      <div>
        <p className="eyebrow muted" style={{ marginBottom: 24 }}>
          {text.thanks_label}
        </p>
        <p className="serif h2">
          {rich(text.thanks_title)}
        </p>
        <p className="muted" style={{ marginTop: 24, maxWidth: "40ch" }}>
          {text.thanks_text}
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label className="eyebrow" htmlFor="name">{text.form_name}</label>
        <input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="field">
        <label className="eyebrow" htmlFor="email">{text.form_email}</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label className="eyebrow" htmlFor="phone">{text.form_phone}</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="field">
        <label className="eyebrow" htmlFor="date">{text.form_date}</label>
        <input id="date" name="date" type="date" required />
      </div>
      <div className="field">
        <label className="eyebrow" htmlFor="genre">{text.form_genre}</label>
        <select id="genre" name="genre" value={selected} onChange={(e) => setSelected(e.target.value)}>
          {genres.map((g) => (
            <option key={g.slug} value={g.slug}>{g.title}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label className="eyebrow" htmlFor="package">{text.form_package}</label>
        <select id="package" name="package" key={selected} defaultValue={pkg}>
          {pricing[selected].map((t) => (
            <option key={t.name} value={t.name}>
              {t.name} — {currency} {t.price.toLocaleString()}
            </option>
          ))}
          <option value="custom">{text.form_custom}</option>
        </select>
      </div>
      <div className="field full">
        <label className="eyebrow" htmlFor="location">{text.form_location}</label>
        <input id="location" name="location" placeholder={text.form_location_hint} />
      </div>
      <div className="field full">
        <label className="eyebrow" htmlFor="message">{text.form_message}</label>
        <textarea id="message" name="message" placeholder={text.form_message_hint} />
      </div>
      <div className="field full">
        <button type="submit" className="btn" style={{ justifySelf: "start" }}>
          {text.form_submit}
        </button>
      </div>
    </form>
  );
}
