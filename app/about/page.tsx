import type { Metadata } from "next";
import Link from "next/link";
import Counter from "@/components/Counter";
import ParallaxImage from "@/components/ParallaxImage";
import { Reveal, RevealLines } from "@/components/Reveal";
import { getPortfolio } from "@/lib/portfolio";

// Always rendered on request so photos added to Drive show up straight away.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "About Me" };

const stats = [
  { value: 8, suffix: "+", label: "Years behind the lens" },
  { value: 240, suffix: "+", label: "Weddings & events" },
  { value: 1200, suffix: "+", label: "Graduates celebrated" },
  { value: 15, suffix: "", label: "Countries shot in" },
];

const steps = [
  { title: "Enquire", text: "Tell me about your day, your vision and the moments that matter most." },
  { title: "Plan", text: "A call to map timelines, locations and the shots you can't live without." },
  { title: "Shoot", text: "I blend in, guide when needed, and let the real moments happen." },
  { title: "Deliver", text: "A carefully edited gallery and film, ready to share and keep forever." },
];

const gear = [
  "Sony A1 & A7S III",
  "24–70mm f/2.8 GM II",
  "70–200mm f/2.8 GM II",
  "35mm & 85mm f/1.4 primes",
  "DJI Mavic 3 Pro",
  "DJI RS 4 Pro gimbal",
];

export default async function AboutPage() {
  const portfolio = await getPortfolio();
  const portrait = portfolio.about[0]?.src ?? "https://picsum.photos/seed/aaj-portrait/1200/1500";

  return (
    <>
      <section className="light">
        <div className="page-head">
          <Reveal>
            <p className="eyebrow muted" style={{ marginBottom: 24 }}>
              ( About Me )
            </p>
          </Reveal>
          <RevealLines
            className="serif h1"
            lines={[<>The person</>, <>behind the <em>frame</em></>]}
          />
        </div>

        <div className="container section" style={{ paddingTop: 0 }}>
          <div className="about-grid">
            <div className="portrait">
              <ParallaxImage src={portrait} alt="Portrait of Adam" priority />
            </div>
            <Reveal className="prose">
              <p className="serif h3" style={{ lineHeight: 1.2, marginBottom: 40 }}>
                Hi, I&apos;m Adam — a photographer and filmmaker based in Kuala Lumpur, usually found
                somewhere <em>atas jalan</em>: on the road.
              </p>
              <p className="muted">
                What started as borrowing my father&apos;s camera for a cousin&apos;s wedding turned into a
                lifelong obsession with light and timing. Today I photograph convocations, weddings,
                athletes, portraits and events across Malaysia and beyond.
              </p>
              <p className="muted">
                My style is quiet and documentary: I&apos;d rather catch a real laugh than ask for a fake
                one. Clean, timeless edits that look as good in twenty years as they do today.
              </p>
              <p className="muted">
                When I&apos;m not shooting, I&apos;m chasing sunrises with a film camera, or on a long drive
                with no particular destination.
              </p>
              <div style={{ marginTop: 48 }}>
                <Link href="/book" className="btn solid">
                  Work with me →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section dark container">
        <p className="eyebrow muted" style={{ marginBottom: 40 }}>
          ( By the numbers )
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
          <RevealLines className="serif h2" lines={[<>How we&apos;ll</>, <em key="w">work together</em>]} />
          <p className="eyebrow muted">( Process )</p>
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
          <p className="eyebrow">( In the bag )</p>
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
