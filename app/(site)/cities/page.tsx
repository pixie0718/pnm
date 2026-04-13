import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, ArrowUpRight, BadgeIndianRupee, ShieldCheck } from "lucide-react";
import { getAllCities, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Packers & Movers in All Cities | ShiftIndia",
  description:
    "Find verified packers and movers in all major cities across India. Compare quotes, check ratings, and book trusted movers near you.",
  alternates: { canonical: "https://shiftindia.in/cities" },
};

export default function CitiesPage() {
  const cities = getAllCities();
  const site = getSite();

  // Group cities by state
  const byState: Record<string, typeof cities> = {};
  for (const city of cities) {
    if (!byState[city.state]) byState[city.state] = [];
    byState[city.state].push(city);
  }
  const states = Object.keys(byState).sort();

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

      {/* CITY CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {states.length > 1 ? (
          /* Group by state if multiple states exist */
          <div className="space-y-10 md:space-y-14">
            {states.map((state) => (
              <div key={state}>
                <div className="eyebrow mb-5">
                  <span className="w-8 h-px bg-saffron-500" />
                  {state}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {byState[state].map((city) => (
                    <CityCard key={city.slug} city={city} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Flat grid if all cities in one state */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        )}
      </section>

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
              className="group inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-400 text-midnight-900 font-bold rounded-full px-8 py-3.5 transition"
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

function CityCard({ city }: { city: ReturnType<typeof getAllCities>[number] }) {
  return (
    <Link
      href={`/packers-and-movers-in-${city.slug}`}
      className="group card p-3.5 sm:p-5 hover:shadow-glow hover:-translate-y-1 transition-all"
    >
      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{city.emoji}</div>
      <div className="display text-sm sm:text-lg font-bold text-midnight-900 leading-tight flex items-start justify-between gap-1">
        <span className="truncate">{city.name}</span>
        <ArrowUpRight
          size={13}
          className="text-saffron-500 opacity-0 group-hover:opacity-100 transition shrink-0 mt-0.5"
        />
      </div>
      <div className="text-[11px] sm:text-xs text-midnight-500 mt-0.5 truncate">{city.state}</div>
      <div className="mt-2 sm:mt-3 flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-midnight-600">
        <BadgeIndianRupee size={11} className="text-saffron-500 shrink-0" />
        <span>₹{city.startingPrice.toLocaleString()}+</span>
      </div>
      <div className="text-[11px] sm:text-xs text-midnight-400 mt-0.5">
        {city.vendorCount.toLocaleString()}+ vendors
      </div>
    </Link>
  );
}
