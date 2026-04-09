// ─────────────────────────────────────────────
// Static content loader
// Reads JSON files from /data at build time.
// All functions are synchronous — they run during
// SSG (generateStaticParams / generateMetadata)
// and never touch the filesystem on the client.
// ─────────────────────────────────────────────
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

function readJson<T>(relPath: string): T {
  const full = path.join(DATA_DIR, relPath);
  const raw = fs.readFileSync(full, "utf8");
  return JSON.parse(raw) as T;
}

// ─── Types ────────────────────────────────────
export type SiteContent = {
  name: string;
  tagline: string;
  url: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  social: Record<string, string>;
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  home: { title: string; description: string; keywords: string[] };
  hero: {
    eyebrow: string;
    headingLines: string[];
    subheading: string;
    trustPills: { icon: string; label: string }[];
  };
  marquee: string[];
  howItWorks: {
    eyebrow: string;
    heading: string;
    headingAccent: string;
    description: string;
    steps: { number: string; title: string; description: string; chips?: string[] }[];
  };
  cta: { eyebrow: string; heading: string; description: string };
};

export type Review = {
  id: number;
  name: string;
  initials: string;
  rating: number;
  review: string;
  move: string;
  rotate: string;
};

export type Stats = {
  headline: { value: string; label: string }[];
  raw: Record<string, number>;
};

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  startingPrice: number;
};

export type Faq = { q: string; a: string };

export type City = {
  slug: string;
  name: string;
  state: string;
  emoji: string;
  gradient: string;
  vendorCount: number;
  startingPrice: number;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  hero: { title: string; subtitle: string };
  intro: string;
  whyUs: string;
  popularRoutes: string[];
  faqs: Faq[];
};

// ─── Cached loaders ──────────────────────────
let _site: SiteContent | null = null;
let _reviews: Review[] | null = null;
let _stats: Stats | null = null;
let _services: Service[] | null = null;
let _faqs: Faq[] | null = null;
let _cities: City[] | null = null;

export function getSite(): SiteContent {
  if (!_site) _site = readJson<SiteContent>("site.json");
  return _site;
}

export function getReviews(): Review[] {
  if (!_reviews) _reviews = readJson<Review[]>("reviews.json");
  return _reviews;
}

export function getStats(): Stats {
  if (!_stats) _stats = readJson<Stats>("stats.json");
  return _stats;
}

export function getServices(): Service[] {
  if (!_services) _services = readJson<Service[]>("services.json");
  return _services;
}

export function getFaqs(): Faq[] {
  if (!_faqs) _faqs = readJson<Faq[]>("faqs.json");
  return _faqs;
}

export function getAllCities(): City[] {
  if (_cities) return _cities;
  const dir = path.join(DATA_DIR, "cities");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  _cities = files
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as City)
    .sort((a, b) => b.vendorCount - a.vendorCount);
  return _cities;
}

export function getAllCitySlugs(): string[] {
  return getAllCities().map((c) => c.slug);
}

export function getCityBySlug(slug: string): City | null {
  return getAllCities().find((c) => c.slug === slug) ?? null;
}
