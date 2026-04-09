/**
 * Customer auth — HMAC session tokens only.
 *
 * Fully Edge-compatible (Web Crypto). Safe to import from middleware.
 * Password hashing lives in lib/password.ts (Node runtime only).
 */

export const CUSTOMER_SESSION_COOKIE = "customer_session";
export const CUSTOMER_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export type CustomerSessionPayload = {
  customerId: number;
  phone: string;
  role: "customer";
  iat: number;
  exp: number;
};

function getSecret(): string {
  return (
    process.env.ADMIN_SECRET ||
    "dev-only-insecure-secret-change-me-please-32-chars"
  );
}

// ── base64url helpers ──
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

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ── Session tokens ──
export async function signCustomerSession(
  customerId: number,
  phone: string
): Promise<string> {
  const now = Date.now();
  const payload: CustomerSessionPayload = {
    customerId,
    phone,
    role: "customer",
    iat: now,
    exp: now + CUSTOMER_SESSION_TTL_MS,
  };
  const body = base64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmacSha256(body);
  return `${body}.${sig}`;
}

export async function verifyCustomerSession(
  token: string
): Promise<CustomerSessionPayload | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;

  const expected = await hmacSha256(body);
  if (!timingSafeEqualStr(expected, sig)) return null;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(body))
    ) as CustomerSessionPayload;
    if (!payload.exp || Date.now() > payload.exp) return null;
    if (payload.role !== "customer") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentCustomer(): Promise<CustomerSessionPayload | null> {
  const { cookies } = await import("next/headers");
  const token = cookies().get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyCustomerSession(token);
}

