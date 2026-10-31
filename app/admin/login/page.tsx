"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: f.get("username"), password: f.get("password") }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      window.location.href = "/";
    } else {
      setError(data.error ?? "Could not log in.");
      setBusy(false);
    }
  };

  return (
    <section className="dark" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "120px var(--gutter)" }}>
      <form className="form" onSubmit={onSubmit} style={{ width: "min(420px, 100%)", gridTemplateColumns: "1fr" }}>
        <p className="eyebrow muted">( Admin )</p>
        <h1 className="serif h2">
          Log <em>in</em>
        </h1>
        <div className="field">
          <label className="eyebrow" htmlFor="username">Username</label>
          <input id="username" name="username" autoComplete="username" required autoFocus />
        </div>
        <div className="field">
          <label className="eyebrow" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        {error && <p role="alert">{error}</p>}
        <button type="submit" className="btn" disabled={busy} style={{ justifySelf: "start" }}>
          {busy ? "Checking…" : "Log in →"}
        </button>
      </form>
    </section>
  );
}
