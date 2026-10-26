import { cache } from "react";
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
 * Responses are cached for a minute (stale-while-revalidate), so pages never wait on Google
 * and edits show up within about a minute. If the sheet is unreachable or a tab is empty the
 * built-in defaults from data.ts are used instead.
 */

const SHEET_ID = (
  process.env.GOOGLE_SHEET_ID?.trim() || "1kTFOqCadqYdwV-i_l4QcGqg8b3reHC3F3YcO28jLyKM"
).replace(/^.*\/d\/([\w-]+).*$/, "$1");
const REVALIDATE_SECONDS = 60;

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

// Minimal RFC 4180 CSV parser (quoted fields, escaped quotes, newlines inside quotes).
function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (quoted) {
      if (c === '"' && input[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && input[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

type Row = Record<string, string>;

// Google returns the first tab when the requested one does not exist, so require the right headers.
async function readTab(tab: string, required: string[], forbidden: string[] = []): Promise<Row[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`Sheet tab "${tab}": HTTP ${res.status}`);
  const [header, ...rows] = parseCsv(await res.text());
  if (!header) return [];
  const keys = header.map((h) => h.trim().toLowerCase());
  if (!required.every((k) => keys.includes(k)) || forbidden.some((k) => keys.includes(k))) return [];
  return rows
    .filter((r) => r.some((c) => c.trim()))
    .map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}

// A tab that fails or is missing falls back to the defaults rather than breaking the page.
const safeTab = (tab: string, required: string[], forbidden: string[] = []) =>
  readTab(tab, required, forbidden).catch(() => [] as Row[]);

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
  const [packages, addOnRows, faqRows, settings] = await Promise.all([
    safeTab("Packages", ["category", "name", "price"]),
    safeTab("Add-ons", ["name", "price"], ["category"]),
    safeTab("FAQ", ["question", "answer"]),
    safeTab("Settings", ["key", "value"]),
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
