import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, ArrowUpRight, BadgeIndianRupee, ShieldCheck } from "lucide-react";
import { getAllCities, getSite } from "@/lib/content";
import CitiesGrid from "./CitiesGrid";

export const metadata: Metadata = {
  title: "Packers & Movers in All Cities",
  description:
    "Find verified packers and movers in all major cities across India. Compare quotes, check ratings, and book trusted movers near you.",
  alternates: { canonical: "https://radhepackersandmovers.com/cities" },
  openGraph: {
    title: "Packers & Movers in All Cities | Radhe Packers and Movers",
    description: "Find verified packers and movers in all major cities across India. Compare quotes and book trusted movers near you.",
    url: "https://radhepackersandmovers.com/cities",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Packers & Movers in All Cities | Radhe Packers and Movers",
    description: "Find verified packers and movers in all major cities across India.",
    images: ["/og-image.jpg"],
  },
};

export default function CitiesPage() {
  const cities = getAllCities();
  const site = getSite();

  return (
    <>
      {/* HERO */}
      <section className="hero-mesh grain relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-20 lg:pb-20">
          <div className="eyebrow mb-5">
            <span className="w-8 h-px bg-saffron-500" />
            All Cities
          </div>
          <h1 className="display text-3xl sm:text-4xl md:text-6xl font-bold leading-[0.95] text-midnight-900 max-w-3xl">
            Movers in every corner of{" "}
            <span className="grad-saffron">India</span>
          </h1>
          <p className="mt-6 text-lg text-midnight-500 max-w-xl">
            {cities.length} cities covered. KYC-verified vendors, transparent
            pricing, and live GPS tracking — wherever you move.
          </p>

          {/* Trust pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="chip !py-2 !px-3.5">
              <MapPin size={14} className="text-saffron-500" />
              {cities.length} Cities
            </span>
            <span className="chip !py-2 !px-3.5">
              <ShieldCheck size={14} className="text-saffron-500" />
              KYC Verified Vendors
            </span>
            <span className="chip !py-2 !px-3.5">
              <BadgeIndianRupee size={14} className="text-saffron-500" />
              Free Quotes
            </span>
          </div>
        </div>
      </section>

      {/* CITY CARDS with search */}
      <CitiesGrid cities={cities} />

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-20">
        <div className="rounded-[32px] md:rounded-[40px] bg-midnight-900 text-white p-8 md:p-16 grain relative overflow-hidden text-center">
          <div className="absolute inset-0 dark-mesh opacity-60" />
          <div className="relative">
            <div className="eyebrow !text-saffron-400 mb-4 justify-center">
              <span className="w-8 h-px bg-saffron-500" />
              Don't see your city?
            </div>
            <h2 className="display text-3xl md:text-5xl font-bold mb-4">
              We're expanding{" "}
              <span className="grad-saffron">everywhere</span>
            </h2>
            <p className="text-midnight-300 text-lg mb-8 max-w-xl mx-auto">
              Fill a quick quote request and we'll connect you with verified
              movers in your area — no matter where you are.
            </p>
            <Link
              href="/booking"
              className="group inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-midnight-900 font-bold rounded-full px-8 py-3.5 transition"
            >
              Get Free Quotes
              <ArrowUpRight
                size={16}
                className="group-hover:rotate-45 transition"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: site.url },
              { "@type": "ListItem", position: 2, name: "Cities", item: `${site.url}/cities` },
            ],
          }),
        }}
      />
    </>
  );
}

