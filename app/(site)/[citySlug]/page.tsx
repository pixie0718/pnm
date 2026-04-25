import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ShieldCheck, MapPin, Star, ArrowUpRight, BadgeIndianRupee, CheckCircle2,
  Truck, Container, Car, Users, Building2,
} from "lucide-react";
import HeroSearchForm from "@/components/HeroSearchForm";
import PricingTables from "@/components/PricingTables";
import {
  getAllCities,
  getAllCitySlugs,
  getCityBySlug,
  getAllStateSlugs,
  getStateBySlug,
  getCitiesForState,
  getAllRoutes,
  getRouteBySlug,
  getSite,
  type City,
  type State,
  type CityRoute,
} from "@/lib/content";

const PREFIX    = "packers-and-movers-in-";
const RT_PREFIX = "packers-and-movers-from-";

function trimDesc(desc: string): string {
  if (desc.length <= 160) return desc;
  const sentences = desc.match(/[^.!?]*[.!?]+/g) ?? [];
  let result = "";
  for (const s of sentences) {
    if (result.length + s.length <= 160) result += s;
    else break;
  }
  return result.trim() || desc.slice(0, 157) + "…";
}

export function generateStaticParams() {
  return [
    ...getAllCitySlugs().map((slug) => ({ citySlug: `${PREFIX}${slug}` })),
    ...getAllStateSlugs().map((slug) => ({ citySlug: `${PREFIX}${slug}` })),
    ...getAllRoutes().map(({ from, to }) => ({
      citySlug: `${RT_PREFIX}${from.slug}-to-${to.slug}`,
    })),
  ];
}

function parseRouteSlug(raw: string): { from: string; to: string } | null {
  if (!raw.startsWith(RT_PREFIX)) return null;
  const rest = raw.slice(RT_PREFIX.length);
  const idx = rest.indexOf("-to-");
  if (idx === -1) return null;
  return { from: rest.slice(0, idx), to: rest.slice(idx + 4) };
}

function parseSlug(citySlug: string) {
  if (!citySlug.startsWith(PREFIX)) return null;
  return citySlug.slice(PREFIX.length);
}

export function generateMetadata({
  params,
}: {
  params: { citySlug: string };
}): Metadata {
  const site = getSite();
  const raw = params.citySlug;

  // Route page
  const routeParts = parseRouteSlug(raw);
  if (routeParts) {
    const route = getRouteBySlug(routeParts.from, routeParts.to);
    if (route) {
      const { from, to } = route;
      const price = Math.max(from.startingPrice, to.startingPrice);
      const title = `${from.name}–${to.name} Packers & Movers | From ₹${price.toLocaleString()}`;
      const description = trimDesc(`Trusted packers and movers from ${from.name} to ${to.name}. ${from.vendorCount + to.vendorCount}+ verified vendors, instant quotes starting ₹${price.toLocaleString()}, GPS tracking & ₹5L damage cover.`);
      const canonical = `${site.url}/${RT_PREFIX}${from.slug}-to-${to.slug}`;
      return {
        title, description,
        keywords: [`packers movers ${from.name} to ${to.name}`, `shifting ${from.name} to ${to.name}`, `relocation ${from.name} ${to.name}`, `movers ${from.name} ${to.name}`],
        openGraph: { title, description, type: "website", url: canonical, images: [{ url: site.seo.ogImage }] },
        twitter: { card: "summary_large_image", title, description, images: [site.seo.ogImage] },
        alternates: { canonical },
      };
    }
  }

  const slug = parseSlug(raw);
  if (!slug) return { title: "Not found" };

  const city = getCityBySlug(slug);
  if (city) {
    const pageTitle = city.seo.title.replace(/\s*\|.*$/, '').trim();
    const ogImage = city.seo.ogImage || site.seo.ogImage;
    const cityDesc = trimDesc(city.seo.description);
    return {
      title: pageTitle,
      description: cityDesc,
      keywords: city.seo.keywords,
      openGraph: {
        title: city.seo.title,
        description: cityDesc,
        type: "website",
        url: `${site.url}/${PREFIX}${city.slug}`,
        images: [{ url: ogImage }],
      },
      twitter: {
        card: "summary_large_image",
        title: city.seo.title,
        description: cityDesc,
        images: [ogImage],
      },
      alternates: { canonical: `${site.url}/${PREFIX}${city.slug}` },
    };
  }

  const state = getStateBySlug(slug);
  if (state) {
    const pageTitle = state.seo.title.replace(/\s*\|.*$/, '').trim();
    const stateDesc = trimDesc(state.seo.description);
    return {
      title: pageTitle,
      description: stateDesc,
      keywords: state.seo.keywords,
      openGraph: { title: state.seo.title, description: stateDesc, type: "website", url: `${site.url}/${PREFIX}${state.slug}`, images: [{ url: site.seo.ogImage }] },
      twitter: { card: "summary_large_image", title: state.seo.title, description: stateDesc, images: [site.seo.ogImage] },
      alternates: { canonical: `${site.url}/${PREFIX}${state.slug}` },
    };
  }

  return { title: "Not found" };
}

