import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  const base = getSite().url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/account/", "/api/", "/login/", "/signup/", "/tracking/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
