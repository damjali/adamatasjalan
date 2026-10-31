"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Turns every [data-t] text on the page into an editable field while an admin is logged in.
// The page cookie only decides whether to show the editor; saving is checked on the server.
export default function AdminEditor() {
  const [on, setOn] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setOn(document.cookie.split("; ").includes("aj_admin=1"));
  }, []);

  useEffect(() => {
    if (!on) return;
    document.body.classList.add("admin-mode");

    const upgrade = () =>
      document.querySelectorAll<HTMLElement>("[data-t]:not([data-ed])").forEach((el) => {
        el.dataset.ed = "1";
        el.contentEditable = "plaintext-only";
        el.spellcheck = false;
        el.textContent = el.dataset.raw ?? "";
      });
    upgrade();
    const observer = new MutationObserver(upgrade);
    observer.observe(document.body, { childList: true, subtree: true });

    const editable = (t: EventTarget | null) => (t instanceof Element ? t.closest<HTMLElement>("[data-t]") : null);

    // Clicking text inside a link or button should edit it, not follow or trigger it.
    const stop = (e: Event) => {
      if (editable(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const keyup = (e: KeyboardEvent) => {
      if (e.key === " " && editable(document.activeElement)) e.preventDefault(); // buttons fire on space
    };

    const save = async (el: HTMLElement) => {
      const key = el.dataset.t!;
      const value = (el.textContent ?? "").replace(/ /g, " ").trim();
      if (value === (el.dataset.raw ?? "")) {
        el.textContent = value;
        return;
      }
      setStatus("Saving…");
      try {
        const res = await fetch("/api/admin/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "Could not save");
        document.querySelectorAll<HTMLElement>(`[data-t="${CSS.escape(key)}"]`).forEach((other) => {
          other.dataset.raw = value;
          if (other !== el) other.textContent = value;
        });
        el.textContent = value;
        setStatus("Saved ✓");
      } catch (err) {
        el.textContent = el.dataset.raw ?? "";
        setStatus(err instanceof Error ? err.message : "Could not save");
      }
    };

    const focusout = (e: FocusEvent) => {
      const el = editable(e.target);
      if (el) void save(el);
    };
    const keydown = (e: KeyboardEvent) => {
      const el = editable(e.target);
      if (!el) return;
      if (e.key === "Enter") {
        e.preventDefault();
        el.blur();
      } else if (e.key === "Escape") {
        el.textContent = el.dataset.raw ?? "";
        el.blur();
      }
    };

    document.addEventListener("click", stop, true);
    document.addEventListener("keyup", keyup, true);
    document.addEventListener("focusout", focusout);
    document.addEventListener("keydown", keydown);
    return () => {
      observer.disconnect();
      document.body.classList.remove("admin-mode");
      document.removeEventListener("click", stop, true);
      document.removeEventListener("keyup", keyup, true);
      document.removeEventListener("focusout", focusout);
      document.removeEventListener("keydown", keydown);
    };
  }, [on]);

  if (!on) return null;

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="admin-bar" role="status">
      <span className="eyebrow">Editing</span>
      <span className="admin-hint">Click any text, type, then click away. Enter saves.</span>
      {status && <span className="eyebrow admin-status">{status}</span>}
      <Link href="/admin" className="eyebrow">
        All texts
      </Link>
      <button className="eyebrow" onClick={logout}>
        Log out
      </button>
    </div>
  );
}
