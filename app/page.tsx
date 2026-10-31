import Link from "next/link";
import Hero from "@/components/home/Hero";
import Statement from "@/components/home/Statement";
import GenreIndex from "@/components/home/GenreIndex";
import HorizontalGallery from "@/components/home/HorizontalGallery";
import { Reveal, RevealLines } from "@/components/Reveal";
import { getContent } from "@/lib/content";

// Always rendered on request so photos added to Drive show up straight away.
export const dynamic = "force-dynamic";

export default async function Home() {
  const c = await getContent();
  const marquee = (
    <>
      <span>{c.e("marquee_1")}</span>
      <span>—</span>
      <span>{c.e("marquee_2")}</span>
      <span>—</span>
    </>
  );

  return (
    <>
      <Hero src="/adam.webp" />
      <Statement />
      <GenreIndex />
      <HorizontalGallery />

      <section className="light" style={{ paddingBlock: "clamp(60px, 8vw, 120px)" }}>
        <div className="marquee" aria-hidden>
          <div className="marquee-track">
            {marquee}
          </div>
        </div>
      </section>

      <section className="section light container">
        <div className="quote">
          <Reveal>
            <p className="eyebrow muted">{c.e("quote_label")}</p>
          </Reveal>
          <Reveal>
            <blockquote className="serif">{c.e("quote_text")}</blockquote>
          </Reveal>
          <Reveal>
            <p className="eyebrow">{c.e("quote_author")}</p>
          </Reveal>
        </div>
      </section>

      <section className="section dark container">
        <div className="cta">
          <p className="eyebrow muted">{c.e("home_cta_label")}</p>
          <div className="serif h1">{c.eLines("home_cta_title")}</div>
          <Reveal>
            <Link href="/book" className="btn">
              {c.e("home_cta_button")}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
