import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ShieldCheck, MapPin, Star, ArrowUpRight, BadgeIndianRupee, CheckCircle2,
} from "lucide-react";
import HeroSearchForm from "@/components/HeroSearchForm";
import {
  getAllCities,
  getAllCitySlugs,
  getCityBySlug,
  getSite,
} from "@/lib/content";

// Only generate paths matching "packers-and-movers-in-*"
export function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({
    citySlug: `packers-and-movers-in-${slug}`,
  }));
}

function parseCitySlug(citySlug: string) {
  const PREFIX = "packers-and-movers-in-";
  if (!citySlug.startsWith(PREFIX)) return null;
  return citySlug.slice(PREFIX.length);
}

export function generateMetadata({
  params,
}: {
  params: { citySlug: string };
}): Metadata {
  const slug = parseCitySlug(params.citySlug);
  const city = slug ? getCityBySlug(slug) : null;
  if (!city) return { title: "City not found" };
  const site = getSite();

  return {
    title: city.seo.title,
    description: city.seo.description,
    keywords: city.seo.keywords,
    openGraph: {
      title: city.seo.title,
      description: city.seo.description,
      type: "website",
      url: `${site.url}/packers-and-movers-in-${city.slug}`,
      images: city.seo.ogImage ? [{ url: city.seo.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: city.seo.title,
      description: city.seo.description,
      images: city.seo.ogImage ? [city.seo.ogImage] : undefined,
    },
    alternates: {
      canonical: `${site.url}/packers-and-movers-in-${city.slug}`,
    },
  };
}

export default function CityPage({ params }: { params: { citySlug: string } }) {
  const slug = parseCitySlug(params.citySlug);
  const city = slug ? getCityBySlug(slug) : null;
  if (!city) notFound();

  const site = getSite();
  const cityNames = getAllCities().map((c) => c.name);

  return (
    <>
      {/* HERO */}
      <section className="hero-mesh grain relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:pt-20">
          <div className="eyebrow mb-5">
            <span className="w-8 h-px bg-saffron-500"></span>
            {city.state} · {city.vendorCount.toLocaleString()}+ verified vendors
          </div>

          <div className="flex items-start gap-4 mb-2">
            <span className="text-6xl">{city.emoji}</span>
          </div>

          <h1 className="display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] text-midnight-900 max-w-4xl">
            {city.hero.title}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-midnight-500 max-w-2xl">
            {city.hero.subtitle}
          </p>

          <HeroSearchForm cities={cityNames} />

          {/* Trust pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="chip !py-2 !px-3.5">
              <BadgeIndianRupee size={14} className="text-saffron-500" />
              Starting ₹{city.startingPrice.toLocaleString()}
            </span>
            <span className="chip !py-2 !px-3.5">
              <ShieldCheck size={14} className="text-saffron-500" />
              KYC Verified Vendors
            </span>
            <span className="chip !py-2 !px-3.5">
              <Star size={14} className="text-saffron-500" />
              4.8★ Average Rating
            </span>
            <span className="chip !py-2 !px-3.5">
              <MapPin size={14} className="text-saffron-500" />
              All Areas Covered
            </span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      {city.intro && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="eyebrow mb-4">
            <span className="w-8 h-px bg-saffron-500"></span>
            About moving in {city.name}
          </div>
          <h2 className="display text-3xl md:text-5xl font-bold text-midnight-900 leading-[0.95] mb-6">
            Everything you need to know
          </h2>
          <p className="text-lg text-midnight-700 leading-relaxed whitespace-pre-line">
            {city.intro}
          </p>
        </section>
      )}

      {/* WHY US */}
      {city.whyUs && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="rounded-[40px] bg-midnight-900 text-white p-12 md:p-16 grain relative overflow-hidden">
            <div className="absolute inset-0 dark-mesh opacity-60"></div>
            <div className="relative max-w-3xl">
              <div className="eyebrow !text-saffron-400 mb-4">
                <span className="w-8 h-px bg-saffron-500"></span>
                Why ShiftIndia in {city.name}?
              </div>
              <h2 className="display text-3xl md:text-5xl font-bold mb-6">
                Move smarter, not <span className="grad-saffron">harder</span>
              </h2>
              <p className="text-lg text-midnight-200 leading-relaxed">{city.whyUs}</p>

              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                {[
                  "100% verified vendors",
                  "Transparent pricing",
                  "Live GPS tracking",
                  "₹5L damage protection",
                  "Pay after delivery",
                  "24×7 customer support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={16} className="text-mint-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* POPULAR ROUTES */}
      {city.popularRoutes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="eyebrow mb-4">
            <span className="w-8 h-px bg-saffron-500"></span>
            Popular routes from {city.name}
          </div>
          <h2 className="display text-3xl md:text-5xl font-bold text-midnight-900 leading-[0.95] mb-8">
            Where are you moving?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {city.popularRoutes.map((to) => (
              <Link
                key={to}
                href={`/packers-and-movers-in-${to.toLowerCase()}`}
                className="group card p-5 hover:shadow-glow hover:-translate-y-1 transition-all"
              >
                <div className="text-xs text-midnight-500 font-bold uppercase tracking-wider">
                  {city.name} →
                </div>
                <div className="display text-xl font-bold text-midnight-900 mt-1 flex items-center justify-between">
                  {to}
                  <ArrowUpRight
                    size={16}
                    className="text-saffron-500 opacity-0 group-hover:opacity-100 transition"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {city.faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="eyebrow mb-4">
            <span className="w-8 h-px bg-saffron-500"></span>
            Frequently asked
          </div>
          <h2 className="display text-3xl md:text-5xl font-bold text-midnight-900 leading-[0.95] mb-8">
            Questions, answered.
          </h2>
          <div className="space-y-3">
            {city.faqs.map((f, i) => (
              <details
                key={i}
                className="group card p-6 cursor-pointer hover:shadow-glow transition"
              >
                <summary className="flex items-center justify-between font-bold text-midnight-900 list-none">
                  <span className="display text-lg">{f.q}</span>
                  <span className="text-saffron-500 group-open:rotate-45 transition text-2xl">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-midnight-700 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* SCHEMA.ORG JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "LocalBusiness",
                name: `${site.name} ${city.name}`,
                description: city.seo.description,
                url: `${site.url}/packers-and-movers-in-${city.slug}`,
                telephone: site.phone,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: city.name,
                  addressRegion: city.state,
                  addressCountry: "IN",
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.8",
                  reviewCount: city.vendorCount,
                },
                priceRange: `₹${city.startingPrice}+`,
              },
              ...(city.faqs.length > 0
                ? [
                    {
                      "@type": "FAQPage",
                      mainEntity: city.faqs.map((f) => ({
                        "@type": "Question",
                        name: f.q,
                        acceptedAnswer: { "@type": "Answer", text: f.a },
                      })),
                    },
                  ]
                : []),
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: site.url },
                  { "@type": "ListItem", position: 2, name: "Cities", item: `${site.url}/cities` },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: `Packers and Movers in ${city.name}`,
                    item: `${site.url}/packers-and-movers-in-${city.slug}`,
                  },
                ],
              },
            ],
          }),
        }}
      />
    </>
  );
}