export default function CityOrStatePage({ params }: { params: { citySlug: string } }) {
  const raw = params.citySlug;

  // Route page
  const routeParts = parseRouteSlug(raw);
  if (routeParts) {
    const route = getRouteBySlug(routeParts.from, routeParts.to);
    if (route) return <RoutePage route={route} />;
  }

  const slug = parseSlug(raw);
  if (!slug) notFound();

  const city = getCityBySlug(slug);
  if (city) return <CityPage city={city} />;

  const state = getStateBySlug(slug);
  if (state) return <StatePage state={state} />;

  notFound();
}

// ─── City Page ────────────────────────────────────────────────────────────────

function CityPage({ city }: { city: City }) {
  const site = getSite();
  const allCities = getAllCities();
  const cityNames = allCities.map((c) => c.name);
  const cityByName = new Map(allCities.map((c) => [c.name.toLowerCase(), c]));
  const routeSet = new Set(getAllRoutes().map((r) => `${r.from.slug}__${r.to.slug}`));

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

      {city.whyUs && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="rounded-[40px] bg-midnight-900 text-white p-12 md:p-16 grain relative overflow-hidden">
            <div className="absolute inset-0 dark-mesh opacity-60"></div>
            <div className="relative max-w-3xl">
              <div className="eyebrow !text-saffron-400 mb-4">
                <span className="w-8 h-px bg-saffron-500"></span>
                Why Radhe packers and movers in {city.name}?
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

      <FleetSection locationName={city.name} />
      <PricingTables cityName={city.name} />

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
            {city.popularRoutes.flatMap((to) => {
              const toCity = cityByName.get(to.toLowerCase());
              if (!toCity) return [];
              const hasRoute = routeSet.has(`${city.slug}__${toCity.slug}`);
              const href = hasRoute
                ? `/${RT_PREFIX}${city.slug}-to-${toCity.slug}`
                : `/${PREFIX}${toCity.slug}`;
              return [(
                <Link
                  key={to}
                  href={href}
                  className="group card p-5 hover:shadow-glow hover:-translate-y-1 transition-all"
                >
                  <div className="text-xs text-midnight-500 font-bold uppercase tracking-wider">
                    {city.name} →
                  </div>
                  <div className="display text-xl font-bold text-midnight-900 mt-1 flex items-center justify-between">
                    {toCity.name}
                    <ArrowUpRight
                      size={16}
                      className="text-saffron-500 opacity-0 group-hover:opacity-100 transition"
                    />
                  </div>
                </Link>
              )];
            })}
          </div>
        </section>
      )}

      <FaqSection faqs={city.faqs} />

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
                url: `${site.url}/${PREFIX}${city.slug}`,
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
                ? [{
                    "@type": "FAQPage",
                    mainEntity: city.faqs.map((f) => ({
                      "@type": "Question",
                      name: f.q,
                      acceptedAnswer: { "@type": "Answer", text: f.a },
                    })),
                  }]
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
                    item: `${site.url}/${PREFIX}${city.slug}`,
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

