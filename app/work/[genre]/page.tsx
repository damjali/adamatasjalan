import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import { E } from "@/components/E";
import GenreHero from "@/components/GenreHero";
import { Reveal, RevealLines } from "@/components/Reveal";
import { getContent } from "@/lib/content";
import { getPriceData } from "@/lib/content";
import { getPortfolio } from "@/lib/portfolio";

// Always rendered on request so photos added to Drive show up straight away.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ genre: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ genres }, { genre: slug }] = await Promise.all([getContent(), params]);
  const g = genres.find((x) => x.slug === slug);
  return { title: g?.title ?? "Work" };
}

export default async function GenrePage({ params }: Props) {
  const [c, { genre: slug }] = await Promise.all([getContent(), params]);
  const { genres } = c;
  const genre = genres.find((x) => x.slug === slug);
  if (!genre) notFound();

  const portfolio = await getPortfolio();
  const content = portfolio.genres[genre.slug];
  const i = genres.indexOf(genre);
  const { pricing, text } = await getPriceData();
  const from = Math.min(...pricing[genre.slug].map((t) => t.price));

  return (
    <>
      <section className="light">
        <div className="page-head">
          <div className="page-head-row">
            <div>
              <Reveal>
                <p className="eyebrow muted" style={{ marginBottom: 24 }}>
                  {c.e("work_eyebrow", { n: String(i + 1) })}
                </p>
              </Reveal>
              <RevealLines className="serif display" lines={[
                  <em key="t">
                    <E k={`genre.${genre.slug}.title`} raw={genre.title}>
                      {genre.title}
                    </E>
                  </em>,
                ]} />
            </div>
          </div>
        </div>

        <GenreHero
          shots={content.projects.flatMap((p) => p.shots.map((s) => ({ src: s.src, name: p.name, w: s.w, h: s.h })))}
        />
        <div className="container">
          <div className="genre-meta">
            <div>
              <span className="eyebrow muted">{c.e("work_services_label")}</span>
              <span>{c.e("work_services_value")}</span>
            </div>
            <div>
              <span className="eyebrow muted">{text.from_label}</span>
              <span>{text.currency} {from.toLocaleString()}</span>
              <Link
                href={`/pricing?genre=${genre.slug}`}
                className="btn"
                style={{ justifySelf: "start", marginTop: 10 }}
              >
                {c.e("work_price_button", { category: genre.label })}
              </Link>
            </div>
          </div>
        </div>

        <div className="section container" style={{ paddingTop: "clamp(32px, 5vw, 64px)" }}>
          {content.projects.length === 0 && (
            <p className="eyebrow muted" style={{ textAlign: "center" }}>
              {c.e("work_empty")}
            </p>
          )}

          {content.projects.map((project, n) => (
            <div className="project" key={project.slug}>
              <div className="project-head">
                <span className="eyebrow muted">{String(n + 1).padStart(2, "0")}</span>
                <h2 className="serif h2">{project.name}</h2>
                <span className="eyebrow muted">{project.shots.length === 1
                    ? c.e("work_photos_one")
                    : c.e("work_photos_many", { n: String(project.shots.length) })}</span>
              </div>
              <Gallery
                shots={project.shots}
                text={{
                  close: c.t("lightbox_close"),
                  prev: c.t("lightbox_prev"),
                  next: c.t("lightbox_next"),
                  watermark: c.t("watermark"),
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
