"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Truck, ArrowRight } from "lucide-react";
import { CityDropdown, SizeDropdown, DateSelector } from "@/components/RouteDropdowns";

type Props = { cities: string[] };

/* ─────────────────────────────────────────────
   Main Form
───────────────────────────────────────────── */
export default function HeroSearchForm({ cities }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    pickupCity: cities[0] ?? "",
    dropCity: cities[1] ?? cities[0] ?? "",
    houseSize: "2 BHK",
    movingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.pickupCity || !form.dropCity) return;
    const params = new URLSearchParams(form).toString();
    router.push(`/booking?${params}`);
  }

  return (
    <div className="max-w-4xl relative z-50">
      <form
        onSubmit={onSubmit}
        className="mt-10 bg-white rounded-[32px] p-2 sm:p-3 border border-midnight-100 shadow-[0_30px_60px_-30px_rgba(10,14,39,0.25)] relative"
      >
        <div className="grid grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_0.8fr_1.1fr_auto] gap-1 items-center">
          <CityDropdown
            label="From"
            accent="saffron"
            value={form.pickupCity}
            onChange={(v) => setForm((f) => ({ ...f, pickupCity: v }))}
            cities={cities}
          />

          <CityDropdown
            label="To"
            accent="mint"
            value={form.dropCity}
            onChange={(v) => setForm((f) => ({ ...f, dropCity: v }))}
            cities={cities}
          />

          <SizeDropdown
            value={form.houseSize}
            onChange={(v) => setForm((f) => ({ ...f, houseSize: v }))}
          />

          <DateSelector
            value={form.movingDate}
            onChange={(v) => setForm((f) => ({ ...f, movingDate: v }))}
          />

          <button
            type="submit"
            className="btn btn-primary !rounded-2xl !py-4 !px-6 col-span-2 lg:col-span-1 group hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <Truck size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="lg:hidden xl:inline font-bold">Get Quote</span>
            <ArrowRight size={14} className="opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>

      <div className="mt-5 flex items-center justify-center lg:justify-start gap-4 sm:gap-8 text-[11px] font-bold text-midnight-400 uppercase tracking-[0.2em] px-2 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-mint-500 shadow-[0_0_10px_rgba(0,217,163,0.5)]" />
          Secure Move
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-saffron-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
          Verified Vendors
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-midnight-300" />
          Lowest Price
        </div>
      </div>
    </div>
  );
}
