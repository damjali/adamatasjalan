import type { Metadata } from "next";
import Link from "next/link";
import Faq from "@/components/Faq";
import PricingTabs from "@/components/PricingTabs";
import { Reveal, RevealLines } from "@/components/Reveal";
import { getContent } from "@/lib/content";
import { getPriceData } from "@/lib/sheet";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getContent()).t("nav_pricing") };
}

type Props = { searchParams: Promise<{ genre?: string }> };

export default async function PricingPage({ searchParams }: Props) {
  const { genre } = await searchParams;
  const [{ pricing, addOns, faqs, text }, { genres }] = await Promise.all([getPriceData(), getContent()]);
  const initial = genres.some((g) => g.slug === genre) ? genre! : genres[0].slug;

  return (
    <div className="light">
      <div className="page-head" style={{ paddingBottom: 40 }}>
        <div className="page-head-row">
          <div>
            <Reveal>
              <p className="eyebrow muted" style={{ marginBottom: 24 }}>
                {text.pricing_eyebrow}
              </p>
            </Reveal>
            <RevealLines className="serif h1" lines={[<>{text.pricing_title_1}</>, <em key="l">{text.pricing_title_2}</em>]} />
          </div>
        </div>
      </div>

      <PricingTabs initial={initial} pricing={pricing} text={text} genres={genres} />

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="split">
          <p className="eyebrow">{text.addons_label}</p>
          <Reveal>
            <ul className="rows">
              {addOns.map((a) => (
                <li key={a.name}>
                  <span className="serif h3">{a.name}</span>
                  <span className="eyebrow" style={{ alignSelf: "center" }}>
                    {a.price}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="split">
          <p className="eyebrow">{text.faq_label}</p>
          <Reveal>
            <Faq faqs={faqs} />
          </Reveal>
        </div>
      </section>

      <section className="section dark container">
        <div className="cta">
          <RevealLines className="serif h2" lines={[<>{text.cta_title}</>]} />
          <Link href="/book" className="btn">
            {text.cta_button}
          </Link>
        </div>
      </section>
    </div>
  );
}
