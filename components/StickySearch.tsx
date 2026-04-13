"use client";
import { useEffect, useState } from "react";
import { Truck, MapPin, Home, CalendarDays, ArrowRight } from "lucide-react";

type Props = {
  cities: string[];
};

export default function StickySearch({ cities }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const sentinel = document.getElementById("hero-search-end");
      if (!sentinel) return;
      const rect = sentinel.getBoundingClientRect();
      setShow(rect.top < 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 top-[76px] z-40 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100 visible" : "-translate-y-3 opacity-0 invisible"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        <form
          action="/booking"
          className="bg-white/95 backdrop-blur-xl border border-midnight-100 rounded-2xl shadow-[0_8px_40px_-8px_rgba(10,14,39,0.18),0_0_0_1px_rgba(10,14,39,0.04)] overflow-hidden"
        >
          <div className="flex items-stretch">

            {/* From */}
            <div className="flex-1 px-4 py-2.5 border-r border-midnight-100 hidden md:flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-500 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-midnight-400">From</span>
              </div>
              <select
                name="pickupCity"
                className="bg-transparent outline-none text-sm font-semibold text-midnight-900 w-full cursor-pointer truncate"
                defaultValue={cities[0]}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Arrow divider */}
            <div className="hidden md:flex items-center px-1 border-r border-midnight-100 text-midnight-300 shrink-0">
              <ArrowRight size={13} />
            </div>

            {/* To */}
            <div className="flex-1 px-4 py-2.5 border-r border-midnight-100 hidden md:flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-mint-500 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-midnight-400">To</span>
              </div>
              <select
                name="dropCity"
                className="bg-transparent outline-none text-sm font-semibold text-midnight-900 w-full cursor-pointer truncate"
                defaultValue={cities[1] ?? cities[0]}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Size */}
            <div className="px-4 py-2.5 border-r border-midnight-100 hidden sm:flex flex-col justify-center shrink-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Home size={10} className="text-saffron-500 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-midnight-400">Size</span>
              </div>
              <select
                name="houseSize"
                className="bg-transparent outline-none text-sm font-semibold text-midnight-900 cursor-pointer"
                defaultValue="2 BHK"
              >
                <option>1 RK</option>
                <option>1 BHK</option>
                <option>2 BHK</option>
                <option>3 BHK</option>
                <option>4 BHK+</option>
              </select>
            </div>

            {/* Date */}
            <div className="px-4 py-2.5 border-r border-midnight-100 hidden sm:flex flex-col justify-center shrink-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <CalendarDays size={10} className="text-saffron-500 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-midnight-400">Date</span>
              </div>
              <input
                name="movingDate"
                className="bg-transparent outline-none text-sm font-semibold text-midnight-900 cursor-pointer w-[110px]"
                type="date"
                defaultValue="2026-04-15"
              />
            </div>

            {/* Mobile: compact label */}
            <div className="flex-1 px-4 py-2.5 sm:hidden flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <MapPin size={10} className="text-saffron-500 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-midnight-400">Moving from</span>
              </div>
              <select
                name="pickupCity"
                className="bg-transparent outline-none text-sm font-semibold text-midnight-900 w-full cursor-pointer truncate"
                defaultValue={cities[0]}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* CTA Button */}
            <div className="p-2 flex items-center shrink-0">
              <button
                type="submit"
                className="group flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-sm rounded-xl px-5 py-2.5 transition-all shadow-[0_4px_14px_-4px_rgba(255,107,53,0.55)] hover:shadow-[0_6px_20px_-4px_rgba(255,107,53,0.65)] hover:-translate-y-px active:translate-y-0"
              >
                <Truck size={15} className="group-hover:translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Get Quotes</span>
                <span className="sm:hidden">Go</span>
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
