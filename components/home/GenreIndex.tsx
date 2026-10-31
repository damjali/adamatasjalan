import Image from "next/image";
import Link from "next/link";
import { E } from "@/components/E";
import { getContent } from "@/lib/content";
import { getPortfolio } from "@/lib/portfolio";

export default async function GenreIndex() {
  const portfolio = await getPortfolio();
  const c = await getContent();
  const { genres } = c;

  return (
    <section className="section light container" style={{ paddingTop: 0 }}>
      <div className="flex-between" style={{ marginBottom: 48 }}>
        <p className="eyebrow">{c.e("selected_label")}</p>
        <p className="eyebrow muted">{c.e("selected_count")}</p>
      </div>

      <ul className="genre-list">
        {genres.map((g, i) => {
          const cover = portfolio.genres[g.slug].cover;
          return (
            <li key={g.slug}>
              <Link href={`/work/${g.slug}`} className="genre-row">
                <span className="eyebrow muted">0{i + 1}</span>
                <span className="serif">
                  {(() => {
                    const title = (
                      <E k={`genre.${g.slug}.title`} raw={g.title}>
                        {g.title}
                      </E>
                    );
                    return i % 2 ? <em>{title}</em> : title;
                  })()}
                </span>
                <span className="thumb">
                  {cover && <Image src={cover.src} alt="" fill sizes="90px" style={{ objectFit: "cover" }} />}
                </span>
                <span className="eyebrow arrow">{c.e("selected_view")}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
