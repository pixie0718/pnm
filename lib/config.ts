// ─────────────────────────────────────────────
// Contact & Site Configuration
// All contact details come from environment variables
// ─────────────────────────────────────────────

export const CONTACT = {
  phone: process.env.NEXT_PUBLIC_PHONE || "18001234567",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY || "1800-123-4567",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "918001234567",
  email: process.env.NEXT_PUBLIC_EMAIL || "hello@radhepackers.in",
} as const;

export const SITE = {
  name: "राधे Packers and Movers",
  tagline: "Your Trusted Move",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;
