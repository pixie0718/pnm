"use client";
import { useState } from "react";
import { Home, ArrowRightLeft, Car, Bike, ChevronDown } from "lucide-react";

/* ── Data ─────────────────────────────────────────────────────────────────── */

const localShifting = {
  cols: ["Move Size", "Labor Charge", "Packing Cost", "Transport Cost", "Total Cost"],
  preview: "Total", // which col label to show as preview when collapsed
  rows: [
    ["1 RK",  "₹600–700",    "₹1,160–2,920", "₹1,740–4,380",  "₹3,500–8,000"],
    ["1 BHK", "₹1,200–1,400","₹1,320–4,240", "₹1,980–6,360",  "₹4,500–12,000"],
    ["2 BHK", "₹2,400–2,800","₹1,840–5,680", "₹2,760–8,520",  "₹7,000–17,000"],
    ["3 BHK", "₹3,000–3,500","₹3,000–7,000", "₹4,500–10,500", "₹10,500–21,000"],
    ["4 BHK", "₹3,600–4,200","₹3,560–8,720", "₹5,340–13,080", "₹12,500–26,000"],
  ],
};

const intercityShifting = {
  cols: ["Move Type", "100–350 km", "350–750 km", "750–1200 km", "1200–1700 km", "1700–2300 km", "2300–3000 km"],
  preview: "100–350 km",
  rows: [
    ["1 BHK",          "₹12,000–22,000", "₹14,500–23,500", "₹16,000–26,000", "₹19,500–28,000", "₹22,000–31,000", "₹24,500–37,500"],
    ["2 BHK",          "₹16,000–26,000", "₹18,500–29,500", "₹21,000–32,000", "₹24,000–37,000", "₹28,000–41,000", "₹30,000–47,000"],
    ["3 BHK",          "₹19,000–30,000", "₹22,000–35,000", "₹24,500–39,000", "₹28,500–43,000", "₹33,000–49,000", "₹36,000–56,500"],
    ["4+ BHK / Villa", "₹23,500–35,500", "₹27,000–40,000", "₹30,000–46,000", "₹35,000–48,500", "₹39,000–56,000", "₹42,000–61,000"],
  ],
};

const carTransport = {
  cols: ["Car Type", "100–350 km", "350–750 km", "750–1200 km", "1200–1700 km", "1700–2300 km", "2300–3000 km"],
  preview: "100–350 km",
  rows: [
    ["Hatchback",  "₹5,500–11,000",  "₹7,500–14,000",  "₹9,000–17,000",  "₹11,000–13,000", "₹13,000–23,000", "₹15,000–26,000"],
    ["Sedan",      "₹7,000–10,000",  "₹10,000–15,000", "₹13,000–18,000", "₹15,000–20,000", "₹18,000–24,000", "₹21,000–27,000"],
    ["SUV",        "₹13,000–15,000", "₹15,000–19,000", "₹18,000–22,000", "₹21,000–24,000", "₹23,000–27,000", "₹25,000–30,000"],
    ["Luxury Car", "₹17,000–21,000", "₹20,000–25,000", "₹23,000–27,000", "₹26,000–31,000", "₹29,000–35,000", "₹31,000–40,000"],
    ["Sports Car", "₹20,000–24,000", "₹24,000–28,000", "₹27,000–31,000", "₹30,000–35,000", "₹33,000–40,000", "₹35,000–45,000"],
  ],
};

const bikeTransport = {
  cols: ["Engine / Type", "Up to 400 km", "400–800 km", "800–1300 km", "1300–1900 km"],
  preview: "Up to 400 km",
  rows: [
    ["100cc – 150cc",       "₹2,000–3,500", "₹3,000–4,000", "₹3,500–4,500",  "₹4,000–5,000"],
    ["150cc – 200cc",       "₹2,400–3,600", "₹3,400–4,100", "₹3,900–4,600",  "₹4,400–4,900"],
    ["200cc – 250cc",       "₹2,700–3,900", "₹3,700–4,400", "₹4,200–4,900",  "₹4,700–5,000"],
    ["250cc – 350cc",       "₹2,800–3,800", "₹3,800–4,300", "₹4,300–4,800",  "₹4,800–5,000"],
    ["350cc – 500cc",       "₹2,800–3,800", "₹3,800–4,300", "₹4,300–4,800",  "₹4,800–5,000"],
    ["Sports Bike",         "₹4,500–7,000", "₹6,000–9,000", "₹8,000–12,000", "₹11,000–15,000"],
    ["Cruiser Sports Bike", "₹5,000–8,500", "₹7,000–10,500","₹9,000–13,500", "₹12,000–16,500"],
    ["Off-Road Bike",       "₹6,000–9,000", "₹7,500–11,500","₹10,000–14,500","₹13,000–17,500"],
  ],
};

/* ── Mobile expandable cards ──────────────────────────────────────────────── */

