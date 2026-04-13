"use client";
import { useState, useRef, useEffect, FormEvent, CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Truck, ArrowRight, ChevronDown, Home, CalendarDays, Search } from "lucide-react";

type Props = { cities: string[] };

/* ─────────────────────────────────────────────
   Portal — renders children into document.body,
   completely outside the hero section DOM tree.
   This bypasses every z-index / overflow issue.
───────────────────────────────────────────── */
function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

/* ─────────────────────────────────────────────
   City Dropdown
───────────────────────────────────────────── */
function CityDropdown({
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
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const dot = accent === "saffron" ? "bg-saffron-500" : "bg-mint-500";
  const filtered = cities
    .filter((c) => c.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 10);

  function openDropdown() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const panelWidth = Math.max(r.width, 200);
      const panelHeight = 320; // approximate height
      
      // Calculate position to keep panel within viewport
      let left = r.left;
      let top = r.bottom + 6;
      
      // Ensure panel doesn't go off right edge
      if (left + panelWidth > window.innerWidth) {
        left = window.innerWidth - panelWidth - 16;
      }
      
      // Ensure panel doesn't go off left edge
      if (left < 8) {
        left = 8;
      }
      
      // If not enough space below, show above
      if (top + panelHeight > window.innerHeight) {
        top = r.top - panelHeight - 6;
      }
      
      setPanelStyle({
        position: "fixed",
        top,
        left,
        width: panelWidth,
        maxHeight: panelHeight,
        zIndex: 99999,
      });
    }
    setIsOpen(true);
    setSearch("");
  }

  function closeDropdown() {
    setIsOpen(false);
    setSearch("");
  }

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current && panelRef.current.contains(t)) {
        return; // Click inside panel - don't close
      }
      if (btnRef.current && btnRef.current.contains(t)) {
        return; // Click on button - handled by onClick
      }
      closeDropdown();
    }
    // Use setTimeout to avoid immediate trigger from the click that opened the dropdown
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", onDown);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", onDown);
    };
  }, [isOpen]);

  // Close on scroll / resize
  useEffect(() => {
    if (!isOpen) return;
    const close = () => closeDropdown();
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-100 transition rounded-2xl text-left cursor-pointer"
      >
        <div className="min-w-0">
          <div className="label !mb-0 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {label}
          </div>
          <div className="text-sm font-bold text-midnight-900 truncate max-w-[150px]">
            {value || "Select city"}
          </div>
        </div>
        <ChevronDown
          size={14}
          className={`text-midnight-400 shrink-0 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <Portal>
          <div
            ref={panelRef}
            style={panelStyle}
            className="bg-white border border-midnight-100 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-midnight-50 flex items-center gap-2">
              <Search size={14} className="text-midnight-400 shrink-0" />
              <input
                className="w-full text-sm outline-none bg-transparent"
                placeholder="Search city..."
                value={search}
                autoFocus
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                  if (e.key === "Escape") closeDropdown();
                }}
              />
            </div>
            <div className="max-h-[240px] overflow-y-auto py-2">
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(c);
                      closeDropdown();
                    }}
                    className={`w-full text-left px-5 py-2.5 text-sm hover:bg-cream-50 transition flex items-center justify-between ${
                      value === c
                        ? "text-saffron-600 font-bold bg-saffron-50/50"
                        : "text-midnight-600"
                    }`}
                  >
                    {c}
                    {value === c && (
                      <div className="w-1 h-1 rounded-full bg-saffron-500" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-5 py-4 text-xs text-midnight-400 italic">
                  No cities found
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Size Dropdown
───────────────────────────────────────────── */
const SIZES = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK+", "Office"];

function SizeDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function openDropdown() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const panelWidth = Math.max(r.width, 130);
      const panelHeight = 280;
      
      let left = r.left;
      let top = r.bottom + 6;
      
      if (left + panelWidth > window.innerWidth) {
        left = window.innerWidth - panelWidth - 16;
      }
      
      if (left < 8) {
        left = 8;
      }
      
      if (top + panelHeight > window.innerHeight) {
        top = r.top - panelHeight - 6;
      }
      
      setPanelStyle({
        position: "fixed",
        top,
        left,
        width: panelWidth,
        maxHeight: panelHeight,
        zIndex: 99999,
      });
    }
    setIsOpen(true);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current && panelRef.current.contains(t)) {
        return; // Click inside panel - don't close
      }
      if (btnRef.current && btnRef.current.contains(t)) {
        return; // Click on button - handled by onClick
      }
      closeDropdown();
    }
    // Use setTimeout to avoid immediate trigger from the click that opened the dropdown
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", onDown);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", onDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const close = () => closeDropdown();
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-100 transition rounded-2xl text-left"
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
          className={`text-midnight-400 shrink-0 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <Portal>
          <div
            ref={panelRef}
            style={panelStyle}
            className="bg-white border border-midnight-100 rounded-2xl shadow-xl py-2"
          >
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(s);
                  closeDropdown();
                }}
                className={`w-full text-left px-5 py-2.5 text-sm hover:bg-cream-50 transition ${
                  value === s
                    ? "text-saffron-600 font-bold bg-saffron-50"
                    : "text-midnight-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Portal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Calendar Date Selector
───────────────────────────────────────────── */
const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function DateSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  const [isOpen, setIsOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const [viewYear, setViewYear] = useState(
    () => selectedDate?.getFullYear() ?? today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    () => selectedDate?.getMonth() ?? today.getMonth()
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function openDropdown() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const panelWidth = 268;
      const panelHeight = 380;
      
      let left = r.left;
      let top = r.bottom + 6;
      
      // Ensure panel doesn't go off right edge
      if (left + panelWidth > window.innerWidth) {
        left = window.innerWidth - panelWidth - 16;
      }
      
      // Ensure panel doesn't go off left edge
      if (left < 8) {
        left = 8;
      }
      
      // If not enough space below, show above
      if (top + panelHeight > window.innerHeight) {
        top = r.top - panelHeight - 6;
      }
      
      setPanelStyle({
        position: "fixed",
        top,
        left,
        width: panelWidth,
        maxHeight: panelHeight,
        zIndex: 99999,
      });
    }
    setIsOpen(true);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current && panelRef.current.contains(t)) {
        return; // Click inside panel - don't close
      }
      if (btnRef.current && btnRef.current.contains(t)) {
        return; // Click on button - handled by onClick
      }
      closeDropdown();
    }
    // Use setTimeout to avoid immediate trigger from the click that opened the dropdown
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", onDown);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", onDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const close = () => closeDropdown();
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [isOpen]);

  const displayLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Pick a date";

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function selectDay(day: number) {
    const clicked = new Date(viewYear, viewMonth, day);
    if (clicked < today) return;
    const y = viewYear;
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
    closeDropdown();
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  return (
    <div className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-100 transition rounded-2xl text-left"
      >
        <div className="min-w-0">
          <div className="label !mb-0 flex items-center gap-1.5">
            <CalendarDays size={11} className="text-saffron-500" />
            Move Date
          </div>
          <div className="text-sm font-bold text-midnight-900 whitespace-nowrap">
            {displayLabel}
          </div>
        </div>
        <ChevronDown
          size={14}
          className={`text-midnight-400 shrink-0 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <Portal>
          <div
            ref={panelRef}
            style={panelStyle}
            className="bg-white border border-midnight-100 rounded-2xl shadow-xl p-3"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={prevMonth}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-cream-100 transition text-midnight-500"
              >
                <ChevronDown size={14} className="rotate-90" />
              </button>
              <span className="text-sm font-bold text-midnight-900">
                {SHORT_MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={nextMonth}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-cream-100 transition text-midnight-500"
              >
                <ChevronDown size={14} className="-rotate-90" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAY_NAMES.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-bold text-midnight-400 py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />;
                const cellDate = new Date(viewYear, viewMonth, day);
                const isPast = cellDate < today;
                const isSelected =
                  selectedDate?.getDate() === day &&
                  selectedDate?.getMonth() === viewMonth &&
                  selectedDate?.getFullYear() === viewYear;
                const isTodayCell =
                  today.getDate() === day &&
                  today.getMonth() === viewMonth &&
                  today.getFullYear() === viewYear;

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isPast}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectDay(day)}
                    className={[
                      "text-center text-xs py-1.5 rounded-lg transition font-medium",
                      isPast ? "text-midnight-200 cursor-not-allowed" : "cursor-pointer",
                      isSelected
                        ? "bg-saffron-500 text-white"
                        : isTodayCell
                        ? "bg-cream-200 text-midnight-900 font-bold"
                        : !isPast
                        ? "text-midnight-700 hover:bg-cream-100"
                        : "",
                    ].join(" ")}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Today shortcut */}
            <div className="mt-2 pt-2 border-t border-midnight-50">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  const y = today.getFullYear();
                  const m = String(today.getMonth() + 1).padStart(2, "0");
                  const d = String(today.getDate()).padStart(2, "0");
                  onChange(`${y}-${m}-${d}`);
                  closeDropdown();
                }}
                className="w-full text-center text-xs text-saffron-600 font-semibold hover:bg-saffron-50 rounded-lg py-1.5 transition"
              >
                Today
              </button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

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
    <div className="max-w-4xl">
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
          <div className="w-1.5 h-1.5 rounded-full bg-saffron-500 shadow-[0_0_10px_rgba(255,107,53,0.5)]" />
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
