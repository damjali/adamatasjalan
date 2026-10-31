import { cache, type ReactNode } from "react";
import { E } from "@/components/E";
import {
  addOns as defaultAddOns,
  faqs as defaultFaqs,
  genres as baseGenres,
  pricing as defaultPricing,
  type Genre,
} from "./data";
import { rich } from "./rich";
import { loadOverrides } from "./supabase";

/*
 * Every piece of wording on the site lives in the Supabase table `site_texts` (key / value).
 * The defaults below are the starting values: any key missing from the table falls back to
 * them, and logging in as admin lets you edit any text in place, which saves to Supabase.
 *
 * In text: `*word*` is shown in italics and `|` starts a new line in headings.
 */

export type Entry = { key: string; value: string; note: string; group: string };

const d = (group: string, key: string, value: string, note: string): Entry => ({ key, value, note, group });

const CONTENT_DEFAULTS: Entry[] = [
  d("Whole site", "meta_title", "Adam Atas Jalan — Photography & Film", "Browser tab title of the home page"),
  d("Whole site", "meta_title_suffix", "Adam Atas Jalan", "Browser tab title ends with this on other pages"),
  d("Whole site", "meta_description", "Photography and videography for convocations, weddings, sports, portraits and events. Based in Kuala Lumpur.", "Description shown in Google results and link previews"),
  d("Whole site", "nav_pricing", "Price List", "Menu link"),
  d("Whole site", "nav_about", "About Me", "Menu link"),
  d("Whole site", "nav_book", "Book Now", "Menu link"),
  d("Whole site", "menu_open", "Menu", "Phone menu button"),
  d("Whole site", "menu_close", "Close", "Phone menu button when open"),
  d("Whole site", "menu_work", "Work", "Phone menu heading"),
  d("Whole site", "menu_studio", "Studio", "Phone menu heading"),
  d("Contact details", "contact_email", "AdamRazali54@gmail.com", "Your email address"),
  d("Contact details", "contact_whatsapp", "60174020027", "WhatsApp number, digits only with country code (enquiries are sent here)"),
  d("Contact details", "contact_whatsapp_display", "+60 17-402 0027", "WhatsApp number as shown on the page"),
  d("Contact details", "contact_location", "Kuala Lumpur, Malaysia", "Studio location shown on Book Now"),
  d("Contact details", "instagram_url", "https://instagram.com", "Footer Instagram link"),
  d("Contact details", "tiktok_url", "https://tiktok.com", "Footer TikTok link"),
  d("Footer", "footer_tagline", "Photography & film for the moments worth *keeping.*", "Footer, big sentence"),
  d("Footer", "footer_work", "Work", "Footer column heading"),
  d("Footer", "footer_studio", "Studio", "Footer column heading"),
  d("Footer", "footer_hello", "Say hello", "Footer column heading"),
  d("Footer", "footer_whatsapp", "WhatsApp", "Footer link text"),
  d("Footer", "footer_copyright", "© {year} Adam Atas Jalan. All rights reserved.", "Footer, bottom left ({year} becomes the current year)"),
  d("Footer", "footer_note", "Based in Kuala Lumpur — available worldwide", "Footer, bottom right"),
  d("Home page", "hero_title", "Stories told|in *light* & motion", "Home, big title (| = new line)"),
  d("Home page", "hero_subtitle", "Photography & Film — Kuala Lumpur", "Home, line under the title"),
  d("Home page", "hero_scroll", "Scroll ↓", "Home, scroll hint"),
  d("Home page", "hero_alt", "Portrait of Adam", "Home, description of your photo for screen readers"),
  d("Home page", "statement_label", "( Approach )", "Home, small label"),
  d("Home page", "statement_text", "I don't direct moments — I wait for them. Honest frames and quiet films for the days you'll want to live twice.", "Home, statement under the hero"),
  d("Home page", "selected_label", "( Selected Work )", "Home, category list heading"),
  d("Home page", "selected_count", "05 Disciplines", "Home, category list note"),
  d("Home page", "selected_view", "View →", "Home, category row link"),
  d("Home page", "frames_label", "( Recent Frames )", "Home, sideways gallery label"),
  d("Home page", "frames_title", "A year *on the road*", "Home, sideways gallery title"),
  d("Home page", "frames_hint", "Swipe or scroll sideways to browse recent work.", "Home, sideways gallery hint"),
  d("Home page", "marquee_1", "Now booking 2026 & 2027", "Home, scrolling banner, first phrase"),
  d("Home page", "marquee_2", "*Photo* & *Film*", "Home, scrolling banner, second phrase"),
  d("Home page", "quote_label", "( Kind Words )", "Home, testimonial label"),
  d("Home page", "quote_text", "“We barely noticed he was there — then the photos arrived and we cried all over again. *Every single moment* was in there.”", "Home, testimonial"),
  d("Home page", "quote_author", "Aina & Haziq — Wedding, Kuala Lumpur", "Home, testimonial author"),
  d("Home page", "home_cta_label", "( Let's work together )", "Home, bottom call to action label"),
  d("Home page", "home_cta_title", "Let's make|something *timeless.*", "Home, bottom call to action title"),
  d("Home page", "home_cta_button", "Book your date →", "Home, bottom call to action button"),
  d("About page", "about_meta_title", "About Me", "About, browser tab title"),
  d("About page", "about_label", "( About Me )", "About, small label"),
  d("About page", "about_title", "The person|behind the *frame*", "About, big title"),
  d("About page", "about_photo_alt", "Portrait of Adam", "About, description of your photo for screen readers"),
  d("About page", "about_lead", "Hi, I'm Adam — a photographer and filmmaker based in Kuala Lumpur, usually found somewhere *atas jalan*: on the road.", "About, large first paragraph"),
  d("About page", "about_p1", "What started as borrowing my father's camera for a cousin's wedding turned into a lifelong obsession with light and timing. Today I photograph convocations, weddings, athletes, portraits and events across Malaysia and beyond.", "About, biography paragraph 1"),
  d("About page", "about_p2", "My style is quiet and documentary: I'd rather catch a real laugh than ask for a fake one. Clean, timeless edits that look as good in twenty years as they do today.", "About, biography paragraph 2"),
  d("About page", "about_p3", "When I'm not shooting, I'm chasing sunrises with a film camera, or on a long drive with no particular destination.", "About, biography paragraph 3"),
  d("About page", "about_button", "Work with me →", "About, button"),
  d("About page", "stats_label", "( By the numbers )", "About, numbers heading (numbers are in the Stats tab)"),
  d("About page", "process_label", "( Process )", "About, process label (steps are in the Process tab)"),
  d("About page", "process_title", "How we'll|*work together*", "About, process title"),
  d("About page", "gear_label", "( In the bag )", "About, gear heading (items are in the Gear tab)"),
  d("Category pages", "work_eyebrow", "( 0{n} — Portfolio )", "Category page, small label ({n} = category number)"),
  d("Category pages", "work_services_label", "Services", "Category page, info row"),
  d("Category pages", "work_services_value", "Photography · Videography", "Category page, info row"),
  d("Category pages", "work_price_button", "View {category} price list →", "Category page, button under the price"),
  d("Category pages", "work_empty", "New work coming soon.", "Category page, shown when it has no photos yet"),
  d("Category pages", "work_photos_one", "1 photo", "Category page, event photo count (single)"),
  d("Category pages", "work_photos_many", "{n} photos", "Category page, event photo count ({n} = number)"),
  d("Book Now page", "book_meta_title", "Book Now", "Book, browser tab title"),
  d("Book Now page", "book_label", "( Book Now )", "Book, small label"),
  d("Book Now page", "book_title", "Let's tell|your *story.*", "Book, big title"),
  d("Book Now page", "book_email_label", "Email", "Book, contact list"),
  d("Book Now page", "book_whatsapp_label", "WhatsApp", "Book, contact list"),
  d("Book Now page", "book_studio_label", "Studio", "Book, contact list"),
  d("Book Now page", "form_name", "Full name", "Booking form"),
  d("Book Now page", "form_email", "Email", "Booking form"),
  d("Book Now page", "form_phone", "Phone / WhatsApp", "Booking form"),
  d("Book Now page", "form_date", "Event date", "Booking form"),
  d("Book Now page", "form_genre", "Type of shoot", "Booking form"),
  d("Book Now page", "form_package", "Package", "Booking form"),
  d("Book Now page", "form_custom", "Something custom", "Booking form, last package option"),
  d("Book Now page", "form_location", "Location", "Booking form"),
  d("Book Now page", "form_location_hint", "Venue, city", "Booking form, grey hint in the box"),
  d("Book Now page", "form_message", "Tell me about it", "Booking form"),
  d("Book Now page", "form_message_hint", "The story, the vibe, anything I should know…", "Booking form, grey hint in the box"),
  d("Book Now page", "form_submit", "Send enquiry →", "Booking form, button"),
  d("Book Now page", "wa_intro", "Hi Adam, I'd like to enquire about a booking.", "First line of the WhatsApp message people send you"),
  d("Book Now page", "thanks_label", "( Received )", "After sending, small label"),
  d("Book Now page", "thanks_title", "Thank you — *talk soon.*", "After sending, title"),
  d("Book Now page", "thanks_text", "WhatsApp should have opened with your details ready to send — just press send. I personally reply to every message within 24 hours with availability and next steps.", "After sending, text"),
  d("Photo viewer", "lightbox_close", "Close ✕", "Photo viewer"),
  d("Photo viewer", "lightbox_prev", "← Prev", "Photo viewer"),
  d("Photo viewer", "lightbox_next", "Next →", "Photo viewer"),
  d("Photo viewer", "watermark", "@adam*atas*jalan", "Mark in the corner of enlarged photos"),
];