// ─── State Page ───────────────────────────────────────────────────────────────

function StatePage({ state }: { state: State }) {
  const site = getSite();
  const cityNames = getAllCities().map((c) => c.name);
  const stateCities = getCitiesForState(state.name);

  return (
    <>
      {/* HERO */}
      <section className="hero-mesh grain relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:pt-20">
          <div className="eyebrow mb-5">
            <span className="w-8 h-px bg-saffron-500"></span>
            {state.cityCount} cities covered · {state.vendorCount.toLocaleString()}+ verified vendors
          </div>

          <div className="flex items-start gap-4 mb-2">
            <span className="text-6xl">{state.emoji}</span>
          </div>

          <h1 className="display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] text-midnight-900 max-w-4xl">
            {state.hero.title}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-midnight-500 max-w-2xl">
            {state.hero.subtitle}
          </p>

          <HeroSearchForm cities={cityNames} />

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="chip !py-2 !px-3.5">
              <BadgeIndianRupee size={14} className="text-saffron-500" />
              Starting ₹{state.startingPrice.toLocaleString()}
            </span>
            <span className="chip !py-2 !px-3.5">
              <Building2 size={14} className="text-saffron-500" />
              {state.cityCount} Cities Covered
            </span>
            <span className="chip !py-2 !px-3.5">
              <ShieldCheck size={14} className="text-saffron-500" />
              KYC Verified Vendors
            </span>
            <span className="chip !py-2 !px-3.5">
              <Star size={14} className="text-saffron-500" />
              4.8★ Average Rating
            </span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      {state.intro && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="eyebrow mb-4">
            <span className="w-8 h-px bg-saffron-500"></span>
            About moving in {state.name}
          </div>
          <h2 className="display text-3xl md:text-5xl font-bold text-midnight-900 leading-[0.95] mb-6">
            Everything you need to know
          </h2>
          <p className="text-lg text-midnight-700 leading-relaxed whitespace-pre-line">
            {state.intro}
          </p>
        </section>
      )}

      {/* WHY US */}
      {state.whyUs && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="rounded-[40px] bg-midnight-900 text-white p-12 md:p-16 grain relative overflow-hidden">
            <div className="absolute inset-0 dark-mesh opacity-60"></div>
            <div className="relative max-w-3xl">
              <div className="eyebrow !text-saffron-400 mb-4">
                <span className="w-8 h-px bg-saffron-500"></span>
                Why Radhe packers and movers in {state.name}?
              </div>
              <h2 className="display text-3xl md:text-5xl font-bold mb-6">
                Move smarter, not <span className="grad-saffron">harder</span>
              </h2>
              <p className="text-lg text-midnight-200 leading-relaxed">{state.whyUs}</p>
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

      <FleetSection locationName={state.name} />
      <PricingTables cityName={state.name} />

      {/* CITIES IN THIS STATE */}
      {stateCities.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="eyebrow mb-4">
            <span className="w-8 h-px bg-saffron-500"></span>
            Cities we serve in {state.name}
          </div>
          <h2 className="display text-3xl md:text-5xl font-bold text-midnight-900 leading-[0.95] mb-8">
            Choose your city
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stateCities.map((city) => (
              <Link
                key={city.slug}
                href={`/${PREFIX}${city.slug}`}
                className="group card p-4 sm:p-5 hover:shadow-glow hover:-translate-y-1 transition-all"
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{city.emoji}</div>
                <div className="display text-sm sm:text-base font-bold text-midnight-900 leading-tight flex items-start justify-between gap-1">
                  <span className="truncate">{city.name}</span>
                  <ArrowUpRight
                    size={13}
                    className="text-saffron-500 opacity-0 group-hover:opacity-100 transition shrink-0 mt-0.5"
                  />
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-midnight-600">
                  <BadgeIndianRupee size={11} className="text-saffron-500 shrink-0" />
                  <span>₹{city.startingPrice.toLocaleString()}+</span>
                </div>
                <div className="text-xs text-midnight-400 mt-0.5">
                  {city.vendorCount.toLocaleString()}+ vendors
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FaqSection faqs={state.faqs} />

      {/* SCHEMA.ORG JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "LocalBusiness",
                name: `${site.name} ${state.name}`,
                description: state.seo.description,
                url: `${site.url}/${PREFIX}${state.slug}`,
                telephone: site.phone,
                address: {
                  "@type": "PostalAddress",
                  addressRegion: state.name,
                  addressCountry: "IN",
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.8",
                  reviewCount: state.vendorCount,
                },
                priceRange: `₹${state.startingPrice}+`,
              },
              ...(state.faqs.length > 0
                ? [{
                    "@type": "FAQPage",
                    mainEntity: state.faqs.map((f) => ({
                      "@type": "Question",
                      name: f.q,
                      acceptedAnswer: { "@type": "Answer", text: f.a },
                    })),
                  }]
                : []),
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: site.url },
                  { "@type": "ListItem", position: 2, name: "States", item: `${site.url}/states` },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: `Packers and Movers in ${state.name}`,
                    item: `${site.url}/${PREFIX}${state.slug}`,
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

// ─── Route Page ──────────────────────────────────────────────────────────────

function RoutePage({ route }: { route: CityRoute }) {
  const { from, to } = route;
  const site = getSite();
  const cityNames = getAllCities().map((c) => c.name);
  const startingPrice = Math.max(from.startingPrice, to.startingPrice);
  const routeSlug = `${RT_PREFIX}${from.slug}-to-${to.slug}`;

  // Other routes from the same origin city
  const relatedRoutes = from.popularRoutes
    .filter((r) => r.toLowerCase() !== to.name.toLowerCase())
    .slice(0, 5);

  const faqs = [
    {
      q: `How much does a move from ${from.name} to ${to.name} cost?`,
      a: `A 1 BHK move from ${from.name} to ${to.name} starts at ₹${startingPrice.toLocaleString()}. A 2 BHK move typically costs ₹${(startingPrice * 2).toLocaleString()}–₹${(startingPrice * 3).toLocaleString()} depending on volume, packing level and exact pickup/drop locations.`,
    },
    {
      q: `How long does a ${from.name} to ${to.name} move take?`,
      a: `Transit time depends on distance. Our vendors share an estimated delivery window at booking. Most intercity moves are completed within 1–3 days door-to-door, with real-time GPS tracking throughout.`,
    },
    {
      q: `Is my shipment insured on the ${from.name}–${to.name} route?`,
      a: `Yes. Every move includes ₹5 lakh damage protection as standard. For high-value items, you can opt for enhanced coverage at the time of booking.`,
    },
    {
      q: `Can I track my goods from ${from.name} to ${to.name}?`,
      a: `Yes. Live GPS tracking is included on all intercity moves. You'll receive a tracking link via SMS/WhatsApp once the truck departs from ${from.name}.`,
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="hero-mesh grain relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:pt-20">
          <div className="eyebrow mb-5">
            <span className="w-8 h-px bg-saffron-500" />
            {from.state} → {to.state}
          </div>

          <div className="flex items-center gap-3 mb-4 text-5xl">
            <span>{from.emoji}</span>
            <span className="text-2xl text-midnight-300">→</span>
            <span>{to.emoji}</span>
          </div>

          <h1 className="display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] text-midnight-900 max-w-4xl">
            Packers & Movers<br />
            <span className="grad-saffron">{from.name}</span> to{" "}
            <span className="grad-saffron">{to.name}</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-midnight-500 max-w-2xl">
            Verified movers on the {from.name}–{to.name} route. Live GPS tracking,
            ₹5L damage cover and pay-after-delivery.
          </p>

          <HeroSearchForm cities={cityNames} />

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="chip !py-2 !px-3.5">
              <BadgeIndianRupee size={14} className="text-saffron-500" />
              Starting ₹{startingPrice.toLocaleString()}
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
              Door-to-Door
            </span>
          </div>
        </div>
      </section>

      {/* ROUTE OVERVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="eyebrow mb-4">
          <span className="w-8 h-px bg-saffron-500" />
          {from.name} → {to.name} route
        </div>
        <h2 className="display text-3xl md:text-5xl font-bold text-midnight-900 leading-[0.95] mb-6">
          Everything about this move
        </h2>
        <p className="text-lg text-midnight-700 leading-relaxed">
          Moving from {from.name} to {to.name} is one of our well-established intercity routes.
          Radhe packers and movers connects you with {from.vendorCount + to.vendorCount}+ verified vendors who
          regularly operate between {from.state} and {to.state}.
        </p>
        <p className="text-lg text-midnight-700 leading-relaxed mt-4">
          Our vendors handle everything — professional packing at your {from.name} address,
          secure loading, GPS-tracked transit and careful unloading at your {to.name} destination.
          You pay only after successful delivery.
        </p>

        {/* Stats row */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Starting Price", value: `₹${startingPrice.toLocaleString()}` },
            { label: "Vendors Available", value: `${(from.vendorCount + to.vendorCount).toLocaleString()}+` },
            { label: "Damage Cover", value: "₹5 Lakh" },
            { label: "Avg Rating", value: "4.8 ★" },
          ].map(({ label, value }) => (
            <div key={label} className="card p-5 text-center">
              <div className="display text-2xl font-bold text-midnight-900">{value}</div>
              <div className="text-xs text-midnight-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-[40px] bg-midnight-900 text-white p-12 md:p-16 grain relative overflow-hidden">
          <div className="absolute inset-0 dark-mesh opacity-60" />
          <div className="relative max-w-3xl">
            <div className="eyebrow !text-saffron-400 mb-4">
              <span className="w-8 h-px bg-saffron-500" />
              Why Radhe packers and movers for {from.name}–{to.name}?
            </div>
            <h2 className="display text-3xl md:text-5xl font-bold mb-6">
              Move smarter, not <span className="grad-saffron">harder</span>
            </h2>
            <p className="text-lg text-midnight-200 leading-relaxed">
              Our {from.name}–{to.name} route specialists know the best transit roads,
              loading windows, and delivery timings to ensure your goods arrive safely
              and on schedule — with zero hidden charges.
            </p>
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

      <FleetSection locationName={`${from.name}–${to.name}`} />
      <PricingTables cityName={from.name} />

      {/* RELATED ROUTES */}
      {relatedRoutes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="eyebrow mb-4">
            <span className="w-8 h-px bg-saffron-500" />
            More routes from {from.name}
          </div>
          <h2 className="display text-3xl md:text-5xl font-bold text-midnight-900 leading-[0.95] mb-8">
            Where else are you moving?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedRoutes.map((dest) => (
              <Link
                key={dest}
                href={`/${RT_PREFIX}${from.slug}-to-${dest.toLowerCase().replace(/\s+/g, "-")}`}
                className="group card p-5 hover:shadow-glow hover:-translate-y-1 transition-all"
              >
                <div className="text-xs text-midnight-500 font-bold uppercase tracking-wider">
                  {from.name} →
                </div>
                <div className="display text-xl font-bold text-midnight-900 mt-1 flex items-center justify-between">
                  {dest}
                  <ArrowUpRight size={16} className="text-saffron-500 opacity-0 group-hover:opacity-100 transition" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CITY LINKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href={`/${PREFIX}${from.slug}`} className="group card p-6 hover:shadow-glow hover:-translate-y-1 transition-all">
            <div className="text-3xl mb-3">{from.emoji}</div>
            <div className="display text-xl font-bold text-midnight-900 flex items-center justify-between">
              Movers in {from.name}
              <ArrowUpRight size={16} className="text-saffron-500 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="text-sm text-midnight-500 mt-1">{from.vendorCount.toLocaleString()}+ vendors · {from.state}</div>
          </Link>
          <Link href={`/${PREFIX}${to.slug}`} className="group card p-6 hover:shadow-glow hover:-translate-y-1 transition-all">
            <div className="text-3xl mb-3">{to.emoji}</div>
            <div className="display text-xl font-bold text-midnight-900 flex items-center justify-between">
              Movers in {to.name}
              <ArrowUpRight size={16} className="text-saffron-500 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="text-sm text-midnight-500 mt-1">{to.vendorCount.toLocaleString()}+ vendors · {to.state}</div>
          </Link>
        </div>
      </section>

      <FaqSection faqs={faqs} />

      {/* SCHEMA.ORG */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                name: `Packers and Movers from ${from.name} to ${to.name}`,
                description: `Verified packers and movers from ${from.name} to ${to.name}. Starting ₹${startingPrice.toLocaleString()}.`,
                url: `${site.url}/${routeSlug}`,
                provider: { "@type": "Organization", name: site.name, url: site.url },
                areaServed: [
                  { "@type": "City", name: from.name },
                  { "@type": "City", name: to.name },
                ],
                offers: { "@type": "Offer", priceCurrency: "INR", price: startingPrice },
              },
              {
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: site.url },
                  { "@type": "ListItem", position: 2, name: from.name, item: `${site.url}/${PREFIX}${from.slug}` },
                  { "@type": "ListItem", position: 3, name: `${from.name} to ${to.name}`, item: `${site.url}/${routeSlug}` },
                ],
              },
            ],
          }),
        }}
      />
    </>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function FleetSection({ locationName }: { locationName: string }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="eyebrow mb-4">
        <span className="w-8 h-px bg-saffron-500"></span>
        Our fleet in {locationName}
      </div>
      <h2 className="display text-3xl md:text-5xl font-bold text-midnight-900 leading-[0.95] mb-3">
        Right vehicle for every move
      </h2>
      <p className="text-midnight-500 mb-8 text-lg max-w-2xl">
        From a single-room studio to a full office relocation, we deploy the
        exact vehicle size you need — no over-charging for unused space.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            Icon: Car,
            label: "Mini Truck",
            subtitle: "Tata Ace / Bolero Pickup",
            capacity: "Up to 500 kg",
            ideal: "Studio / 1 BHK",
            rooms: "1–2 rooms",
          },
          {
            Icon: Truck,
            label: "Tempo",
            subtitle: "407 / Eicher 10 ft",
            capacity: "Up to 1,500 kg",
            ideal: "1–2 BHK",
            rooms: "2–3 rooms",
          },
          {
            Icon: Truck,
            label: "14-ft Truck",
            subtitle: "Eicher / Tata LPT",
            capacity: "Up to 3,500 kg",
            ideal: "2–3 BHK",
            rooms: "3–5 rooms",
          },
          {
            Icon: Container,
            label: "20-ft Container",
            subtitle: "Full container load",
            capacity: "Up to 7,000 kg",
            ideal: "4+ BHK / Office",
            rooms: "6+ rooms",
          },
        ].map(({ Icon, label, subtitle, capacity, ideal, rooms }) => (
          <div
            key={label}
            className="card p-6 flex flex-col gap-4 hover:shadow-glow hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-saffron-50 flex items-center justify-center shrink-0">
              <Icon size={24} className="text-saffron-500" />
            </div>
            <div>
              <div className="display text-xl font-bold text-midnight-900">{label}</div>
              <div className="text-sm text-midnight-400 mt-0.5">{subtitle}</div>
            </div>
            <div className="flex flex-col gap-1.5 text-sm text-midnight-600">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 shrink-0" />
                {capacity}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 shrink-0" />
                {rooms}
              </div>
              <div className="flex items-center gap-2">
                <Users size={13} className="text-saffron-400 shrink-0" />
                Best for {ideal}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="eyebrow mb-4">
        <span className="w-8 h-px bg-saffron-500"></span>
        Frequently asked
      </div>
      <h2 className="display text-3xl md:text-5xl font-bold text-midnight-900 leading-[0.95] mb-8">
        Questions, answered.
      </h2>
      <div className="space-y-3">
        {faqs.map((f, i) => (
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
  );
}
