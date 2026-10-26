// Global next/image loader (see next.config.ts). Drive photos are served straight from Google's
// image CDN, resized to the width the browser asks for; anything else (placeholders) passes through.
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const drive = src.match(/^\/drive\/([\w-]+)$/);
  return drive ? `https://lh3.googleusercontent.com/d/${drive[1]}=w${width}` : src;
}
