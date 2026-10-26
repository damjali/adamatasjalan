import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { Reveal, RevealLines } from "@/components/Reveal";
import { genres } from "@/lib/data";

export const metadata: Metadata = { title: "Book Now" };

type Props = { searchParams: Promise<{ genre?: string; package?: string }> };

export default async function BookPage({ searchParams }: Props) {
  const params = await searchParams;
  const genre = genres.some((g) => g.slug === params.genre) ? params.genre! : genres[0].slug;

  return (
    <section className="dark" style={{ minHeight: "100vh" }}>
      <div className="page-head">
        <Reveal>
          <p className="eyebrow muted" style={{ marginBottom: 24 }}>
            ( Book Now )
          </p>
        </Reveal>
        <RevealLines className="serif h1" lines={[<>Let&apos;s tell</>, <>your <em>story.</em></>]} />
      </div>

      <div className="container section" style={{ paddingTop: 0 }}>
        <div className="book-grid">
          <Reveal>
            <ul className="contact-list">
              <li>
                <span className="eyebrow muted">Email</span>
                <a href="mailto:AdamRazali54@gmail.com">AdamRazali54@gmail.com</a>
              </li>
              <li>
                <span className="eyebrow muted">WhatsApp</span>
                <a href="https://wa.me/60174020027">+60 17-402 0027</a>
              </li>
              <li>
                <span className="eyebrow muted">Studio</span>
                <span>Kuala Lumpur, Malaysia</span>
              </li>
            </ul>
          </Reveal>
          <Reveal>
            <BookingForm genre={genre} pkg={params.package} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
