"use client";
import { useState, useRef, useEffect, CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Home, CalendarDays, Search } from "lucide-react";

/* ── Portal ── */
function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

/* ── Panel positioning ── */
function getPanelStyle(btnEl: HTMLElement, panelW: number, panelH: number): CSSProperties {
  if (window.innerWidth < 640) {
    return { position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "70vh", zIndex: 99999, borderRadius: "20px 20px 0 0" };
  }
  const r = btnEl.getBoundingClientRect();
  let left = r.left;
  const top = r.bottom + 6;
  if (left + panelW > window.innerWidth - 8) left = window.innerWidth - panelW - 8;
  if (left < 8) left = 8;
  return { position: "fixed", top, left, width: panelW, maxHeight: panelH, zIndex: 99999 };
}

/* ── Bottom-sheet wrapper ── */
function SheetWrap({
  isSheet, panelRef, panelStyle, onBackdrop, children,
}: {
  isSheet: boolean;
  panelRef: React.RefObject<HTMLDivElement>;
  panelStyle: CSSProperties;
  onBackdrop: () => void;
  children: React.ReactNode;
}) {
  if (!isSheet) {
    return (
      <div ref={panelRef} style={panelStyle} className="bg-white border border-midnight-100 rounded-2xl shadow-xl overflow-hidden">
        {children}
      </div>
    );
  }
  return (
    <>
      <div className="fixed inset-0 bg-midnight-900/40 backdrop-blur-sm z-[99998]" onPointerDown={onBackdrop} />
      <div ref={panelRef} style={panelStyle} className="bg-white shadow-2xl overflow-hidden z-[99999]">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-midnight-200" />
        </div>
        {children}
      </div>
    </>
  );
}

/* ── Shared close-on-outside hook ── */
function useCloseOnOutside(
  isOpen: boolean,
  panelRef: React.RefObject<HTMLDivElement>,
  btnRef: React.RefObject<HTMLButtonElement>,
  close: () => void,
  isMobile: boolean,
) {
  useEffect(() => {
    if (!isOpen) return;
    function onPointer(e: PointerEvent) {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      close();
    }
    const timer = setTimeout(() => document.addEventListener("pointerdown", onPointer), 150);
    const onScroll = !isMobile ? () => close() : null;
    if (onScroll) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointer);
      if (onScroll) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
  }, [isOpen, isMobile, panelRef, btnRef, close]);
}