// Price list wording
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

const defaultStats = [
  { value: "8", suffix: "+", label: "Years behind the lens" },
  { value: "240", suffix: "+", label: "Weddings & events" },
  { value: "1200", suffix: "+", label: "Graduates celebrated" },
  { value: "15", suffix: "", label: "Countries shot in" },
];
const defaultSteps = [
  { title: "Enquire", text: "Tell me about your day, your vision and the moments that matter most." },
  { title: "Plan", text: "A call to map timelines, locations and the shots you can't live without." },
  { title: "Shoot", text: "I blend in, guide when needed, and let the real moments happen." },
  { title: "Deliver", text: "A carefully edited gallery and film, ready to share and keep forever." },
];
const defaultGear = [
  "Sony A1 & A7S III",
  "24–70mm f/2.8 GM II",
  "70–200mm f/2.8 GM II",
  "35mm & 85mm f/1.4 primes",
  "DJI Mavic 3 Pro",
  "DJI RS 4 Pro gimbal",
];

/** Every editable text with its default, in the order they appear on the admin page. */
export function allEntries(): Entry[] {
  const out: Entry[] = [...CONTENT_DEFAULTS];
  const add = (group: string, key: string, value: string, note: string) => out.push(d(group, key, value, note));

  for (const g of baseGenres) {
    add("Categories", `genre.${g.slug}.label`, g.label, `${g.title}: short name in the menu`);
    add("Categories", `genre.${g.slug}.title`, g.title, `${g.title}: full title in headings`);
  }
  defaultStats.forEach((s, i) => {
    add("About: numbers", `stat.${i}.value`, s.value, `Number ${i + 1}`);
    add("About: numbers", `stat.${i}.suffix`, s.suffix, `Number ${i + 1}, symbol after it (e.g. +)`);
    add("About: numbers", `stat.${i}.label`, s.label, `Number ${i + 1}, caption`);
  });
  defaultSteps.forEach((s, i) => {
    add("About: process", `step.${i}.title`, s.title, `Step ${i + 1}, title`);
    add("About: process", `step.${i}.text`, s.text, `Step ${i + 1}, text`);
  });
  defaultGear.forEach((g, i) => add("About: gear", `gear.${i}`, g, `Item ${i + 1}`));
  for (const [k, v] of Object.entries(defaultText)) add("Price list: wording", k, v, "Price List page wording");
  for (const g of baseGenres) {
    defaultPricing[g.slug].forEach((t, i) => {
      const id = `pkg.${g.slug}.${i}`;
      const grp = `Packages: ${g.title}`;
      add(grp, `${id}.name`, t.name, `Package ${i + 1}, name`);
      add(grp, `${id}.price`, String(t.price), `Package ${i + 1}, price (number only)`);
      add(grp, `${id}.duration`, t.duration, `Package ${i + 1}, duration`);
      add(grp, `${id}.featured`, t.featured ? "yes" : "", `Package ${i + 1}, "yes" highlights it as Most loved`);
      t.features.forEach((f, j) => add(grp, `${id}.f${j}`, f, `Package ${i + 1}, feature ${j + 1}`));
    });
  }
  defaultAddOns.forEach((a, i) => {
    add("Add-ons", `addon.${i}.name`, a.name, `Add-on ${i + 1}, name`);
    add("Add-ons", `addon.${i}.price`, a.price, `Add-on ${i + 1}, price`);
  });
  defaultFaqs.forEach((f, i) => {
    add("FAQ", `faq.${i}.q`, f.q, `Question ${i + 1}`);
    add("FAQ", `faq.${i}.a`, f.a, `Answer ${i + 1}`);
  });
  return out;
}

