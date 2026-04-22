"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, BadgeIndianRupee, Building2 } from "lucide-react";
import type { getAllStates } from "@/lib/content";

type State = ReturnType<typeof getAllStates>[number];

export default function StatesGrid({ states }: { states: State[] }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? states.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      )
    : states;

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
          placeholder="Search state or UT…"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((state) => (
              <StateCard key={state.slug} state={state} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-midnight-900 font-bold text-lg">No states found</p>
          <p className="text-midnight-500 mt-1 text-sm">
            Try a different spelling — e.g. &ldquo;UP&rdquo; won&apos;t match, try &ldquo;Uttar&rdquo;
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-4 text-sm text-saffron-600 hover:underline font-medium"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Cross-link to Cities */}
      <div className="mt-14 rounded-3xl bg-midnight-900 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white font-bold text-lg">Browse by City</p>
          <p className="text-midnight-300 text-sm mt-0.5">Find packers &amp; movers in 120+ cities across India</p>
        </div>
        <Link
          href="/cities"
          className="shrink-0 inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-sm rounded-full px-6 py-3 transition"
        >
          View All Cities <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}

function StateCard({ state }: { state: State }) {
  return (
    <Link
      href={`/packers-and-movers-in-${state.slug}`}
      className="group card p-3.5 sm:p-5 hover:shadow-glow hover:-translate-y-1 transition-all"
    >
      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{state.emoji}</div>
      <div className="display text-sm sm:text-base font-bold text-midnight-900 leading-tight flex items-start justify-between gap-1">
        <span className="truncate">{state.name}</span>
        <ArrowUpRight
          size={13}
          className="text-saffron-500 opacity-0 group-hover:opacity-100 transition shrink-0 mt-0.5"
        />
      </div>
      <div className="mt-2 flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-midnight-600">
        <Building2 size={11} className="text-saffron-500 shrink-0" />
        <span>{state.cityCount} {state.cityCount === 1 ? "city" : "cities"}</span>
      </div>
      <div className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-midnight-600">
        <BadgeIndianRupee size={11} className="text-saffron-500 shrink-0" />
        <span>₹{state.startingPrice.toLocaleString()}+</span>
      </div>
      <div className="text-[11px] sm:text-xs text-midnight-400 mt-0.5">
        {state.vendorCount.toLocaleString()}+ vendors
      </div>
    </Link>
  );
}
