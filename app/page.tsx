import Link from "next/link";
import Hero from "@/components/home/Hero";
import Statement from "@/components/home/Statement";
import GenreIndex from "@/components/home/GenreIndex";
import HorizontalGallery from "@/components/home/HorizontalGallery";
import { Reveal, RevealLines } from "@/components/Reveal";
import { getContent } from "@/lib/content";
import { rich, richLines } from "@/lib/rich";

// Always rendered on request so photos added to Drive show up straight away.
export const dynamic = "force-dynamic";

export default async function Home() {
  const c = await getContent();
  const marquee = (
    <>
      <span>{rich(c.t("marquee_1"))}</span>
      <span>—</span>
      <span>{rich(c.t("marquee_2"))}</span>
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
            <p className="eyebrow muted">{c.t("quote_label")}</p>
          </Reveal>
          <Reveal>
            <blockquote className="serif">{rich(c.t("quote_text"))}</blockquote>
          </Reveal>
          <Reveal>
            <p className="eyebrow">{c.t("quote_author")}</p>
          </Reveal>
        </div>
      </section>

      <section className="section dark container">
        <div className="cta">
          <p className="eyebrow muted">{c.t("home_cta_label")}</p>
          <RevealLines
            className="serif h1"
            lines={richLines(c.t("home_cta_title"))}
          />
          <Reveal>
            <Link href="/book" className="btn">
              {c.t("home_cta_button")}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
