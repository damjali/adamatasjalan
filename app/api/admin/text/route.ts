import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { isTextKey } from "@/lib/content";
import { SITE_TEXTS_TAG, saveTexts } from "@/lib/supabase";

// Saves one edited text: { key, value }.
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Not logged in." }, { status: 401 });

  const { key, value } = await req.json().catch(() => ({}));
  if (typeof key !== "string" || typeof value !== "string" || !isTextKey(key) || value.length > 5000) {
    return NextResponse.json({ ok: false, error: "Invalid text." }, { status: 400 });
  }

  const result = await saveTexts([{ key, value }]);
  if (!result.ok) return NextResponse.json(result, { status: 500 });

  revalidateTag(SITE_TEXTS_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
