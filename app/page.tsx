import Link from "next/link";
import Hero from "@/components/home/Hero";
import Statement from "@/components/home/Statement";
import GenreIndex from "@/components/home/GenreIndex";
import HorizontalGallery from "@/components/home/HorizontalGallery";
import { Reveal, RevealLines } from "@/components/Reveal";
import { getPortfolio } from "@/lib/portfolio";

// Always rendered on request so photos added to Drive show up straight away.
export const dynamic = "force-dynamic";

const marquee = (
  <>
    <span>Now booking 2026 &amp; 2027</span>
    <span>—</span>
    <span>
      <em>Photo</em> &amp; <em>Film</em>
    </span>
    <span>—</span>
  </>
);

export default async function Home() {
  const portfolio = await getPortfolio();
  const hero =
    portfolio.home[0] ??
    Object.values(portfolio.genres).find((g) => g.cover)?.cover ??
    null;

  return (
    <>
      <Hero src={hero?.src ?? "https://picsum.photos/seed/aaj-hero/2400/1600"} />
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
            <p className="eyebrow muted">( Kind Words )</p>
          </Reveal>
          <Reveal>
            <blockquote className="serif">
              &ldquo;We barely noticed he was there — then the photos arrived and we cried all over
              again. <em>Every single moment</em> was in there.&rdquo;
            </blockquote>
          </Reveal>
          <Reveal>
            <p className="eyebrow">Aina &amp; Haziq — Wedding, Kuala Lumpur</p>
          </Reveal>
        </div>
      </section>

      <section className="section dark container">
        <div className="cta">
          <p className="eyebrow muted">( Let&apos;s work together )</p>
          <RevealLines
            className="serif h1"
            lines={[
              <>Let&apos;s make</>,
              <>
                something <em>timeless.</em>
              </>,
            ]}
          />
          <Reveal>
            <Link href="/book" className="btn">
              Book your date →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
