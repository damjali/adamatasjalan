import Image from "next/image";

export default function ParallaxImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="img-fill">
      <Image src={src} alt={alt} fill priority={priority} referrerPolicy="no-referrer" sizes="100vw" style={{ objectFit: "cover" }} />
    </div>
  );
}
