import Link from "next/link";
import { genres } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="serif h3" style={{ maxWidth: "14ch", lineHeight: 1.1 }}>
            Photography &amp; film for the moments worth <em>keeping.</em>
          </p>
        </div>
        <div>
          <h4 className="eyebrow">Work</h4>
          <ul>
            {genres.map((g) => (
              <li key={g.slug}>
                <Link href={`/work/${g.slug}`}>{g.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="eyebrow">Studio</h4>
          <ul>
            <li><Link href="/pricing">Price List</Link></li>
            <li><Link href="/about">About Me</Link></li>
            <li><Link href="/book">Book Now</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow">Say hello</h4>
          <ul>
            <li><a href="mailto:AdamRazali54@gmail.com">AdamRazali54@gmail.com</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a></li>
            <li><a href="https://wa.me/60000000000" target="_blank" rel="noreferrer">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-big serif">
        Adam <em>atas</em> Jalan
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} Adam Atas Jalan. All rights reserved.</span>
        <span>Based in Kuala Lumpur — available worldwide</span>
      </div>
    </footer>
  );
}
