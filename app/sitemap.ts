import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getAllCitySlugs, getSite } from "@/lib/content";
import { prisma } from "@/lib/prisma";

// ─── Pages that must never appear in the sitemap ─────────────────────────────
// Add a segment name here to exclude it and all its children.
const EXCLUDE_SEGMENTS = new Set([
  "login",
  "signup",
  "account",   // user-private pages
  "admin",     // admin dashboard
]);

// ─── Priority rules by route prefix ──────────────────────────────────────────
function priority(route: string): number {
  if (route === "/") return 1.0;
  if (route === "/cities" || route === "/blog") return 0.8;
  if (route === "/booking") return 0.7;
  if (route === "/contact" || route === "/faq") return 0.6;
  return 0.5;
}

function changeFreq(route: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (route === "/" || route === "/blog") return "daily";
  if (route === "/cities") return "weekly";
  if (route === "/terms" || route === "/privacy-policy") return "yearly";
  return "monthly";
}

// ─── Auto-discover every static page under /app ──────────────────────────────
// • Route groups like (site), (authed) are transparent in the URL.
// • Dynamic segments [param] are skipped — handled separately below.
// • Any segment in EXCLUDE_SEGMENTS is skipped recursively.
function scanStaticRoutes(): string[] {
  const appDir = path.join(process.cwd(), "app");
  const routes: string[] = [];

  function scan(dir: string, urlPath: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    if (entries.some((e) => e.isFile() && /^page\.(tsx|ts|jsx|js)$/.test(e.name))) {
      routes.push(urlPath === "" ? "/" : urlPath);
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const name = entry.name;

      if (name.startsWith("[")) continue;           // dynamic — handled separately
      if (EXCLUDE_SEGMENTS.has(name)) continue;     // private pages

      if (name.startsWith("(") && name.endsWith(")")) {
        scan(path.join(dir, name), urlPath);        // route group — transparent URL
        continue;
      }

      scan(path.join(dir, name), `${urlPath}/${name}`);
    }
  }

  scan(appDir, "");
  return routes;
}

// ─── Sitemap entry builder ────────────────────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSite().url.replace(/\/$/, "");
  const now = new Date();

  // 1. Static pages — auto-discovered from the filesystem
  const staticEntries: MetadataRoute.Sitemap = scanStaticRoutes().map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: changeFreq(route),
    priority: priority(route),
  }));

  // 2. City landing pages — /packers-and-movers-in-[slug]
  //    (cities/[slug] is a redirect, so excluded from scan — only canonical URLs here)
  const cityEntries: MetadataRoute.Sitemap = getAllCitySlugs().map((slug) => ({
    url: `${base}/packers-and-movers-in-${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 3. Published blog posts — from database
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...cityEntries, ...blogEntries];
}
