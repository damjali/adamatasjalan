"use client";

import { useRef, useState } from "react";

type Entry = { key: string; value: string; note: string; group: string };

export default function AdminTexts({ entries }: { entries: Entry[] }) {
  const [status, setStatus] = useState<Record<string, string>>({});
  const saved = useRef<Record<string, string>>({});
  const groups = [...new Set(entries.map((e) => e.group))];

  const save = async (key: string, value: string, initial: string) => {
    if (value === (saved.current[key] ?? initial)) return;
    setStatus((s) => ({ ...s, [key]: "Saving…" }));
    const res = await fetch("/api/admin/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) saved.current[key] = value;
    setStatus((s) => ({ ...s, [key]: res.ok ? "Saved ✓" : (data.error ?? "Could not save") }));
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {groups.map((group, gi) => (
        <details key={group} open={gi === 0} style={{ borderTop: "1px solid var(--line-light)", paddingTop: 16 }}>
          <summary className="serif h3" style={{ cursor: "pointer", paddingBottom: 12 }}>
            {group}
          </summary>
          <div style={{ display: "grid", gap: 20, paddingBlock: 16 }}>
            {entries
              .filter((e) => e.group === group)
              .map((e) => (
                <div key={e.key} className="field" style={{ display: "grid", gap: 6 }}>
                  <label className="eyebrow muted" htmlFor={e.key}>
                    {e.note} <span style={{ opacity: 0.6 }}>· {e.key}</span>
                  </label>
                  <textarea
                    id={e.key}
                    defaultValue={e.value}
                    rows={e.value.length > 90 ? 3 : 1}
                    style={{ width: "100%", resize: "vertical", padding: 10, border: "1px solid var(--line-light)", background: "transparent", font: "inherit" }}
                    onBlur={(ev) => save(e.key, ev.target.value, e.value)}
                  />
                  {status[e.key] && <span className="eyebrow">{status[e.key]}</span>}
                </div>
              ))}
          </div>
        </details>
      ))}
    </div>
  );
}
