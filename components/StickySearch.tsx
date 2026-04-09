"use client";
import { useEffect, useState } from "react";
import { Truck } from "lucide-react";

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
      className={`fixed left-0 right-0 top-[76px] z-40 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0 pointer-events-none"
      }`}
    >
      <form
        action="/booking"
        className="max-w-5xl mx-auto bg-white border border-midnight-100 rounded-full shadow-soft pl-2 pr-2 py-2 flex items-center gap-1"
      >
        <div className="flex items-center gap-2 flex-1 px-4 border-r border-midnight-100 hidden md:flex">
          <div className="w-2 h-2 rounded-full bg-saffron-500"></div>
          <select
            name="pickupCity"
            className="bg-transparent outline-none text-sm font-medium flex-1 min-w-0 cursor-pointer"
            defaultValue={cities[0]}
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1 px-4 border-r border-midnight-100 hidden md:flex">
          <div className="w-2 h-2 rounded-full bg-mint-500"></div>
          <select
            name="dropCity"
            className="bg-transparent outline-none text-sm font-medium flex-1 min-w-0 cursor-pointer"
            defaultValue={cities[1] ?? cities[0]}
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <select name="houseSize" className="bg-transparent outline-none text-sm font-medium px-3 border-r border-midnight-100 hidden sm:block" defaultValue="2 BHK">
          <option>1 RK</option>
          <option>1 BHK</option>
          <option>2 BHK</option>
          <option>3 BHK</option>
          <option>4 BHK+</option>
        </select>
        <input
          name="movingDate"
          className="bg-transparent outline-none text-sm font-medium px-3 hidden sm:block"
          type="date"
          defaultValue="2026-04-15"
        />
        <button
          type="submit"
          className="ml-auto btn btn-primary !py-2.5 !px-5 text-sm"
        >
          <Truck size={14} /> Get Quotes
        </button>
      </form>
    </div>
  );
}