const DEFAULTS: Record<string, string> = Object.fromEntries(allEntries().map((e) => [e.key, e.value]));
export const isTextKey = (key: string) => key in DEFAULTS;

export type Stat = { i: number; value: number; valueRaw: string; suffix: string; label: string };
export type Step = { i: number; title: string; text: string };
export type PriceTier = {
  id: string;
  name: string;
  price: number;
  duration: string;
  featured: boolean;
  features: string[];
};
export type AddOn = { i: number; name: string; price: string };
export type Faq = { i: number; q: string; a: string };

export type SiteContent = {
  /** Plain text, for attributes and other places that cannot hold markup. */
  t: (key: string) => string;
  /** Editable text node; `{placeholders}` are filled from `vars`. */
  e: (key: string, vars?: Record<string, string>) => ReactNode;
  /** Editable heading where `|` starts a new line. */
  eLines: (key: string) => ReactNode;
  all: Record<string, string>;
  genres: Genre[];
  stats: Stat[];
  steps: Step[];
  gear: { i: number; item: string }[];
};

const fill = (text: string, vars?: Record<string, string>) =>
  vars ? Object.entries(vars).reduce((s, [k, v]) => s.split(`{${k}}`).join(v), text) : text;

const getAll = cache(async (): Promise<Record<string, string>> => {
  const overrides = await loadOverrides();
  const all = { ...DEFAULTS };
  for (const [k, v] of Object.entries(overrides)) if (k in DEFAULTS) all[k] = v;
  return all;
});