function MobileCards({
  cols,
  rows,
  preview,
}: {
  cols: string[];
  rows: string[][];
  preview: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  // which column index to show as the preview badge
  const previewColIdx = cols.indexOf(preview);

  return (
    <div className="space-y-2">
      {rows.map((row, ri) => {
        const isOpen = openIdx === ri;
        const previewVal = previewColIdx > 0 ? row[previewColIdx] : row[row.length - 1];

        return (
          <div
            key={ri}
            className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
              isOpen
                ? "border-saffron-300 shadow-md"
                : "border-midnight-100 bg-white"
            }`}
          >
            {/* Header row — always visible */}
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : ri)}
              className={`w-full flex items-center justify-between px-4 py-4 text-left transition-colors ${
                isOpen ? "bg-saffron-50" : "bg-white hover:bg-midnight-50/40"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Saffron dot */}
                <span
                  className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                    isOpen ? "bg-saffron-500" : "bg-midnight-200"
                  }`}
                />
                <span className="display font-bold text-midnight-900 text-sm leading-tight">
                  {row[0]}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                {/* Preview badge — hidden when open */}
                {!isOpen && (
                  <span className="text-xs font-semibold text-saffron-600 bg-saffron-50 border border-saffron-100 px-2 py-0.5 rounded-full">
                    {previewVal}
                  </span>
                )}
                <ChevronDown
                  size={16}
                  className={`text-midnight-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-saffron-500" : ""
                  }`}
                />
              </div>
            </button>

            {/* Expandable detail — animated with max-height */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-saffron-100">
                {cols.slice(1).map((col, ci) => (
                  <div
                    key={col}
                    className={`flex items-center justify-between px-4 py-3 ${
                      ci % 2 === 0 ? "bg-white" : "bg-midnight-50/30"
                    }`}
                  >
                    <span className="text-[11px] font-bold text-midnight-400 uppercase tracking-wider">
                      {col}
                    </span>
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        col === preview
                          ? "text-saffron-600"
                          : "text-midnight-800"
                      }`}
                    >
                      {row[ci + 1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Desktop table ────────────────────────────────────────────────────────── */

function DesktopTable({ cols, rows }: { cols: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-midnight-900 text-white">
            {cols.map((col, i) => (
              <th
                key={col}
                className={`px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-wider whitespace-nowrap
                  ${i === 0 ? "pl-5 rounded-tl-xl" : ""}
                  ${i === cols.length - 1 ? "pr-5 rounded-tr-xl" : ""}`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={`border-b border-midnight-100 transition-colors hover:bg-saffron-50/40 ${
                ri % 2 === 0 ? "bg-white" : "bg-midnight-50/30"
              }`}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3
                    ${ci === 0 ? "pl-5 font-bold text-midnight-900 whitespace-nowrap" : "text-midnight-700 tabular-nums whitespace-nowrap"}
                    ${ri === rows.length - 1 && ci === 0 ? "rounded-bl-xl" : ""}
                    ${ri === rows.length - 1 && ci === row.length - 1 ? "rounded-br-xl" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PriceTable({
  cols,
  rows,
  preview,
}: {
  cols: string[];
  rows: string[][];
  preview: string;
}) {
  return (
    <>
      <div className="sm:hidden">
        <MobileCards cols={cols} rows={rows} preview={preview} />
      </div>
      <div className="hidden sm:block">
        <DesktopTable cols={cols} rows={rows} />
      </div>
    </>
  );
}

/* ── Tabs config ──────────────────────────────────────────────────────────── */

const TABS = [
  {
    id: "local",
    label: "Local Shifting",
    Icon: Home,
    note: "All-inclusive estimates for shifting within the same city.",
    table: localShifting,
  },
  {
    id: "intercity",
    label: "Intercity Shifting",
    Icon: ArrowRightLeft,
    note: "City-to-city home relocation estimates by distance band.",
    table: intercityShifting,
  },
  {
    id: "car",
    label: "Car Transport",
    Icon: Car,
    note: "Vehicle transportation charges by car segment and distance.",
    table: carTransport,
  },
  {
    id: "bike",
    label: "Bike Transport",
    Icon: Bike,
    note: "Two-wheeler transportation charges by engine displacement.",
    table: bikeTransport,
  },
] as const;

/* ── Export ───────────────────────────────────────────────────────────────── */

export default function PricingTables({ cityName }: { cityName: string }) {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("local");
  const tab = TABS.find((t) => t.id === active)!;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Header */}
      <div className="eyebrow mb-4">
        <span className="w-8 h-px bg-saffron-500" />
        Pricing in {cityName}
      </div>
      <h2 className="display text-3xl md:text-5xl font-bold text-midnight-900 leading-[0.95] mb-3">
        Transparent cost estimates
      </h2>
      <p className="text-midnight-500 mb-6 text-base sm:text-lg max-w-2xl">
        No hidden charges — these are industry-standard ranges to help you
        budget before comparing quotes.
      </p>

      {/* Tab bar — 2×2 grid on mobile, single row on sm+ */}
      <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 mb-5">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 rounded-2xl sm:rounded-full text-xs sm:text-sm font-semibold transition-all ${
              active === id
                ? "bg-midnight-900 text-white shadow-md"
                : "bg-white text-midnight-600 border border-midnight-100 hover:border-midnight-300 hover:text-midnight-900"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="card p-0 overflow-hidden">
        {/* Card header */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-midnight-100 flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-saffron-50 flex items-center justify-center shrink-0">
            <tab.Icon size={16} className="text-saffron-500" />
          </div>
          <div>
            <div className="display font-bold text-midnight-900 text-sm sm:text-base leading-tight">
              {tab.label} Price Chart
            </div>
            <div className="text-[11px] sm:text-xs text-midnight-400 mt-0.5">
              {tab.note}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-3 sm:p-5">
          <PriceTable
            cols={tab.table.cols}
            rows={tab.table.rows}
            preview={tab.table.preview}
          />
        </div>

        {/* Disclaimer */}
        <div className="px-4 sm:px-5 py-3 bg-midnight-50/40 border-t border-midnight-100">
          <p className="text-[10px] sm:text-[11px] text-midnight-400 leading-relaxed">
            * Prices are indicative estimates only. Actual quotes depend on floor
            access, packing material, distance, and seasonal demand. Get verified
            quotes from our{" "}
            {tab.id === "local" || tab.id === "intercity" ? "movers" : "specialists"}{" "}
            in {cityName}.
          </p>
        </div>
      </div>
    </section>
  );
}
