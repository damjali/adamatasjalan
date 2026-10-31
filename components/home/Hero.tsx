import Image from "next/image";
import { RevealLines } from "../Reveal";
import { getContent } from "@/lib/content";
import { richLines } from "@/lib/rich";

export default async function Hero({ src }: { src: string }) {
  const c = await getContent();
  return (
    <section className="hero hero-portrait">
      <div className="hero-media">
        <Image src={src} alt={c.t("hero_alt")} fill priority sizes="100vw" />
      </div>

      <div className="hero-inner">
        <RevealLines
          className="serif display"
          lines={richLines(c.t("hero_title"))}
        />
        <div className="hero-bottom">
          <p className="eyebrow">{c.t("hero_subtitle")}</p>
          <p className="eyebrow">{c.t("hero_scroll")}</p>
        </div>
      </div>
    </section>
  );
}
