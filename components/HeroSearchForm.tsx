"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Truck, ArrowRight, MapPin, Search, ChevronDown, X, Home, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type Props = { cities: string[] };

/* ── Searchable city combobox ── */
function CitySelect({
  label,
  accent,
  value,
  onChange,
  cities,
}: {
  label: string;
  accent: "saffron" | "mint";
  value: string;
  onChange: (v: string) => void;
  cities: string[];
}) {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState<{ top: number; left: number } | null>(null);
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? cities.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    : cities;

  function openDropdown() {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setDropPos({ top: r.bottom + window.scrollY + 8, left: r.left + window.scrollX });
    setOpen(true);
  }

  function closeDropdown() {
    setOpen(false);
    setQuery("");
    setDropPos(null);
  }

  /* close on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || dropRef.current?.contains(t)) return;
      closeDropdown();
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* close on PAGE scroll / resize — but not on scroll inside the dropdown itself */
  useEffect(() => {
    if (!open) return;
    const handler = (e: Event) => {
      if (dropRef.current?.contains(e.target as Node)) return;
      closeDropdown();
    };
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const dot = accent === "saffron" ? "bg-saffron-500" : "bg-mint-500";

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={open ? closeDropdown : openDropdown}
        className="w-full rounded-2xl px-4 py-2.5 hover:bg-cream-100 transition text-left flex items-center justify-between"
      >
        <div className="min-w-0">
          <div className="label !mb-0 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {label}
          </div>
          <div className="text-sm font-bold text-midnight-900 truncate max-w-[130px]">
            {value || "Select city"}
          </div>
        </div>
        <ChevronDown
          size={14}
          className={`text-midnight-400 shrink-0 ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Portal — renders at <body> to escape any overflow:hidden ancestor */}
      {open && dropPos && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropRef}
            style={{
              position: "absolute",
              top: dropPos.top,
              left: dropPos.left,
              width: 288,
              zIndex: 9999,
              boxShadow: "0 24px 64px -12px rgba(10,14,39,0.22)",
              borderRadius: "1rem",
              background: "#fff",
              border: "1px solid #e8eaf3",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Search bar */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-midnight-100 rounded-t-2xl overflow-hidden">
              <Search size={13} className="text-midnight-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city..."
                className="flex-1 text-sm text-midnight-900 placeholder-midnight-400 outline-none bg-transparent"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="text-midnight-400 hover:text-midnight-700 transition">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* List */}
            <ul
              style={{
                maxHeight: 224,
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "#c4c9de transparent",
              }}
              className="py-1.5"
            >
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-midnight-400 text-center">No cities found</li>
              ) : (
                filtered.map((city) => (
                  <li key={city}>
                    <button
                      type="button"
                      onClick={() => { onChange(city); closeDropdown(); }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left transition ${
                        city === value
                          ? "bg-saffron-50 text-saffron-600 font-bold"
                          : "text-midnight-800 hover:bg-cream-100 font-medium"
                      }`}
                    >
                      <MapPin size={12} className="shrink-0 text-midnight-400" />
                      <span className="flex-1 truncate">{city}</span>
                      {city === value && <span className="text-xs text-saffron-500 shrink-0">✓</span>}
                    </button>
                  </li>
                ))
              )}
            </ul>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-midnight-100 text-xs text-midnight-400 bg-midnight-50 rounded-b-2xl overflow-hidden">
              {filtered.length} of {cities.length} cities
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

const SIZES = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK+", "Office"];

/* ── Size dropdown — same portal pattern as CitySelect ── */
function SizeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  function openDropdown() {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setDropPos({ top: r.bottom + window.scrollY + 8, left: r.left + window.scrollX });
    setOpen(true);
  }
  function closeDropdown() { setOpen(false); setDropPos(null); }

  useEffect(() => {
    function handler(e: MouseEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || dropRef.current?.contains(t)) return;
      closeDropdown();
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: Event) => {
      if (dropRef.current?.contains(e.target as Node)) return;
      closeDropdown();
    };
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open ? closeDropdown : openDropdown}
        className="w-full rounded-2xl px-4 py-2.5 hover:bg-cream-100 transition text-left flex items-center justify-between"
      >
        <div className="min-w-0">
          <div className="label !mb-0 flex items-center gap-1.5">
            <Home size={11} className="text-saffron-500" />
            Size
          </div>
          <div className="text-sm font-bold text-midnight-900">{value}</div>
        </div>
        <ChevronDown
          size={14}
          className={`text-midnight-400 shrink-0 ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && dropPos && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropRef}
            style={{
              position: "absolute",
              top: dropPos.top,
              left: dropPos.left,
              width: 200,
              zIndex: 9999,
              boxShadow: "0 24px 64px -12px rgba(10,14,39,0.22)",
              borderRadius: "1rem",
              background: "#fff",
              border: "1px solid #e8eaf3",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <ul className="py-1.5">
              {SIZES.map((size) => (
                <li key={size}>
                  <button
                    type="button"
                    onClick={() => { onChange(size); closeDropdown(); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition ${
                      size === value
                        ? "bg-saffron-50 text-saffron-600 font-bold"
                        : "text-midnight-800 hover:bg-cream-100 font-medium"
                    }`}
                  >
                    <span>{size}</span>
                    {size === value && <span className="text-xs text-saffron-500">✓</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </>
  );
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

