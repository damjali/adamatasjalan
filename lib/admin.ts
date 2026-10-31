import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "aj_session";
// Readable by the page so it knows to show the editor; it grants nothing on its own.
export const FLAG_COOKIE = "aj_admin";
export const sessionSeconds = 60 * 60 * 12;

const user = () => process.env.ADMIN_USERNAME?.trim();
const pass = () => process.env.ADMIN_PASSWORD;
export const adminConfigured = () => Boolean(user() && pass());

const secret = () =>
  process.env.ADMIN_SESSION_SECRET ||
  createHash("sha256").update(`${pass()}|${process.env.SUPABASE_SECRET_KEY ?? ""}`).digest("hex");

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("hex");

const safeEqual = (a: string, b: string) => {
  const x = createHash("sha256").update(a).digest();
  const y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y);
};

export function checkCredentials(username: string, password: string) {
  return adminConfigured() && safeEqual(username, user()!) && safeEqual(password, pass()!);
}

export function createToken() {
  const expires = String(Math.floor(Date.now() / 1000) + sessionSeconds);
  return `${expires}.${sign(expires)}`;
}

function validToken(token: string | undefined) {
  if (!token || !adminConfigured()) return false;
  const [expires, mac] = token.split(".");
  if (!expires || !mac || Number(expires) < Date.now() / 1000) return false;
  return safeEqual(mac, sign(expires));
}

export async function isAdmin() {
  return validToken((await cookies()).get(SESSION_COOKIE)?.value);
}