/* ────────────────────────────────────────────
   CityDropdown
──────────────────────────────────────────── */
export function CityDropdown({
  label, accent, value, onChange, cities,
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
  const [isMobile, setIsMobile] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const dot = accent === "saffron" ? "bg-saffron-500" : "bg-mint-500";
  const filtered = cities.filter((c) => c.toLowerCase().includes(search.toLowerCase())).slice(0, 10);

  function open() {
    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);
    if (btnRef.current) setPanelStyle(getPanelStyle(btnRef.current, Math.max(btnRef.current.getBoundingClientRect().width, 220), 320));
    setIsOpen(true);
    setSearch("");
  }
  function close() { setIsOpen(false); setSearch(""); }

  useCloseOnOutside(isOpen, panelRef, btnRef, close, isMobile);

  return (
    <div className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        onClick={() => (isOpen ? close() : open())}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-100 transition rounded-2xl text-left cursor-pointer border border-midnight-100"
      >
        <div className="min-w-0">
          <div className="label !mb-0 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {label}
          </div>
          <div className="text-sm font-bold text-midnight-900 truncate max-w-[160px]">
            {value || "Select city"}
          </div>
        </div>
        <ChevronDown size={14} className={`text-midnight-400 shrink-0 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <Portal>
          <SheetWrap isSheet={isMobile} panelRef={panelRef} panelStyle={panelStyle} onBackdrop={close}>
            <div className="px-4 py-3 border-b border-midnight-50 flex items-center gap-2">
              <Search size={14} className="text-midnight-400 shrink-0" />
              <input
                autoFocus
                className="w-full text-sm outline-none bg-transparent"
                placeholder="Search city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); if (e.key === "Escape") close(); }}
              />
            </div>
            <div className="max-h-[55vh] sm:max-h-[240px] overflow-y-auto py-2">
              {filtered.length > 0 ? filtered.map((c) => (
                <button
                  key={c}
                  type="button"
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => { onChange(c); close(); }}
                  className={`w-full text-left px-5 py-3 sm:py-2.5 text-sm hover:bg-cream-50 transition flex items-center justify-between ${
                    value === c ? "text-saffron-600 font-bold bg-saffron-50/50" : "text-midnight-600"
                  }`}
                >
                  {c}
                  {value === c && <div className="w-1.5 h-1.5 rounded-full bg-saffron-500" />}
                </button>
              )) : (
                <div className="px-5 py-4 text-xs text-midnight-400 italic">No cities found</div>
              )}
            </div>
          </SheetWrap>
        </Portal>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   SizeDropdown
──────────────────────────────────────────── */
const SIZES = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK+", "Office"];

export function SizeDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const [isMobile, setIsMobile] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function open() {
    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);
    if (btnRef.current) setPanelStyle(getPanelStyle(btnRef.current, Math.max(btnRef.current.getBoundingClientRect().width, 150), 280));
    setIsOpen(true);
  }
  function close() { setIsOpen(false); }

  useCloseOnOutside(isOpen, panelRef, btnRef, close, isMobile);

  return (
    <div className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        onClick={() => (isOpen ? close() : open())}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-100 transition rounded-2xl text-left border border-midnight-100"
      >
        <div className="min-w-0">
          <div className="label !mb-0 flex items-center gap-1.5">
            <Home size={11} className="text-saffron-500" />
            Size
          </div>
          <div className="text-sm font-bold text-midnight-900">{value}</div>
        </div>
        <ChevronDown size={14} className={`text-midnight-400 shrink-0 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <Portal>
          <SheetWrap isSheet={isMobile} panelRef={panelRef} panelStyle={panelStyle} onBackdrop={close}>
            <div className="py-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => { onChange(s); close(); }}
                  className={`w-full text-left px-5 py-3 sm:py-2.5 text-sm hover:bg-cream-50 transition ${
                    value === s ? "text-saffron-600 font-bold bg-saffron-50" : "text-midnight-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </SheetWrap>
        </Portal>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   DateSelector
──────────────────────────────────────────── */
const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export function DateSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  const [isOpen, setIsOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const [isMobile, setIsMobile] = useState(false);
  const [viewYear, setViewYear] = useState(() => selectedDate?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => selectedDate?.getMonth() ?? today.getMonth());
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function open() {
    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);
    if (btnRef.current) setPanelStyle(getPanelStyle(btnRef.current, 280, 380));
    setIsOpen(true);
  }
  function close() { setIsOpen(false); }

  useCloseOnOutside(isOpen, panelRef, btnRef, close, isMobile);

  const displayLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "Pick a date";

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function selectDay(day: number) {
    const clicked = new Date(viewYear, viewMonth, day);
    if (clicked < today) return;
    onChange(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    close();
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
        onClick={() => (isOpen ? close() : open())}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-100 transition rounded-2xl text-left border border-midnight-100"
      >
        <div className="min-w-0">
          <div className="label !mb-0 flex items-center gap-1.5">
            <CalendarDays size={11} className="text-saffron-500" />
            Move Date
          </div>
          <div className="text-sm font-bold text-midnight-900 whitespace-nowrap">{displayLabel}</div>
        </div>
        <ChevronDown size={14} className={`text-midnight-400 shrink-0 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <Portal>
          <SheetWrap isSheet={isMobile} panelRef={panelRef} panelStyle={panelStyle} onBackdrop={close}>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <button type="button" onPointerDown={(e) => e.preventDefault()} onClick={prevMonth}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-cream-100 transition text-midnight-500">
                  <ChevronDown size={14} className="rotate-90" />
                </button>
                <span className="text-sm font-bold text-midnight-900">{SHORT_MONTHS[viewMonth]} {viewYear}</span>
                <button type="button" onPointerDown={(e) => e.preventDefault()} onClick={nextMonth}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-cream-100 transition text-midnight-500">
                  <ChevronDown size={14} className="-rotate-90" />
                </button>
              </div>

              <div className="grid grid-cols-7 mb-1">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-center text-[10px] font-bold text-midnight-400 py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((day, i) => {
                  if (!day) return <div key={`e-${i}`} />;
                  const isPast = new Date(viewYear, viewMonth, day) < today;
                  const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === viewMonth && selectedDate?.getFullYear() === viewYear;
                  const isTodayCell = today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isPast}
                      onPointerDown={(e) => e.preventDefault()}
                      onClick={() => selectDay(day)}
                      className={[
                        "text-center text-xs py-1.5 rounded-lg transition font-medium",
                        isPast ? "text-midnight-200 cursor-not-allowed" : "cursor-pointer",
                        isSelected ? "bg-saffron-500 text-white"
                          : isTodayCell ? "bg-cream-200 text-midnight-900 font-bold"
                          : !isPast ? "text-midnight-700 hover:bg-cream-100" : "",
                      ].join(" ")}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-midnight-50">
                <button
                  type="button"
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`);
                    close();
                  }}
                  className="w-full text-center text-xs text-saffron-600 font-semibold hover:bg-saffron-50 rounded-lg py-1.5 transition"
                >
                  Today
                </button>
              </div>
            </div>
          </SheetWrap>
        </Portal>
      )}
    </div>
  );
}
