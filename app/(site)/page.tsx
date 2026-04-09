import Link from "next/link";
import type { Metadata } from "next";
import {
  ShieldCheck, MapPin, PackageCheck, BadgeIndianRupee, Star, ArrowUpRight,
  Phone, Sparkles, Truck, Package, Heart, CircleDot,
} from "lucide-react";
import StickySearch from "@/components/StickySearch";
import HeroSearchForm from "@/components/HeroSearchForm";
import {
  getSite,
  getReviews,
  getStats,
  getAllCities,
} from "@/lib/content";

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    title: site.home.title,
    description: site.home.description,
    keywords: site.home.keywords,
    openGraph: {
      title: site.home.title,
      description: site.home.description,
      type: "website",
      url: site.url,
      images: [{ url: site.seo.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: site.home.title,
      description: site.home.description,
      images: [site.seo.ogImage],
    },
    alternates: { canonical: site.url },
  };
}

const ICON_MAP: Record<string, React.ReactNode> = {
  shield: <ShieldCheck size={14} />,
  map: <MapPin size={14} />,
  package: <PackageCheck size={14} />,
  rupee: <BadgeIndianRupee size={14} />,
};

export default function HomePage() {
  const site = getSite();
  const reviews = getReviews().slice(0, 3);
  const stats = getStats();
  const cities = getAllCities();
  const cityNames = cities.map((c) => c.name);

  return (
    <>
      <StickySearch cities={cityNames} />

      {/* ─────────────── HERO ─────────────── */}
      <section className="hero-mesh grain relative overflow-hidden">
        <div className="absolute top-20 right-0 w-[400px] h-[400px] dot-grid opacity-60 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28 lg:pt-20 lg:pb-36 relative">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
            {/* LEFT */}
            <div>
              <div className="eyebrow mb-6">
                <span className="w-8 h-px bg-saffron-500"></span>
                {site.hero.eyebrow}
              </div>

              <h1 className="display text-[44px] sm:text-6xl lg:text-[84px] font-bold leading-[0.95] text-midnight-900">
                {site.hero.headingLines.map((line, i) => (
                  <span key={i}>
                    {i === site.hero.headingLines.length - 1 ? (
                      <span className="relative inline-block">
                        <span className="grad-saffron">{line}</span>
                        <svg
                          className="absolute -bottom-3 left-0 w-full"
                          viewBox="0 0 300 20"
                          fill="none"
                        >
                          <path
                            d="M 5 12 Q 75 2, 150 10 T 295 8"
                            stroke="#ff6b35"
                            strokeWidth="5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    ) : (
                      <>
                        {line}
                        <br />
                      </>
                    )}
                  </span>
                ))}
              </h1>

              <p className="mt-8 text-lg md:text-xl text-midnight-500 max-w-xl leading-relaxed">
                {site.hero.subheading}
              </p>

              <HeroSearchForm cities={cityNames} />
              <div id="hero-search-end" aria-hidden="true"></div>

              <div className="mt-8 flex flex-wrap gap-2">
                {site.hero.trustPills.map((t) => (
                  <span key={t.label} className="chip !py-2 !px-3.5">
                    <span className="text-saffron-500">{ICON_MAP[t.icon]}</span>
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT: Illustration */}
            <div className="relative h-[500px] lg:h-[600px] hidden lg:block">
              <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900 overflow-hidden grain shadow-[0_40px_100px_-30px_rgba(255,107,53,0.5)]">
                <div className="absolute inset-0 opacity-20 dot-grid" style={{ backgroundImage: "radial-gradient(rgba(255,107,53,0.3) 1.5px, transparent 1.5px)" }}></div>

                <div className="absolute top-12 right-12 w-32 h-32 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 blur-2xl opacity-60"></div>
                <div className="absolute top-16 right-16 w-24 h-24 rounded-full bg-gradient-to-br from-saffron-300 to-saffron-500"></div>

                <svg className="absolute inset-x-0 top-[45%] w-full h-40" viewBox="0 0 500 120" preserveAspectRatio="none">
                  <path d="M 20 90 Q 120 40, 240 70 T 480 40" stroke="#ff6b35" strokeWidth="3" fill="none" className="road-line" />
                  <circle cx="20" cy="90" r="8" fill="#ff6b35" />
                  <circle cx="20" cy="90" r="14" fill="none" stroke="#ff6b35" strokeWidth="2" opacity="0.4" />
                  <circle cx="480" cy="40" r="8" fill="#00d9a3" />
                  <circle cx="480" cy="40" r="14" fill="none" stroke="#00d9a3" strokeWidth="2" opacity="0.4" />
                </svg>

                <div className="absolute top-[50%] left-0 w-full animate-truck-drive">
                  <div className="w-16 h-16 bg-white rounded-2xl grid place-items-center shadow-glow -rotate-6">
                    <Truck size={28} className="text-saffron-500" />
                  </div>
                </div>

                <div className="absolute top-20 left-8 bg-white rounded-2xl p-3 shadow-lg animate-float tilt-l w-44">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-mint-500/20 text-mint-600 grid place-items-center">
                      <Star size={16} fill="currentColor" />
                    </div>
                    <div>
                      <div className="text-xs text-midnight-500">Avg Rating</div>
                      <div className="text-sm font-bold text-midnight-900">{stats.raw.averageRating} out of 5</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-32 right-6 bg-white rounded-2xl p-3 shadow-lg animate-float-slow tilt-r w-48">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-saffron-500/20 text-saffron-600 grid place-items-center">
                      <Package size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-midnight-500">Packages moved</div>
                      <div className="text-sm font-bold text-midnight-900">2.4M+</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-36 right-10 bg-saffron-500 text-white rounded-full px-4 py-2 shadow-glow animate-float text-xs font-bold tilt-r">
                  ⚡ Booked in 22s
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-midnight-950 via-midnight-900/80 to-transparent">
                  <svg viewBox="0 0 500 100" className="absolute bottom-0 w-full h-20 opacity-50" preserveAspectRatio="none">
                    <polygon fill="#ff6b35" points="0,100 0,70 30,70 30,50 60,50 60,80 90,80 90,40 120,40 120,65 160,65 160,35 200,35 200,75 240,75 240,45 280,45 280,70 320,70 320,30 360,30 360,60 400,60 400,75 440,75 440,50 480,50 480,80 500,80 500,100" />
                  </svg>
                </div>

                <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-mint-500 animate-pulse"></span>
                  <span className="text-white text-xs font-bold tracking-wider">LIVE · {stats.raw.livingNow.toLocaleString()} moving now</span>
                </div>
              </div>

              <div className="absolute -top-6 -left-6 w-14 h-14 bg-mint-500 rounded-2xl -rotate-12 grid place-items-center shadow-lg">
                <Heart className="text-white" size={22} fill="currentColor" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-cream-200 rounded-full grid place-items-center shadow-lg border-4 border-white">
                <div className="text-center">
                  <div className="text-[10px] font-bold text-saffron-600">SINCE</div>
                  <div className="text-lg font-black text-midnight-900">2019</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── MARQUEE ─────────────── */}
      <section className="bg-midnight-900 text-white py-6 overflow-hidden border-y border-midnight-700">
        <div className="marquee-track">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center gap-12 px-6">
              {site.marquee.map((t, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-6 whitespace-nowrap">
                  <span className="display text-2xl md:text-3xl font-bold text-white">{t}</span>
                  <span className="w-2 h-2 rounded-full bg-saffron-500"></span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────── HOW IT WORKS ─────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="grid md:grid-cols-2 gap-6 items-end mb-14">
          <div>
            <div className="eyebrow mb-4">
              <span className="w-8 h-px bg-saffron-500"></span> {site.howItWorks.eyebrow}
            </div>
            <h2 className="display text-4xl md:text-6xl font-bold text-midnight-900 leading-[0.95]">
              {site.howItWorks.heading} <br />
              <span className="grad-saffron">{site.howItWorks.headingAccent}</span>
            </h2>
          </div>
          <p className="text-midnight-500 text-lg max-w-md md:ml-auto">
            {site.howItWorks.description}
          </p>
        </div>

        <div className="grid md:grid-cols-6 gap-5 auto-rows-[220px]">
          {/* Step 1 */}
          <div className="md:col-span-3 md:row-span-2 card p-8 relative overflow-hidden group hover:shadow-glow transition-all">
            <div className="absolute top-0 right-0 w-40 h-40 bg-saffron-500/10 rounded-full blur-3xl"></div>
            <div className="flex items-start justify-between mb-6">
              <div className="display text-7xl font-bold text-saffron-500">{site.howItWorks.steps[0].number}</div>
              <div className="w-14 h-14 rounded-2xl bg-saffron-500 text-white grid place-items-center shadow-glow group-hover:rotate-12 transition">
                <Sparkles size={24} />
              </div>
            </div>
            <h3 className="display text-3xl font-bold text-midnight-900">{site.howItWorks.steps[0].title}</h3>
            <p className="mt-3 text-midnight-500 text-lg">{site.howItWorks.steps[0].description}</p>
            <div className="absolute bottom-6 left-8 right-8 flex gap-2">
              {site.howItWorks.steps[0].chips?.map((c) => (
                <span key={c} className="chip !bg-cream-100 !border-cream-200">{c}</span>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div className="md:col-span-3 card p-8 relative overflow-hidden hover:shadow-glow-mint transition">
            <div className="flex items-start justify-between mb-4">
              <div className="display text-5xl font-bold text-mint-500">{site.howItWorks.steps[1].number}</div>
              <BadgeIndianRupee size={28} className="text-mint-500" />
            </div>
            <h3 className="display text-2xl font-bold text-midnight-900">{site.howItWorks.steps[1].title}</h3>
            <p className="mt-2 text-midnight-500">{site.howItWorks.steps[1].description}</p>
          </div>

          {/* Step 3 */}
          <div className="md:col-span-3 card p-8 relative overflow-hidden hover:shadow-soft transition bg-gradient-to-br from-midnight-900 to-midnight-800 !text-white !border-0">
            <div className="flex items-start justify-between mb-4">
              <div className="display text-5xl font-bold text-saffron-500">{site.howItWorks.steps[2].number}</div>
              <ShieldCheck size={28} className="text-saffron-500" />
            </div>
            <h3 className="display text-2xl font-bold text-white">{site.howItWorks.steps[2].title}</h3>
            <p className="mt-2 text-midnight-200">{site.howItWorks.steps[2].description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.headline.map((s) => (
            <div key={s.label} className="bg-cream-100 rounded-3xl p-6 border border-cream-200 hover:bg-white transition">
              <h3 className="num-block text-4xl md:text-5xl font-bold text-midnight-900">{s.value}</h3>
              <p className="text-sm text-midnight-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────── REVIEWS ─────────────── */}
      <section className="bg-midnight-900 text-white py-28 relative overflow-hidden grain">
        <div className="absolute inset-0 dark-mesh opacity-80"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="eyebrow !text-saffron-400 justify-center mb-4">
              <span className="w-8 h-px bg-saffron-500"></span>
              Real stories
              <span className="w-8 h-px bg-saffron-500"></span>
            </div>
            <h2 className="display text-4xl md:text-6xl font-bold">
              People who <span className="grad-saffron">love</span> us
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.id} className={`bg-white text-midnight-900 rounded-3xl p-7 shadow-soft ${r.rotate} hover:rotate-0 hover:-translate-y-2 transition-all`}>
                <div className="flex items-center gap-1 text-saffron-500 mb-4">
                  {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-lg leading-relaxed">"{r.review}"</p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-midnight-100">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-600 text-white grid place-items-center font-bold">{r.initials}</div>
                  <div>
                    <div className="font-bold">{r.name}</div>
                    <div className="text-xs text-midnight-500">{r.move}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── TOP CITIES ─────────────── */}
      <section className="py-24 bg-midnight-900 overflow-hidden relative">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <div className="eyebrow !text-saffron-400 mb-3">
                <span className="w-8 h-px bg-saffron-500"></span> {stats.raw.cities}+ cities across India
              </div>
              <h2 className="display text-4xl md:text-6xl font-bold text-white leading-[0.95]">
                We move the whole <br className="hidden md:block"/> of <span className="grad-saffron">Bharat</span> 🇮🇳
              </h2>
            </div>
            <Link href="/booking" className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20 transition shrink-0">
              Get a quote <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* BENTO GRID — Mumbai hero left, Delhi tall right, 5 small bottom */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

            {/* Mumbai — big hero */}
            {cities[0] && (
              <Link href={`/cities/${cities[0].slug}`}
                className="group relative col-span-2 md:col-span-2 row-span-2 rounded-3xl overflow-hidden min-h-[340px] md:min-h-[420px] hover:-translate-y-1 transition-all hover:shadow-2xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${cities[0].gradient}`} />
                <div className="absolute inset-0 grain" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 p-7 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <span className="text-7xl leading-none">{cities[0].emoji}</span>
                    <span className="bg-saffron-500 text-white text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">
                      #1 City
                    </span>
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold mb-1">{cities[0].name}</div>
                    <div className="text-white/70 text-sm flex items-center gap-1.5 mb-4">
                      <CircleDot size={12} /> {cities[0].vendorCount.toLocaleString()}+ verified vendors
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition">
                      Explore <ArrowUpRight size={11} />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Delhi — tall card */}
            {cities[1] && (
              <Link href={`/cities/${cities[1].slug}`}
                className="group relative col-span-2 md:col-span-1 row-span-2 rounded-3xl overflow-hidden min-h-[200px] md:min-h-[420px] hover:-translate-y-1 transition-all hover:shadow-2xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${cities[1].gradient}`} />
                <div className="absolute inset-0 grain" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                  <span className="text-5xl">{cities[1].emoji}</span>
                  <div>
                    <div className="text-2xl font-extrabold mb-1">{cities[1].name}</div>
                    <div className="text-white/70 text-xs flex items-center gap-1">
                      <CircleDot size={10} /> {cities[1].vendorCount.toLocaleString()}+ vendors
                    </div>
                  </div>
                </div>
                <ArrowUpRight size={16} className="absolute top-5 right-5 text-white opacity-0 group-hover:opacity-100 transition" />
              </Link>
            )}

            {/* Bangalore + Ahmedabad — top row small */}
            {cities.slice(2, 4).map((city) => (
              <Link key={city.slug} href={`/cities/${city.slug}`}
                className="group relative col-span-1 rounded-3xl overflow-hidden min-h-[200px] hover:-translate-y-1 transition-all hover:shadow-xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${city.gradient}`} />
                <div className="absolute inset-0 grain" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                  <span className="text-4xl">{city.emoji}</span>
                  <div>
                    <div className="text-lg font-extrabold mb-0.5">{city.name}</div>
                    <div className="text-white/60 text-xs flex items-center gap-1">
                      <CircleDot size={9} /> {city.vendorCount.toLocaleString()}+ vendors
                    </div>
                  </div>
                </div>
                <ArrowUpRight size={14} className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ))}

            {/* Bottom row — Hyderabad, Chennai, Pune, Kolkata */}
            {cities.slice(4, 8).map((city) => (
              <Link key={city.slug} href={`/cities/${city.slug}`}
                className="group relative col-span-1 rounded-3xl overflow-hidden min-h-[150px] md:min-h-[170px] hover:-translate-y-1 transition-all hover:shadow-xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${city.gradient}`} />
                <div className="absolute inset-0 grain" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-between text-white">
                  <span className="text-3xl">{city.emoji}</span>
                  <div>
                    <div className="text-base font-extrabold">{city.name}</div>
                    <div className="text-white/60 text-[11px] flex items-center gap-1 mt-0.5">
                      <CircleDot size={9} /> {city.vendorCount.toLocaleString()}+
                    </div>
                  </div>
                </div>
                <ArrowUpRight size={13} className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ))}
          </div>

          {/* SECONDARY CITIES — scrolling marquee row */}
          <div className="mt-6 relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-midnight-400 text-xs font-semibold uppercase tracking-widest">Also available in</span>
              <div className="flex-1 h-px bg-midnight-700" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Jaipur", "Lucknow", "Surat", "Nagpur", "Indore", "Bhopal",
                "Coimbatore", "Kochi", "Chandigarh", "Vizag", "Patna", "Agra",
                "Varanasi", "Rajkot", "Madurai", "Mysore", "Nashik", "Vadodara",
              ].map((city) => (
                <Link key={city} href="/booking"
                  className="px-3.5 py-1.5 rounded-full bg-white/8 border border-white/10 text-midnight-200 text-sm font-medium hover:bg-saffron-500 hover:border-saffron-500 hover:text-white transition">
                  {city}
                </Link>
              ))}
              <Link href="/booking"
                className="px-3.5 py-1.5 rounded-full bg-saffron-500 text-white text-sm font-bold hover:bg-saffron-400 transition flex items-center gap-1">
                +80 more <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── CTA ─────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <div className="relative rounded-[40px] overflow-hidden bg-saffron-500 grain">
          <div className="absolute inset-0 dot-grid opacity-20"></div>
          <Truck className="absolute -right-20 top-1/2 -translate-y-1/2 text-white/10" size={500} strokeWidth={1} />

          <div className="relative p-12 md:p-20 max-w-2xl text-white">
            <div className="eyebrow !text-white/80 mb-5">
              <span className="w-8 h-px bg-white/60"></span>
              {site.cta.eyebrow}
            </div>
            <h2 className="display text-4xl md:text-6xl font-bold leading-[0.95]">
              {site.cta.heading}
            </h2>
            <p className="mt-5 text-lg text-white/90 max-w-md">
              {site.cta.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`tel:${site.phone}`} className="btn bg-white text-saffron-600 hover:bg-cream-100 btn-lg">
                <Phone size={18} /> {site.phoneDisplay}
              </a>
              <Link href="/booking" className="btn btn-dark btn-lg">
                Get Instant Quote <ArrowUpRight size={18} />
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {reviews.slice(0, 4).map((r) => (
                  <div key={r.id} className="w-10 h-10 rounded-full bg-white text-saffron-600 grid place-items-center font-bold text-xs border-2 border-saffron-500">{r.initials}</div>
                ))}
              </div>
              <div>
                <div className="flex text-white">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <div className="text-xs text-white/80">Trusted by 2.4M+ families</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── SCHEMA.ORG JSON-LD ─────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: site.name,
                url: site.url,
                logo: `${site.url}/logo.png`,
                description: site.seo.description,
                sameAs: Object.values(site.social),
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: site.phone,
                  contactType: "customer service",
                  areaServed: "IN",
                  availableLanguage: ["en", "hi"],
                },
              },
              {
                "@type": "WebSite",
                name: site.name,
                url: site.url,
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${site.url}/booking?pickupCity={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@type": "AggregateRating",
                itemReviewed: { "@type": "Organization", name: site.name },
                ratingValue: stats.raw.averageRating,
                reviewCount: stats.raw.customers,
              },
            ],
          }),
        }}
      />
    </>
  );
}
