import { cache } from "react";
import { findSheetId, safeTab } from "./gsheet";
import { genres as baseGenres, type Genre } from "./data";

/*
 * Every piece of wording on the site is read from a Google Sheet named "…Content…" in the root
 * Drive folder (shared as "Anyone with the link can view"). Tabs, header row required:
 *
 *   Content   Key | Value | Where it appears
 *   Genres    Slug | Label | Title
 *   Stats     Value | Suffix | Label
 *   Process   Title | Text
 *   Gear      Item
 *
 * In text: `*word*` is shown in italics and `|` starts a new line in headings.
 * Edits appear within about a minute; missing keys and tabs fall back to the defaults below.
 */

export type ContentDefault = { key: string; value: string; note: string };

const d = (key: string, value: string, note: string): ContentDefault => ({ key, value, note });

export const CONTENT_DEFAULTS: ContentDefault[] = [
  // ---- Whole site ----
  d("meta_title", "Adam Atas Jalan — Photography & Film", "Browser tab title of the home page"),
  d("meta_title_suffix", "Adam Atas Jalan", "Browser tab title ends with this on other pages"),
  d("meta_description", "Photography and videography for convocations, weddings, sports, portraits and events. Based in Kuala Lumpur.", "Description shown in Google results and link previews"),
  d("logo_1", "adam", "Logo, first word (top bar)"),
  d("logo_2", "atas", "Logo, middle word (shown in italics)"),
  d("logo_3", "jalan", "Logo, last word"),
  d("nav_pricing", "Price List", "Menu link"),
  d("nav_about", "About Me", "Menu link"),
  d("nav_book", "Book Now", "Menu link"),
  d("menu_open", "Menu", "Phone menu button"),
  d("menu_close", "Close", "Phone menu button when open"),
  d("menu_work", "Work", "Phone menu heading"),
  d("menu_studio", "Studio", "Phone menu heading"),

  // ---- Contact details (used on Book Now, the footer and the WhatsApp enquiry) ----
  d("contact_email", "AdamRazali54@gmail.com", "Your email address"),
  d("contact_whatsapp", "60174020027", "WhatsApp number, digits only with country code (enquiries are sent here)"),
  d("contact_whatsapp_display", "+60 17-402 0027", "WhatsApp number as shown on the page"),
  d("contact_location", "Kuala Lumpur, Malaysia", "Studio location shown on Book Now"),
  d("instagram_url", "https://instagram.com", "Footer Instagram link"),
  d("tiktok_url", "https://tiktok.com", "Footer TikTok link"),

  // ---- Footer ----
  d("footer_tagline", "Photography & film for the moments worth *keeping.*", "Footer, big sentence"),
  d("footer_work", "Work", "Footer column heading"),
  d("footer_studio", "Studio", "Footer column heading"),
  d("footer_hello", "Say hello", "Footer column heading"),
  d("footer_whatsapp", "WhatsApp", "Footer link text"),
  d("footer_name", "Adam *atas* Jalan", "Footer, huge name"),
  d("footer_copyright", "© {year} Adam Atas Jalan. All rights reserved.", "Footer, bottom left ({year} becomes the current year)"),
  d("footer_note", "Based in Kuala Lumpur — available worldwide", "Footer, bottom right"),

  // ---- Home page ----
  d("hero_title", "Stories told|in *light* & motion", "Home, big title (| = new line)"),
  d("hero_subtitle", "Photography & Film — Kuala Lumpur", "Home, line under the title"),
  d("hero_scroll", "Scroll ↓", "Home, scroll hint"),
  d("hero_alt", "Portrait of Adam", "Home, description of your photo for screen readers"),
  d("statement_label", "( Approach )", "Home, small label"),
  d("statement_text", "I don't direct moments — I wait for them. Honest frames and quiet films for the days you'll want to live twice.", "Home, statement under the hero"),
  d("selected_label", "( Selected Work )", "Home, category list heading"),
  d("selected_count", "05 Disciplines", "Home, category list note"),
  d("selected_view", "View →", "Home, category row link"),
  d("frames_label", "( Recent Frames )", "Home, sideways gallery label"),
  d("frames_title", "A year *on the road*", "Home, sideways gallery title"),
  d("frames_hint", "Swipe or scroll sideways to browse recent work.", "Home, sideways gallery hint"),
  d("marquee_1", "Now booking 2026 & 2027", "Home, scrolling banner, first phrase"),
  d("marquee_2", "*Photo* & *Film*", "Home, scrolling banner, second phrase"),
  d("quote_label", "( Kind Words )", "Home, testimonial label"),
  d("quote_text", "“We barely noticed he was there — then the photos arrived and we cried all over again. *Every single moment* was in there.”", "Home, testimonial"),
  d("quote_author", "Aina & Haziq — Wedding, Kuala Lumpur", "Home, testimonial author"),
  d("home_cta_label", "( Let's work together )", "Home, bottom call to action label"),
  d("home_cta_title", "Let's make|something *timeless.*", "Home, bottom call to action title"),
  d("home_cta_button", "Book your date →", "Home, bottom call to action button"),

  // ---- About page ----
  d("about_meta_title", "About Me", "About, browser tab title"),
  d("about_label", "( About Me )", "About, small label"),
  d("about_title", "The person|behind the *frame*", "About, big title"),
  d("about_photo_alt", "Portrait of Adam", "About, description of your photo for screen readers"),
  d("about_lead", "Hi, I'm Adam — a photographer and filmmaker based in Kuala Lumpur, usually found somewhere *atas jalan*: on the road.", "About, large first paragraph"),
  d("about_p1", "What started as borrowing my father's camera for a cousin's wedding turned into a lifelong obsession with light and timing. Today I photograph convocations, weddings, athletes, portraits and events across Malaysia and beyond.", "About, biography paragraph 1"),
  d("about_p2", "My style is quiet and documentary: I'd rather catch a real laugh than ask for a fake one. Clean, timeless edits that look as good in twenty years as they do today.", "About, biography paragraph 2"),
  d("about_p3", "When I'm not shooting, I'm chasing sunrises with a film camera, or on a long drive with no particular destination.", "About, biography paragraph 3"),
  d("about_button", "Work with me →", "About, button"),
  d("stats_label", "( By the numbers )", "About, numbers heading (numbers are in the Stats tab)"),
  d("process_label", "( Process )", "About, process label (steps are in the Process tab)"),
  d("process_title", "How we'll|*work together*", "About, process title"),
  d("gear_label", "( In the bag )", "About, gear heading (items are in the Gear tab)"),

  // ---- Category pages ----
  d("work_eyebrow", "( 0{n} — Portfolio )", "Category page, small label ({n} = category number)"),
  d("work_services_label", "Services", "Category page, info row"),
  d("work_services_value", "Photography · Videography", "Category page, info row"),
  d("work_price_button", "View {category} price list →", "Category page, button under the price"),
  d("work_empty", "New work coming soon.", "Category page, shown when it has no photos yet"),
  d("work_photos_one", "1 photo", "Category page, event photo count (single)"),
  d("work_photos_many", "{n} photos", "Category page, event photo count ({n} = number)"),

  // ---- Book Now page ----
  d("book_meta_title", "Book Now", "Book, browser tab title"),
  d("book_label", "( Book Now )", "Book, small label"),
  d("book_title", "Let's tell|your *story.*", "Book, big title"),
  d("book_email_label", "Email", "Book, contact list"),
  d("book_whatsapp_label", "WhatsApp", "Book, contact list"),
  d("book_studio_label", "Studio", "Book, contact list"),
  d("form_name", "Full name", "Booking form"),
  d("form_email", "Email", "Booking form"),
  d("form_phone", "Phone / WhatsApp", "Booking form"),
  d("form_date", "Event date", "Booking form"),
  d("form_genre", "Type of shoot", "Booking form"),
  d("form_package", "Package", "Booking form"),
  d("form_custom", "Something custom", "Booking form, last package option"),
  d("form_location", "Location", "Booking form"),
  d("form_location_hint", "Venue, city", "Booking form, grey hint in the box"),
  d("form_message", "Tell me about it", "Booking form"),
  d("form_message_hint", "The story, the vibe, anything I should know…", "Booking form, grey hint in the box"),
  d("form_submit", "Send enquiry →", "Booking form, button"),
  d("wa_intro", "Hi Adam, I'd like to enquire about a booking.", "First line of the WhatsApp message people send you"),
  d("thanks_label", "( Received )", "After sending, small label"),
  d("thanks_title", "Thank you — *talk soon.*", "After sending, title"),
  d("thanks_text", "WhatsApp should have opened with your details ready to send — just press send. I personally reply to every message within 24 hours with availability and next steps.", "After sending, text"),

  // ---- Photo viewer ----
  d("lightbox_close", "Close ✕", "Photo viewer"),
  d("lightbox_prev", "← Prev", "Photo viewer"),
  d("lightbox_next", "Next →", "Photo viewer"),
  d("watermark", "@adam*atas*jalan", "Mark in the corner of enlarged photos"),
];

