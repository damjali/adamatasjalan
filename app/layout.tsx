import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    // Google's image servers reject requests whose referrer is localhost; sending none works everywhere.
    referrer: "no-referrer",
    title: { default: c.t("meta_title"), template: `%s — ${c.t("meta_title_suffix")}` },
    description: c.t("meta_description"),
  };
}

// Root layout: shared header and footer around every page.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const c = await getContent();
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Header genres={c.genres} text={c.all} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
