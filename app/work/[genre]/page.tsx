import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import ParallaxImage from "@/components/ParallaxImage";
import { Reveal, RevealLines } from "@/components/Reveal";
import { genres, getGenre, pricing } from "@/lib/data";
import { getPortfolio } from "@/lib/portfolio";

// Always rendered on request so photos added to Drive show up straight away.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ genre: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGenre((await params).genre);
  return { title: g?.title ?? "Work" };
}

export default async function GenrePage({ params }: Props) {
  const genre = getGenre((await params).genre);
  if (!genre) notFound();

  const portfolio = await getPortfolio();
  const content = portfolio.genres[genre.slug];
  const i = genres.indexOf(genre);
  const next = genres[(i + 1) % genres.length];
  const nextCover = portfolio.genres[next.slug].cover;
  const from = Math.min(...pricing[genre.slug].map((t) => t.price));

  return (
    <>
      <section className="light">
        <div className="page-head">
          <div className="page-head-row">
            <div>
              <Reveal>
                <p className="eyebrow muted" style={{ marginBottom: 24 }}>
                  ( 0{i + 1} — Portfolio )
                </p>
              </Reveal>
              <RevealLines className="serif display" lines={[<em key="t">{genre.title}</em>]} />
            </div>
            <Reveal>
              <p className="lead">{genre.tagline}</p>
            </Reveal>
          </div>
        </div>

        {content.cover && (
          <div className="genre-hero">
            <ParallaxImage src={content.cover.src} alt={genre.title} priority />
          </div>
        )}

        <div className="container">
          <div className="genre-meta">
            <div>
              <span className="eyebrow muted">Services</span>
              <span>Photography · Videography</span>
            </div>
            <div>
              <span className="eyebrow muted">Packages from</span>
              <span>RM {from.toLocaleString()}</span>
            </div>
            <div>
              <span className="eyebrow muted">Availability</span>
              <span>Booking 2026 – 2027</span>
            </div>
          </div>
        </div>

        <div className="section container">
          <div className="split" style={{ marginBottom: "clamp(60px, 8vw, 120px)" }}>
            <p className="eyebrow">( About the work )</p>
            <Reveal>
              <p className="serif h3" style={{ lineHeight: 1.2, maxWidth: "28ch" }}>
                {genre.intro}
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 40 }}>
                <Link href={`/book?genre=${genre.slug}`} className="btn solid">
                  Book {genre.label} →
                </Link>
                <Link href={`/pricing?genre=${genre.slug}`} className="btn">
                  See pricing
                </Link>
              </div>
            </Reveal>
          </div>

          {content.projects.length === 0 && (
            <p className="eyebrow muted" style={{ textAlign: "center" }}>
              New work coming soon.
            </p>
          )}

          {content.projects.map((project, n) => (
            <div className="project" key={project.slug}>
              <div className="project-head">
                <span className="eyebrow muted">{String(n + 1).padStart(2, "0")}</span>
                <h2 className="serif h2">{project.name}</h2>
                <span className="eyebrow muted">{project.shots.length} {project.shots.length === 1 ? "photo" : "photos"}</span>
              </div>
              <Gallery shots={project.shots} />
            </div>
          ))}
        </div>
      </section>

      <section className="dark container">
        <Link href={`/work/${next.slug}`} className="next-genre">
          <p className="eyebrow muted" style={{ marginBottom: 24 }}>
            Next discipline
          </p>
          <span className="serif">
            <em>{next.title}</em> →
          </span>
          {nextCover && (
            <div
              style={{
                position: "relative",
                width: "min(420px, 70vw)",
                aspectRatio: "16/10",
                margin: "48px auto 0",
                overflow: "hidden",
              }}
            >
              <Image
                src={nextCover.src}
                alt=""
                fill
                sizes="420px"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
        </Link>
      </section>
    </>
  );
}
