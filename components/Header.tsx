"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { E } from "@/components/E";
import type { Genre } from "@/lib/data";

export default function Header({ genres, text }: { genres: Genre[]; text: Record<string, string> }) {
  const leftLinks = [
    { href: "/pricing", label: text.nav_pricing, key: "nav_pricing" },
    { href: "/about", label: text.nav_about, key: "nav_about" },
    { href: "/book", label: text.nav_book, key: "nav_book" },
  ];
  const rightLinks = genres.map((g) => ({ href: `/work/${g.slug}`, label: g.label, key: `genre.${g.slug}.label` }));

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

  const link = (l: { href: string; label: string; key: string }) => (
    <Link
      key={l.href}
      href={l.href}
      className={`nav-link${pathname === l.href ? " active" : ""}`}
    >
      <E k={l.key} raw={l.label}>
        {l.label}
      </E>
    </Link>
  );

  return (
    <>
      <header className="header" ref={headerRef}>
        <nav className="nav" aria-label="Studio">
          {leftLinks.map(link)}
        </nav>
        <Link href="/" className="brand" aria-label="Home">
          <span className="logo-mark" role="img" aria-label="adam atas jalan" />
        </Link>
        <nav className="nav right" aria-label="Genres">
          {rightLinks.map(link)}
        </nav>
        <button className="menu-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? text.menu_close : text.menu_open}
        </button>
      </header>

      {open && (
        <div className="mobile-menu">
          {[
            { title: text.menu_work, items: rightLinks },
            { title: text.menu_studio, items: leftLinks },
          ].map((group) => (
            <div key={group.title}>
              <p className="eyebrow muted" style={{ marginBottom: 12 }}>
                {group.title}
              </p>
              <ul>
                {group.items.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>
                      <E k={l.key} raw={l.label}>
                        {l.label}
                      </E>
                    </Link>
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