/* ── Custom calendar date picker ── */
function DateSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parsed   = value ? new Date(value + "T00:00:00") : today;
  const [open, setOpen]       = useState(false);
  const [dropPos, setDropPos] = useState<{ top: number; left: number } | null>(null);
  const [cursor, setCursor]   = useState({ year: parsed.getFullYear(), month: parsed.getMonth() });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef    = useRef<HTMLDivElement>(null);

  function openDropdown() {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setDropPos({ top: r.bottom + window.scrollY + 8, left: r.left + window.scrollX });
    setOpen(true);
  }
  function closeDropdown() { setOpen(false); setDropPos(null); }

  useEffect(() => {
    function handler(e: MouseEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || dropRef.current?.contains(t)) return;
      closeDropdown();
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: Event) => {
      if (dropRef.current?.contains(e.target as Node)) return;
      closeDropdown();
    };
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open]);

  /* build calendar grid */
  const firstDay = new Date(cursor.year, cursor.month, 1).getDay();
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function selectDay(day: number) {
    const m = String(cursor.month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${cursor.year}-${m}-${d}`);
    closeDropdown();
  }

  function prevMonth() {
    setCursor(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  }
  function nextMonth() {
    setCursor(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });
  }

  const selectedDate = value ? new Date(value + "T00:00:00") : null;
  const isSelected = (day: number) =>
    selectedDate?.getFullYear() === cursor.year &&
    selectedDate?.getMonth()    === cursor.month &&
    selectedDate?.getDate()     === day;
  const isToday = (day: number) =>
    today.getFullYear() === cursor.year &&
    today.getMonth()    === cursor.month &&
    today.getDate()     === day;
  const isPast = (day: number) =>
    new Date(cursor.year, cursor.month, day) < today;

  const displayLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "Pick a date";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open ? closeDropdown : openDropdown}
        className="w-full rounded-2xl px-4 py-2.5 hover:bg-cream-100 transition text-left flex items-center justify-between"
      >
        <div className="min-w-0">
          <div className="label !mb-0 flex items-center gap-1.5">
            <CalendarDays size={11} className="text-saffron-500" />
            Move Date
          </div>
          <div className="text-sm font-bold text-midnight-900 whitespace-nowrap">{displayLabel}</div>
        </div>
        <ChevronDown
          size={14}
          className={`text-midnight-400 shrink-0 ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && dropPos && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropRef}
            style={{
              position: "absolute",
              top: dropPos.top,
              left: dropPos.left,
              width: 288,
              zIndex: 9999,
              boxShadow: "0 24px 64px -12px rgba(10,14,39,0.22)",
              borderRadius: "1rem",
              background: "#fff",
              border: "1px solid #e8eaf3",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Month nav */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-midnight-100">
              <button
                type="button"
                onClick={prevMonth}
                className="w-7 h-7 rounded-full flex items-center justify-center text-midnight-500 hover:bg-cream-100 hover:text-midnight-900 transition"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="text-sm font-bold text-midnight-900">
                {MONTHS[cursor.month]} {cursor.year}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="w-7 h-7 rounded-full flex items-center justify-center text-midnight-500 hover:bg-cream-100 hover:text-midnight-900 transition"
              >
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="px-3 pt-3 pb-3">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-[10px] font-bold text-midnight-400 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((day, i) => {
                  if (!day) return <div key={i} />;
                  const sel  = isSelected(day);
                  const tod  = isToday(day);
                  const past = isPast(day);
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={past}
                      onClick={() => selectDay(day)}
                      className={`
                        relative w-full aspect-square flex items-center justify-center text-xs font-semibold rounded-full transition
                        ${sel  ? "bg-saffron-500 text-white shadow-[0_4px_12px_-2px_rgba(255,107,53,0.5)]" : ""}
                        ${!sel && tod  ? "text-saffron-500 ring-1 ring-saffron-300" : ""}
                        ${!sel && !past ? "hover:bg-saffron-50 hover:text-saffron-600 text-midnight-800" : ""}
                        ${past ? "text-midnight-200 cursor-not-allowed" : "cursor-pointer"}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick shortcuts */}
            <div className="px-3 pb-3 flex gap-2">
              {[
                { label: "Today",    days: 0 },
                { label: "Tomorrow", days: 1 },
                { label: "+1 Week",  days: 7 },
              ].map(({ label, days }) => {
                const d = new Date(today);
                d.setDate(d.getDate() + days);
                const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => { onChange(iso); setCursor({ year: d.getFullYear(), month: d.getMonth() }); closeDropdown(); }}
                    className="flex-1 text-xs font-semibold py-1.5 rounded-xl bg-midnight-50 text-midnight-600 hover:bg-saffron-50 hover:text-saffron-600 transition"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

/* ── Main form ── */
export default function HeroSearchForm({ cities }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    pickupCity: cities[0] ?? "",
    dropCity: cities[1] ?? cities[0] ?? "",
    houseSize: "2 BHK",
    movingDate: "2026-04-15",
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(form).toString();
    router.push(`/booking?${params}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-10 bg-white rounded-[28px] p-3 border border-midnight-100 shadow-[0_30px_60px_-30px_rgba(10,14,39,0.25)] grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 max-w-3xl"
    >
      <CitySelect label="From" accent="saffron" value={form.pickupCity} onChange={(v) => setForm({ ...form, pickupCity: v })} cities={cities} />
      <CitySelect label="To"   accent="mint"    value={form.dropCity}   onChange={(v) => setForm({ ...form, dropCity: v })}   cities={cities} />

      <SizeSelect value={form.houseSize} onChange={(v) => setForm({ ...form, houseSize: v })} />

      <DateSelect value={form.movingDate} onChange={(v) => setForm({ ...form, movingDate: v })} />

      <button type="submit" className="btn btn-primary !rounded-2xl !py-4 !px-5 col-span-2 lg:col-span-1">
        <Truck size={16} /> Get Quote <ArrowRight size={14} />
      </button>
    </form>
  );
}
