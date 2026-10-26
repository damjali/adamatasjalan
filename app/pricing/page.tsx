import type { Metadata } from "next";
import Link from "next/link";
import Faq from "@/components/Faq";
import PricingTabs from "@/components/PricingTabs";
import { Reveal, RevealLines } from "@/components/Reveal";
import { addOns, genres } from "@/lib/data";

export const metadata: Metadata = { title: "Price List" };

type Props = { searchParams: Promise<{ genre?: string }> };

export default async function PricingPage({ searchParams }: Props) {
  const { genre } = await searchParams;
  const initial = genres.some((g) => g.slug === genre) ? genre! : genres[0].slug;

  return (
    <div className="light">
      <div className="page-head" style={{ paddingBottom: 40 }}>
        <div className="page-head-row">
          <div>
            <Reveal>
              <p className="eyebrow muted" style={{ marginBottom: 24 }}>
                ( Investment )
              </p>
            </Reveal>
            <RevealLines className="serif h1" lines={[<>Price</>, <em key="l">List</em>]} />
          </div>
          <Reveal>
            <p className="lead">
              Transparent packages for every occasion. Need something different? Every package can be
              tailored — just ask.
            </p>
          </Reveal>
        </div>
      </div>

      <PricingTabs initial={initial} />

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="split">
          <p className="eyebrow">( Add-ons )</p>
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
          <p className="eyebrow">( FAQ )</p>
          <Reveal>
            <Faq />
          </Reveal>
        </div>
      </section>

      <section className="section dark container">
        <div className="cta">
          <RevealLines className="serif h2" lines={[<>Found your package?</>]} />
          <Link href="/book" className="btn">
            Check availability →
          </Link>
        </div>
      </section>
    </div>
  );
}
