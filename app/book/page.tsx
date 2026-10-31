import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { Reveal, RevealLines } from "@/components/Reveal";
import { getContent } from "@/lib/content";
import { richLines } from "@/lib/rich";
import { getPriceData } from "@/lib/sheet";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getContent()).t("book_meta_title") };
}

type Props = { searchParams: Promise<{ genre?: string; package?: string }> };

export default async function BookPage({ searchParams }: Props) {
  const params = await searchParams;
  const [{ pricing, text }, c] = await Promise.all([getPriceData(), getContent()]);
  const { genres } = c;
  const genre = genres.some((g) => g.slug === params.genre) ? params.genre! : genres[0].slug;

  return (
    <section className="dark" style={{ minHeight: "100vh" }}>
      <div className="page-head">
        <Reveal>
          <p className="eyebrow muted" style={{ marginBottom: 24 }}>
            {c.t("book_label")}
          </p>
        </Reveal>
        <RevealLines className="serif h1" lines={richLines(c.t("book_title"))} />
      </div>

      <div className="container section" style={{ paddingTop: 0 }}>
        <div className="book-grid">
          <Reveal>
            <ul className="contact-list">
              <li>
                <span className="eyebrow muted">{c.t("book_email_label")}</span>
                <a href={`mailto:${c.t("contact_email")}`}>{c.t("contact_email")}</a>
              </li>
              <li>
                <span className="eyebrow muted">{c.t("book_whatsapp_label")}</span>
                <a href={`https://wa.me/${c.t("contact_whatsapp")}`}>{c.t("contact_whatsapp_display")}</a>
              </li>
              <li>
                <span className="eyebrow muted">{c.t("book_studio_label")}</span>
                <span>{c.t("contact_location")}</span>
              </li>
            </ul>
          </Reveal>
          <Reveal>
            <BookingForm
              genre={genre}
              pkg={params.package}
              pricing={pricing}
              currency={text.currency}
              genres={genres}
              text={c.all}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
