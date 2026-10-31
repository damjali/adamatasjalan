import Link from "next/link";
import { getContent } from "@/lib/content";
import { E } from "@/components/E";

export default async function Footer() {
  const c = await getContent();
  const { genres } = c;
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="serif h3" style={{ maxWidth: "14ch", lineHeight: 1.1 }}>
            {c.e("footer_tagline")}
          </p>
        </div>
        <div>
          <h4 className="eyebrow">{c.e("footer_work")}</h4>
          <ul>
            {genres.map((g) => (
              <li key={g.slug}>
                <Link href={`/work/${g.slug}`}>
                  <E k={`genre.${g.slug}.title`} raw={g.title}>
                    {g.title}
                  </E>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="eyebrow">{c.e("footer_studio")}</h4>
          <ul>
            <li><Link href="/pricing">{c.e("nav_pricing")}</Link></li>
            <li><Link href="/about">{c.e("nav_about")}</Link></li>
            <li><Link href="/book">{c.e("nav_book")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow">{c.e("footer_hello")}</h4>
          <ul>
            <li><a href={`mailto:${c.t("contact_email")}`}>{c.e("contact_email")}</a></li>
            <li><a href={c.t("instagram_url")} target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href={c.t("tiktok_url")} target="_blank" rel="noreferrer">TikTok</a></li>
            <li><a href={`https://wa.me/${c.t("contact_whatsapp")}`} target="_blank" rel="noreferrer">{c.e("footer_whatsapp")}</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-big">
        <span className="logo-mark" role="img" aria-label="adam atas jalan" />
      </div>
      <div className="footer-base">
        <span>{c.e("footer_copyright", { year: String(new Date().getFullYear()) })}</span>
        <span>{c.e("footer_note")}</span>
      </div>
      <p style={{ marginTop: 28, textAlign: "center" }}>
        <Link href="/admin/login" className="admin-link">
          Login as admin
        </Link>
      </p>
    </footer>
  );
}
