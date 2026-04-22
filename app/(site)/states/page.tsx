import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, ArrowUpRight, BadgeIndianRupee, ShieldCheck } from "lucide-react";
import { getAllStates, getSite } from "@/lib/content";
import StatesGrid from "./StatesGrid";

export const metadata: Metadata = {
  title: "Packers & Movers in All States | ShiftIndia",
  description:
    "Find verified packers and movers in every state and Union Territory across India. Compare quotes, check ratings, and book trusted movers in your state.",
  alternates: { canonical: "https://shiftindia.in/states" },
};

export default function StatesPage() {
  const states = getAllStates();
  const site = getSite();

  return (
    <>
      {/* HERO */}
      <section className="hero-mesh grain relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-20 lg:pb-20">
          <div className="eyebrow mb-5">
            <span className="w-8 h-px bg-saffron-500" />
            All States & Union Territories
          </div>
          <h1 className="display text-3xl sm:text-4xl md:text-6xl font-bold leading-[0.95] text-midnight-900 max-w-3xl">
            Movers in every state of{" "}
            <span className="grad-saffron">India</span>
          </h1>
          <p className="mt-6 text-lg text-midnight-500 max-w-xl">
            {states.length} states & UTs covered. KYC-verified vendors, transparent
            pricing, and live GPS tracking — wherever in India you move.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="chip !py-2 !px-3.5">
              <MapPin size={14} className="text-saffron-500" />
              {states.length} States & UTs
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

      {/* STATE CARDS with search */}
      <StatesGrid states={states} />

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-20">
        <div className="rounded-[32px] md:rounded-[40px] bg-midnight-900 text-white p-8 md:p-16 grain relative overflow-hidden text-center">
          <div className="absolute inset-0 dark-mesh opacity-60" />
          <div className="relative">
            <div className="eyebrow !text-saffron-400 mb-4 justify-center">
              <span className="w-8 h-px bg-saffron-500" />
              Don't see your area?
            </div>
            <h2 className="display text-3xl md:text-5xl font-bold mb-4">
              We're expanding{" "}
              <span className="grad-saffron">everywhere</span>
            </h2>
            <p className="text-midnight-300 text-lg mb-8 max-w-xl mx-auto">
              Fill a quick quote request and we'll connect you with verified
              movers anywhere in India — no matter where you are.
            </p>
            <Link
              href="/booking"
              className="group inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-midnight-900 font-bold rounded-full px-8 py-3.5 transition"
            >
              Get Free Quotes
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition" />
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: site.url },
              { "@type": "ListItem", position: 2, name: "States", item: `${site.url}/states` },
            ],
          }),
        }}
      />
    </>
  );
}
