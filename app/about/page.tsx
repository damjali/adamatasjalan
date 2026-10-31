import type { Metadata } from "next";
import Link from "next/link";
import Counter from "@/components/Counter";
import ParallaxImage from "@/components/ParallaxImage";
import { Reveal, RevealLines } from "@/components/Reveal";
import { getContent } from "@/lib/content";
import { rich, richLines } from "@/lib/rich";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getContent()).t("about_meta_title") };
}

export default async function AboutPage() {
  const c = await getContent();
  const { stats, steps, gear } = c;
  const portrait = "/adam.webp";

  return (
    <>
      <section className="light">
        <div className="page-head">
          <Reveal>
            <p className="eyebrow muted" style={{ marginBottom: 24 }}>
              {c.t("about_label")}
            </p>
          </Reveal>
          <RevealLines
            className="serif h1"
            lines={richLines(c.t("about_title"))}
          />
        </div>

        <div className="container section" style={{ paddingTop: 0 }}>
          <div className="about-grid">
            <div className="portrait">
              <ParallaxImage src={portrait} alt={c.t("about_photo_alt")} priority />
            </div>
            <Reveal className="prose">
              <p className="serif h3" style={{ lineHeight: 1.2, marginBottom: 40 }}>
                {rich(c.t("about_lead"))}
              </p>
              {["about_p1", "about_p2", "about_p3"].map(
                (k) => c.t(k) && (
                  <p className="muted" key={k}>
                    {rich(c.t(k))}
                  </p>
                )
              )}
              <div style={{ marginTop: 48 }}>
                <Link href="/book" className="btn solid">
                  {c.t("about_button")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section dark container">
        <p className="eyebrow muted" style={{ marginBottom: 40 }}>
          {c.t("stats_label")}
        </p>
        <div className="stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <p className="serif">
                <Counter to={s.value} />
                {s.suffix}
              </p>
              <p className="eyebrow muted" style={{ marginTop: 12 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section light container">
        <div className="flex-between" style={{ marginBottom: 64 }}>
          <RevealLines className="serif h2" lines={richLines(c.t("process_title"))} />
          <p className="eyebrow muted">{c.t("process_label")}</p>
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <Reveal key={s.title} className="step">
              <span className="eyebrow muted">0{i + 1}</span>
              <h3 className="serif h3">{s.title}</h3>
              <p className="muted">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section light container" style={{ paddingTop: 0 }}>
        <div className="split">
          <p className="eyebrow">{c.t("gear_label")}</p>
          <Reveal>
            <ul className="rows">
              {gear.map((g, i) => (
                <li key={g}>
                  <span className="serif h3">{g}</span>
                  <span className="eyebrow muted" style={{ alignSelf: "center" }}>
                    0{i + 1}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
