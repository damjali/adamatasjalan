import Image from "next/image";
import Link from "next/link";
import { genres } from "@/lib/data";
import { getPortfolio } from "@/lib/portfolio";

export default async function HorizontalGallery() {
  const portfolio = await getPortfolio();

  // Two photos per genre: the first and one from the middle.
  const picks = genres.flatMap((genre) => {
    const shots = portfolio.genres[genre.slug].projects.flatMap((p) => p.shots);
    const chosen = shots.length > 1 ? [shots[0], shots[Math.floor(shots.length / 2)]] : shots;
    return chosen.map((shot) => ({ ...shot, genre }));
  });

  if (picks.length === 0) return null;

  return (
    <section className="hscroll dark">
      <div className="hscroll-sticky">
        <div className="hscroll-track">
          <div className="hscroll-intro">
            <p className="eyebrow muted">( Recent Frames )</p>
            <h2 className="serif h2">
              A year <em>on the road</em>
            </h2>
            <p className="muted" style={{ maxWidth: "32ch" }}>
              Swipe or scroll sideways to browse recent work.
            </p>
          </div>
          {picks.map((p, i) => (
            <figure className="hscroll-card" key={p.src}>
              <Link href={`/work/${p.genre.slug}`}>
                <div className="frame">
                  <Image src={p.src} alt={p.alt} fill sizes="(max-width: 860px) 70vw, 32vw" />
                </div>
              </Link>
              <figcaption>
                <span className="eyebrow">{p.genre.title}</span>
                <span className="eyebrow muted">{String(i + 1).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
