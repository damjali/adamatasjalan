import { NextResponse } from "next/server";
import { allEntries } from "@/lib/content";
import { FLAG_COOKIE, SESSION_COOKIE, adminConfigured, checkCredentials, createToken, sessionSeconds } from "@/lib/admin";
import { saveTexts } from "@/lib/supabase";

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ ok: false, error: "Admin login is not configured on the server." }, { status: 503 });
  }
  const { username, password } = await req.json().catch(() => ({}));
  // Small delay makes guessing passwords slow.
  await new Promise((r) => setTimeout(r, 700));
  if (typeof username !== "string" || typeof password !== "string" || !checkCredentials(username, password)) {
    return NextResponse.json({ ok: false, error: "Wrong username or password." }, { status: 401 });
  }

  // First login fills Supabase with every default text (existing edits are kept).
  await saveTexts(
    allEntries().map((e) => ({ key: e.key, value: e.value })),
    "keep-existing"
  ).catch(() => undefined);

  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(SESSION_COOKIE, createToken(), {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: sessionSeconds,
  });
  res.cookies.set(FLAG_COOKIE, "1", { httpOnly: false, secure, sameSite: "lax", path: "/", maxAge: sessionSeconds });
  return res;
}