export const getContent = cache(async (): Promise<SiteContent> => {
  const all = await getAll();
  const t = (key: string) => all[key] ?? "";

  const genres = baseGenres.map((g) => ({
    ...g,
    label: t(`genre.${g.slug}.label`) || g.label,
    title: t(`genre.${g.slug}.title`) || g.title,
  }));
  const num = (v: string) => Number(v.replace(/[^\d.]/g, "")) || 0;

  return {
    t,
    e: (key, vars) => (
      <E k={key} raw={t(key)}>
        {rich(fill(t(key), vars))}
      </E>
    ),
    eLines: (key) => (
      <E k={key} raw={t(key)}>
        {t(key)
          .split("|")
          .map((line, i) => (
            <span style={{ display: "block" }} key={i}>
              {rich(line.trim())}
            </span>
          ))}
      </E>
    ),
    all,
    genres,
    stats: defaultStats.map((_, i) => ({
      i,
      value: num(t(`stat.${i}.value`)),
      valueRaw: t(`stat.${i}.value`),
      suffix: t(`stat.${i}.suffix`),
      label: t(`stat.${i}.label`),
    })),
    steps: defaultSteps.map((_, i) => ({ i, title: t(`step.${i}.title`), text: t(`step.${i}.text`) })),
    gear: defaultGear.map((_, i) => ({ i, item: t(`gear.${i}`) })),
  };
});

export type PriceData = {
  pricing: Record<string, PriceTier[]>;
  addOns: AddOn[];
  faqs: Faq[];
  text: PriceText;
};

export const getPriceData = cache(async (): Promise<PriceData> => {
  const all = await getAll();
  const t = (key: string) => all[key] ?? "";

  const pricing: Record<string, PriceTier[]> = {};
  for (const g of baseGenres) {
    pricing[g.slug] = defaultPricing[g.slug].map((tier, i) => {
      const id = `pkg.${g.slug}.${i}`;
      return {
        id,
        name: t(`${id}.name`),
        price: Number(t(`${id}.price`).replace(/[^\d.]/g, "")) || 0,
        duration: t(`${id}.duration`),
        featured: /^(y|yes|true|1|x)$/i.test(t(`${id}.featured`).trim()),
        features: tier.features.map((_, j) => t(`${id}.f${j}`)),
      };
    });
  }
  const text = Object.fromEntries(Object.keys(defaultText).map((k) => [k, t(k)])) as PriceText;

  return {
    pricing,
    addOns: defaultAddOns.map((_, i) => ({ i, name: t(`addon.${i}.name`), price: t(`addon.${i}.price`) })),
    faqs: defaultFaqs.map((_, i) => ({ i, q: t(`faq.${i}.q`), a: t(`faq.${i}.a`) })),
    text,
  };
});

/** Current value of every editable text, for the admin page. */
export async function getEntriesWithValues() {
  const all = await getAll();
  return allEntries().map((e) => ({ ...e, value: all[e.key] ?? e.value }));
}
