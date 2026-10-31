import { NextResponse } from "next/server";
import { FLAG_COOKIE, SESSION_COOKIE } from "@/lib/admin";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(FLAG_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
