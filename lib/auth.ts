/**
 * Lightweight HMAC-signed session tokens.
 * Edge-runtime compatible (uses Web Crypto, no Node deps).
 *
 * Token format: <base64url(payload)>.<base64url(hmac-sha256)>
 */

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  email: string;
  role: "admin";
  iat: number; // issued at (ms)
  exp: number; // expires at (ms)
};

function getSecret(): string {
  return (
    process.env.ADMIN_SECRET ||
    "dev-only-insecure-secret-change-me-please-32-chars"
  );
}

// ── base64url helpers ──────────────────────────────────────────
function base64urlEncode(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(input: string): Uint8Array {
  let s = input.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

// ── HMAC ───────────────────────────────────────────────────────
async function hmacSha256(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return base64urlEncode(new Uint8Array(sig));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ── Public API ─────────────────────────────────────────────────

export async function signSession(email: string): Promise<string> {
  const now = Date.now();
  const payload: SessionPayload = {
    email,
    role: "admin",
    iat: now,
    exp: now + SESSION_TTL_MS,
  };
  const body = base64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmacSha256(body);
  return `${body}.${sig}`;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;

  const expected = await hmacSha256(body);
  if (!timingSafeEqual(expected, sig)) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(body))) as SessionPayload;
    if (!payload.exp || Date.now() > payload.exp) return null;
    if (payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

/** Server-side helper for layouts/server components (uses next/headers). */
export async function getServerSession(): Promise<SessionPayload | null> {
  // Lazy import to keep this file Edge-compatible
  const { cookies } = await import("next/headers");
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}
