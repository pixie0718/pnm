"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, BadgeIndianRupee } from "lucide-react";
import type { getAllCities } from "@/lib/content";

type City = ReturnType<typeof getAllCities>[number];

export default function CitiesGrid({ cities }: { cities: City[] }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? cities.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.state.toLowerCase().includes(query.toLowerCase())
      )
    : cities;

  // Group by state only when not searching
  const byState: Record<string, City[]> = {};
  for (const city of filtered) {
    if (!byState[city.state]) byState[city.state] = [];
    byState[city.state].push(city);
  }
  const states = Object.keys(byState).sort();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Search bar */}
      <div className="relative max-w-md mb-8">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-400 cursor-pointer hover:text-saffron-500 transition-colors"
          onClick={() => inputRef.current?.focus()}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city or state…"
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-midnight-200 bg-white text-midnight-900 placeholder-midnight-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-transparent text-sm shadow-sm cursor-text caret-midnight-900"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight-400 hover:text-midnight-700 text-lg leading-none cursor-pointer"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <>
          {query && (
            <p className="text-sm text-midnight-500 mb-6">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
          )}

          {query.trim() ? (
            /* Flat grid when searching */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((city) => (
                <CityCard key={city.slug} city={city} />
              ))}
            </div>
          ) : (
            /* Grouped by state when not searching */
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
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-midnight-900 font-bold text-lg">No cities found</p>
          <p className="text-midnight-500 mt-1 text-sm">
            Try searching by city name or state — e.g. &ldquo;Mumbai&rdquo; or &ldquo;Gujarat&rdquo;
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-4 text-sm text-saffron-600 hover:underline font-medium"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Cross-link to States */}
      <div className="mt-14 rounded-3xl bg-midnight-900 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white font-bold text-lg">Browse by State</p>
          <p className="text-midnight-300 text-sm mt-0.5">Explore packers &amp; movers across all 32 states &amp; UTs</p>
        </div>
        <Link
          href="/states"
          className="shrink-0 inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-sm rounded-full px-6 py-3 transition"
        >
          View All States <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}

function CityCard({ city }: { city: City }) {
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