export type Stat = { value: number; suffix: string; label: string };
export type Step = { title: string; text: string };

const defaultStats: Stat[] = [
  { value: 8, suffix: "+", label: "Years behind the lens" },
  { value: 240, suffix: "+", label: "Weddings & events" },
  { value: 1200, suffix: "+", label: "Graduates celebrated" },
  { value: 15, suffix: "", label: "Countries shot in" },
];
const defaultSteps: Step[] = [
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

export type SiteContent = {
  t: (key: string) => string;
  /** All wording, for client components that cannot await. */
  all: Record<string, string>;
  genres: Genre[];
  stats: Stat[];
  steps: Step[];
  gear: string[];
};

const defaults: Record<string, string> = Object.fromEntries(CONTENT_DEFAULTS.map((c) => [c.key, c.value]));

export const getContent = cache(async (): Promise<SiteContent> => {
  const id = await findSheetId({ envId: process.env.GOOGLE_CONTENT_SHEET_ID, match: /content/i });
  const read = (tab: string, required: string[]) =>
    id ? safeTab(id, tab, required) : Promise.resolve([]);
  const [rows, genreRows, statRows, stepRows, gearRows] = await Promise.all([
    read("Content", ["key", "value"]),
    read("Genres", ["slug", "label", "title"]),
    read("Stats", ["value", "label"]),
    read("Process", ["title", "text"]),
    read("Gear", ["item"]),
  ]);

  const all: Record<string, string> = { ...defaults };
  for (const r of rows) if (r.key in defaults && r.value) all[r.key] = r.value;

  const genres = baseGenres.map((g) => {
    const row = genreRows.find((r) => r.slug.toLowerCase() === g.slug);
    return row ? { ...g, label: row.label || g.label, title: row.title || g.title } : g;
  });

  const num = (v: string) => Number(v.replace(/[^\d.]/g, ""));
  const stats = statRows
    .filter((r) => r.label && r.value && Number.isFinite(num(r.value)))
    .map((r) => ({ value: num(r.value), suffix: r.suffix ?? "", label: r.label }));
  const steps = stepRows.filter((r) => r.title).map((r) => ({ title: r.title, text: r.text }));
  const gear = gearRows.filter((r) => r.item).map((r) => r.item);

  return {
    t: (key) => all[key] ?? "",
    all,
    genres,
    stats: stats.length ? stats : defaultStats,
    steps: steps.length ? steps : defaultSteps,
    gear: gear.length ? gear : defaultGear,
  };
});

export const defaultGenreRows = baseGenres.map((g) => [g.slug, g.label, g.title]);
export const defaultStatRows = defaultStats.map((s) => [s.value, s.suffix, s.label]);
export const defaultStepRows = defaultSteps.map((s) => [s.title, s.text]);
export const defaultGearRows = defaultGear.map((g) => [g]);
