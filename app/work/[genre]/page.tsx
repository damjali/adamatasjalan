import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import GenreHero from "@/components/GenreHero";
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
          </div>
        </div>

        <GenreHero
          shots={content.projects.flatMap((p) => p.shots.map((s) => ({ src: s.src, name: p.name, w: s.w, h: s.h })))}
        />
        <div className="container">
          <div className="genre-meta">
            <div>
              <span className="eyebrow muted">Services</span>
              <span>Photography · Videography</span>
            </div>
            <div>
              <span className="eyebrow muted">Packages from</span>
              <span>RM {from.toLocaleString()}</span>
              <Link
                href={`/pricing?genre=${genre.slug}`}
                className="btn"
                style={{ justifySelf: "start", marginTop: 10 }}
              >
                View {genre.label} price list →
              </Link>
            </div>
          </div>
        </div>

        <div className="section container">
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
    </>
  );
}
