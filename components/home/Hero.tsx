import Image from "next/image";
import { RevealLines } from "../Reveal";

export default function Hero({ src }: { src: string }) {
  return (
    <section className="hero hero-portrait">
      <div className="hero-media">
        <Image src={src} alt="Portrait of Adam" fill priority sizes="100vw" />
      </div>

      <div className="hero-inner">
        <RevealLines
          className="serif display"
          lines={[
            <>Stories told</>,
            <>
              in <em>light</em> &amp; motion
            </>,
          ]}
        />
        <div className="hero-bottom">
          <p className="eyebrow">Photography &amp; Film — Kuala Lumpur</p>
          <p className="eyebrow">Scroll ↓</p>
        </div>
      </div>
    </section>
  );
}
