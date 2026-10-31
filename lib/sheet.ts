import { cache } from "react";
import { findSheetId, safeTab, type Row } from "./gsheet";
import { addOns as defaultAddOns, faqs as defaultFaqs, genres, pricing as defaultPricing, type Tier } from "./data";

/*
 * Price list, add-ons, FAQ and page wording are read from a Google Sheet that is shared as
 * "Anyone with the link can view". Tabs (header row required, row order = display order):
 *
 *   Packages   Category | Name | Price | Duration | Featured | Feature 1 … Feature 8
 *   Add-ons    Name | Price
 *   FAQ        Question | Answer
 *   Settings   Key | Value
 *
 * Edits show up within about a minute (responses are cached, so pages open instantly). If the sheet is unreachable or a tab is empty the
 * built-in defaults from data.ts are used instead.
 */

const FALLBACK_SHEET_ID = "1fR9shm624uD-lFJuNnaFJlHcshLsxq8DX2nKAWYZYD8";
const resolveSheetId = async () =>
  (await findSheetId({
    envId: process.env.GOOGLE_SHEET_ID,
    match: /price/i,
    fallbackId: FALLBACK_SHEET_ID,
  }))!;

export type AddOn = { name: string; price: string };
export type Faq = { q: string; a: string };

export const defaultText = {
  pricing_eyebrow: "( Investment )",
  pricing_title_1: "Price",
  pricing_title_2: "List",
  most_loved_label: "Most loved",
  currency: "RM",
  book_button: "Book {name} →",
  addons_label: "( Add-ons )",
  faq_label: "( FAQ )",
  cta_title: "Found your package?",
  cta_button: "Check availability →",
  from_label: "Packages from",
};
export type PriceText = typeof defaultText;

export type PriceData = {
  pricing: Record<string, Tier[]>;
  addOns: AddOn[];
  faqs: Faq[];
  text: PriceText;
};

const isTrue = (v: string) => /^(y|yes|true|1|x|✓)$/i.test(v.trim());

function parsePackages(rows: Row[]): Record<string, Tier[]> {
  const out: Record<string, Tier[]> = {};
  for (const r of rows) {
    const category = (r.category ?? "").toLowerCase();
    const name = r.name;
    const price = Number((r.price ?? "").replace(/[^\d.]/g, ""));
    if (!category || !name || !Number.isFinite(price) || !genres.some((g) => g.slug === category)) continue;
    const features = Object.entries(r)
      .filter(([k, v]) => /^feature\s*\d*$/.test(k) && v)
      .map(([, v]) => v);
    (out[category] ??= []).push({
      name,
      price,
      duration: r.duration ?? "",
      featured: isTrue(r.featured ?? ""),
      features,
    });
  }
  return out;
}

export const getPriceData = cache(async (): Promise<PriceData> => {
  const id = await resolveSheetId();
  const [packages, addOnRows, faqRows, settings] = await Promise.all([
    safeTab(id, "Packages", ["category", "name", "price"]),
    safeTab(id, "Add-ons", ["name", "price"], ["category"]),
    safeTab(id, "FAQ", ["question", "answer"]),
    safeTab(id, "Settings", ["key", "value"]),
  ]);

  const fromSheet = parsePackages(packages);
  const pricing: Record<string, Tier[]> = {};
  for (const g of genres) pricing[g.slug] = fromSheet[g.slug]?.length ? fromSheet[g.slug] : defaultPricing[g.slug];

  const addOns = addOnRows.filter((r) => r.name).map((r) => ({ name: r.name, price: r.price ?? "" }));
  const faqs = faqRows.filter((r) => r.question && r.answer).map((r) => ({ q: r.question, a: r.answer }));

  const text = { ...defaultText };
  for (const r of settings) {
    const key = (r.key ?? "").toLowerCase() as keyof PriceText;
    if (key in text && r.value) text[key] = r.value;
  }

  return {
    pricing,
    addOns: addOns.length ? addOns : defaultAddOns,
    faqs: faqs.length ? faqs : defaultFaqs,
    text,
  };
});
