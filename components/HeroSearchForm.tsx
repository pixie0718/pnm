"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Truck, ArrowRight } from "lucide-react";

type Props = {
  cities: string[];
};

export default function HeroSearchForm({ cities }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    pickupCity: cities[0] ?? "",
    dropCity: cities[1] ?? cities[0] ?? "",
    houseSize: "2 BHK",
    movingDate: "2026-04-15",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(form).toString();
    router.push(`/booking?${params}`);
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="mt-10 bg-white rounded-[28px] p-3 border border-midnight-100 shadow-[0_30px_60px_-30px_rgba(10,14,39,0.25)] grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 max-w-2xl"
      >
        <div className="rounded-2xl px-4 py-2.5 hover:bg-cream-100 transition">
          <div className="label !mb-0 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron-500"></span>
            From
          </div>
          <select
            className="bg-transparent outline-none text-sm font-bold text-midnight-900 w-full cursor-pointer"
            value={form.pickupCity}
            onChange={update("pickupCity")}
            required
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="rounded-2xl px-4 py-2.5 hover:bg-cream-100 transition">
          <div className="label !mb-0 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-500"></span>
            To
          </div>
          <select
            className="bg-transparent outline-none text-sm font-bold text-midnight-900 w-full cursor-pointer"
            value={form.dropCity}
            onChange={update("dropCity")}
            required
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="rounded-2xl px-4 py-2.5 hover:bg-cream-100 transition">
          <div className="label !mb-0">Size</div>
          <select
            className="bg-transparent outline-none text-sm font-bold text-midnight-900 w-full"
            value={form.houseSize}
            onChange={update("houseSize")}
          >
            <option>1 RK</option>
            <option>1 BHK</option>
            <option>2 BHK</option>
            <option>3 BHK</option>
            <option>4 BHK+</option>
            <option>Office</option>
          </select>
        </div>
        <div className="rounded-2xl px-4 py-2.5 hover:bg-cream-100 transition">
          <div className="label !mb-0">Date</div>
          <input
            type="date"
            value={form.movingDate}
            onChange={update("movingDate")}
            className="bg-transparent outline-none text-sm font-bold text-midnight-900 w-full"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary !rounded-2xl !py-4 !px-5 col-span-2 lg:col-span-1"
        >
          <Truck size={16} /> Get Quote <ArrowRight size={14} />
        </button>
      </form>
    </>
  );
}
