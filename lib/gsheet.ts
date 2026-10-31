import { driveConfigured, driveRootId, listFolder } from "./drive";

// Shared helpers for reading Google Sheets that are shared as "Anyone with the link can view".
// Responses are cached for a minute (stale-while-revalidate), so pages never wait on Google.

const SHEET_MIME = "application/vnd.google-apps.spreadsheet";
const REVALIDATE_SECONDS = 60;

/**
 * Finds a Google Sheet in the root Drive folder by name pattern, so replacing the file needs
 * no code change. `envId` (a sheet ID or share link) wins when set; `fallbackId` is the last resort.
 */
export async function findSheetId(opts: {
  envId?: string;
  match: RegExp;
  exclude?: RegExp;
  fallbackId?: string;
}): Promise<string | undefined> {
  const env = opts.envId?.trim();
  if (env) return env.replace(/^.*\/d\/([\w-]+).*$/, "$1");
  if (driveConfigured()) {
    try {
      const sheets = (await listFolder(driveRootId()!, 300)).filter(
        (f) => f.mimeType === SHEET_MIME && !(opts.exclude && opts.exclude.test(f.name))
      );
      const pick = sheets.find((f) => opts.match.test(f.name));
      if (pick) return pick.id;
    } catch {
      // fall through to the fallback
    }
  }
  return opts.fallbackId;
}

// Minimal RFC 4180 CSV parser (quoted fields, escaped quotes, newlines inside quotes).
export function parseCsv(input: string): string[][] {
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

export type Row = Record<string, string>;

// Google returns the first tab when the requested one does not exist, so require the right headers.
export async function readTab(
  sheetId: string,
  tab: string,
  required: string[],
  forbidden: string[] = []
): Promise<Row[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
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
export const safeTab = (sheetId: string, tab: string, required: string[], forbidden: string[] = []) =>
  readTab(sheetId, tab, required, forbidden).catch(() => [] as Row[]);

