// Minimal Supabase REST client for the `site_texts` table (server only; uses the secret key).

const base = () => process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
const secret = () => process.env.SUPABASE_SECRET_KEY?.trim();

export const supabaseConfigured = () => Boolean(base() && secret());

const headers = () => ({ apikey: secret()!, "Content-Type": "application/json" });

export const SITE_TEXTS_TAG = "site-texts";

/** All saved texts. Cached until an edit is saved (the save route purges the tag). */
export async function loadOverrides(): Promise<Record<string, string>> {
  if (!supabaseConfigured()) return {};
  try {
    const res = await fetch(`${base()}/rest/v1/site_texts?select=key,value&limit=5000`, {
      headers: headers(),
      next: { tags: [SITE_TEXTS_TAG], revalidate: 3600 },
    });
    if (!res.ok) return {};
    const rows: { key: string; value: string }[] = await res.json();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

export async function saveTexts(
  rows: { key: string; value: string }[],
  mode: "overwrite" | "keep-existing" = "overwrite"
): Promise<{ ok: boolean; error?: string }> {
  if (!supabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured (SUPABASE_URL / SUPABASE_SECRET_KEY)." };
  }
  const res = await fetch(`${base()}/rest/v1/site_texts?on_conflict=key`, {
    method: "POST",
    headers: {
      ...headers(),
      Prefer: `resolution=${mode === "overwrite" ? "merge-duplicates" : "ignore-duplicates"},return=minimal`,
    },
    body: JSON.stringify(rows.map((r) => ({ ...r, updated_at: new Date().toISOString() }))),
    cache: "no-store",
  });
  if (res.ok) return { ok: true };
  const body = await res.text();
  if (body.includes("PGRST205") || body.includes("site_texts")) {
    return {
      ok: false,
      error: "The site_texts table does not exist yet. Run supabase/site_texts.sql in the Supabase SQL editor.",
    };
  }
  return { ok: false, error: body.slice(0, 200) };
}
