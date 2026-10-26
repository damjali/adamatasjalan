"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { genres } from "@/lib/data";

const leftLinks = [
  { href: "/pricing", label: "Price List" },
  { href: "/about", label: "About Me" },
  { href: "/book", label: "Book Now" },
];

const rightLinks = genres.map((g) => ({ href: `/work/${g.slug}`, label: g.label }));

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Nav backdrop: none at the top of the page, fading in as you scroll down.
  useEffect(() => {
    const update = () => {
      const el = headerRef.current;
      if (!el) return;
      const fade = Math.min(1, window.scrollY / 160);
      el.style.setProperty("--fade", String(fade));
      el.classList.toggle("scrolled", fade > 0.35);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const link = (l: { href: string; label: string }) => (
    <Link
      key={l.href}
      href={l.href}
      className={`nav-link${pathname === l.href ? " active" : ""}`}
    >
      {l.label}
    </Link>
  );

  return (
    <>
      <header className="header" ref={headerRef}>
        <nav className="nav" aria-label="Studio">
          {leftLinks.map(link)}
        </nav>
        <Link href="/" className="brand" aria-label="Home">
          <span>adam</span>
          <em>atas</em>
          <span>jalan</span>
        </Link>
        <nav className="nav right" aria-label="Genres">
          {rightLinks.map(link)}
        </nav>
        <button className="menu-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? "Close" : "Menu"}
        </button>
      </header>

      {open && (
        <div className="mobile-menu">
          {[
            { title: "Work", items: rightLinks },
            { title: "Studio", items: leftLinks },
          ].map((group) => (
            <div key={group.title}>
              <p className="eyebrow muted" style={{ marginBottom: 12 }}>
                {group.title}
              </p>
              <ul>
                {group.items.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
