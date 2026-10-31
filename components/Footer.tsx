import Link from "next/link";
import { getContent } from "@/lib/content";
import { rich } from "@/lib/rich";

export default async function Footer() {
  const c = await getContent();
  const { genres } = c;
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="serif h3" style={{ maxWidth: "14ch", lineHeight: 1.1 }}>
            {rich(c.t("footer_tagline"))}
          </p>
        </div>
        <div>
          <h4 className="eyebrow">{c.t("footer_work")}</h4>
          <ul>
            {genres.map((g) => (
              <li key={g.slug}>
                <Link href={`/work/${g.slug}`}>{g.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="eyebrow">{c.t("footer_studio")}</h4>
          <ul>
            <li><Link href="/pricing">{c.t("nav_pricing")}</Link></li>
            <li><Link href="/about">{c.t("nav_about")}</Link></li>
            <li><Link href="/book">{c.t("nav_book")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow">{c.t("footer_hello")}</h4>
          <ul>
            <li><a href={`mailto:${c.t("contact_email")}`}>{c.t("contact_email")}</a></li>
            <li><a href={c.t("instagram_url")} target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href={c.t("tiktok_url")} target="_blank" rel="noreferrer">TikTok</a></li>
            <li><a href={`https://wa.me/${c.t("contact_whatsapp")}`} target="_blank" rel="noreferrer">{c.t("footer_whatsapp")}</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-big serif">
        {rich(c.t("footer_name"))}
      </div>
      <div className="footer-base">
        <span>{c.t("footer_copyright").replace("{year}", String(new Date().getFullYear()))}</span>
        <span>{c.t("footer_note")}</span>
      </div>
    </footer>
  );
}
