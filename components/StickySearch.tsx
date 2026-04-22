"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, ArrowRight } from "lucide-react";
import { CityDropdown, SizeDropdown, DateSelector } from "@/components/RouteDropdowns";

type Props = { cities: string[] };

export default function StickySearch({ cities }: Props) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [from, setFrom] = useState(cities[0] ?? "");
  const [to, setTo] = useState(cities[1] ?? "");
  const [size, setSize] = useState("2 BHK");
  const [date, setDate] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const sentinel = document.getElementById("hero-search-end");
      if (!sentinel) return;
      setShow(sentinel.getBoundingClientRect().top < 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      pickupCity: from,
      dropCity: to,
      houseSize: size,
      ...(date && { movingDate: date }),
    });
    router.push(`/booking?${params.toString()}`);
  }

  return (
    <div
      className={`hidden sm:block fixed left-0 right-0 top-[76px] z-40 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100 visible" : "-translate-y-3 opacity-0 invisible"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-xl border border-midnight-100 rounded-2xl shadow-[0_8px_40px_-8px_rgba(10,14,39,0.18),0_0_0_1px_rgba(10,14,39,0.04)] p-2"
        >
          <div className="flex items-center gap-2">

            {/* From */}
            <div className="flex-1 min-w-0 hidden md:block">
              <CityDropdown
                label="From"
                accent="saffron"
                value={from}
                onChange={setFrom}
                cities={cities}
              />
            </div>

            {/* Arrow */}
            <div className="hidden md:flex shrink-0 text-midnight-300">
              <ArrowRight size={14} />
            </div>

            {/* To */}
            <div className="flex-1 min-w-0 hidden md:block">
              <CityDropdown
                label="To"
                accent="mint"
                value={to}
                onChange={setTo}
                cities={cities}
              />
            </div>

            {/* Mobile: From only */}
            <div className="flex-1 min-w-0 md:hidden">
              <CityDropdown
                label="Moving from"
                accent="saffron"
                value={from}
                onChange={setFrom}
                cities={cities}
              />
            </div>

            {/* Size */}
            <div className="hidden sm:block shrink-0 w-[120px]">
              <SizeDropdown value={size} onChange={setSize} />
            </div>

            {/* Date */}
            <div className="hidden sm:block shrink-0 w-[140px]">
              <DateSelector value={date} onChange={setDate} />
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="group shrink-0 flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-sm rounded-xl px-5 py-3 transition-all shadow-[0_4px_14px_-4px_rgba(234,179,8,0.5)] hover:shadow-[0_6px_20px_-4px_rgba(234,179,8,0.65)] hover:-translate-y-px active:translate-y-0"
            >
              <Truck size={15} className="group-hover:translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Get Quotes</span>
              <span className="sm:hidden">Go</span>
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
