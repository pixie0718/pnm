"use client";
import { useState } from "react";
import {
  X, Eye, CheckCircle, XCircle, Truck, Phone, IndianRupee,
  BadgePercent, FileText, AlertCircle, ShieldCheck,
} from "lucide-react";

interface Quote {
  id: number;
  vendorName: string;
  priceLow: number;
  priceHigh: number;
  eta: string | null;
  notes: string | null;
  status: string;
  sentAt: Date | string | null;
  features: Record<string, any> | null;
}

function refundColor(refund: string) {
  const r = refund.toLowerCase();
  if (r.includes("full refund")) return "bg-emerald-100 text-emerald-700";
  if (r.includes("no refund") || r.includes("full charge") || r.includes("forfeited")) return "bg-red-100 text-red-600";
  return "bg-amber-100 text-amber-700";
}

const STATUS_STYLE: Record<string, string> = {
  sent:     "bg-blue-50 text-blue-700 border-blue-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
  draft:    "bg-slate-100 text-slate-600 border-slate-200",
};

export default function QuoteViewDrawer({ quote }: { quote: Quote }) {
  const [open, setOpen] = useState(false);

  const f = (quote.features ?? {}) as Record<string, any>;
  const inclusions: string[]  = Array.isArray(f.inclusions) ? f.inclusions : [];
  const exclusions: string[]  = Array.isArray(f.exclusions) ? f.exclusions : [];
  const cancellation: { label: string; refund: string }[] = Array.isArray(f.cancellationPolicy) ? f.cancellationPolicy : [];
  const terms: string         = typeof f.terms === "string" ? f.terms : "";
  const advancePct: number | null = typeof f.advancePercent === "number" ? f.advancePercent : null;
  const gstIncluded: boolean  = f.gstIncluded !== false;
  const vendorPhone: string | null = f.vendorPhone || null;
  const loadingDate: string | null = f.loadingDate || null;
  const advanceAmt = advancePct !== null ? Math.round(quote.priceLow * advancePct / 100) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-ink-600 text-xs font-semibold hover:bg-slate-50 transition"
      >
        <Eye size={13}/> View Quote
      </button>

      {/* BACKDROP */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* DRAWER */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}>

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-400 mb-0.5">Quote #{quote.id}</div>
            <h2 className="text-lg font-extrabold text-ink-900">{quote.vendorName}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${STATUS_STYLE[quote.status] ?? STATUS_STYLE.draft}`}>
              {quote.status}
            </span>
            <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 grid place-items-center transition">
              <X size={16}/>
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto">

          {/* PRICE BLOCK */}
          <div className="bg-midnight-900 text-white px-6 py-5">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <div className="text-midnight-400 text-xs mb-1">Quote Range</div>
                <div className="text-3xl font-extrabold">₹{quote.priceLow.toLocaleString("en-IN")}</div>
                {quote.priceLow !== quote.priceHigh && (
                  <div className="text-midnight-300 text-sm mt-0.5">up to ₹{quote.priceHigh.toLocaleString("en-IN")}</div>
                )}
              </div>
              <div className="flex flex-col gap-1.5 text-sm text-right">
                {advanceAmt !== null && (
                  <div>
                    <div className="text-midnight-400 text-xs">Advance ({advancePct}%)</div>
                    <div className="font-bold text-saffron-400">₹{advanceAmt.toLocaleString("en-IN")}</div>
                  </div>
                )}
                <div>
                  <div className="text-midnight-400 text-xs">GST</div>
                  <div className={`font-bold ${gstIncluded ? "text-emerald-400" : "text-red-400"}`}>
                    {gstIncluded ? "Included" : "Excluded"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VENDOR DETAILS */}
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-3">Vendor Details</div>
            <div className="space-y-2 text-sm">
              {vendorPhone && (
                <div className="flex items-center justify-between">
                  <span className="text-ink-400 flex items-center gap-1.5"><Phone size={13}/> Contact</span>
                  <a href={`tel:${vendorPhone}`} className="font-semibold text-ink-900 hover:text-saffron-600 transition">{vendorPhone}</a>
                </div>
              )}
              {quote.eta && (
                <div className="flex items-center justify-between">
                  <span className="text-ink-400 flex items-center gap-1.5"><Truck size={13}/> Transit</span>
                  <span className="font-semibold text-ink-900">{quote.eta}</span>
                </div>
              )}
              {loadingDate && (
                <div className="flex items-center justify-between">
                  <span className="text-ink-400">Loading Date</span>
                  <span className="font-semibold text-ink-900">{new Date(loadingDate).toLocaleDateString("en-IN")}</span>
                </div>
              )}
              {quote.sentAt && (
                <div className="flex items-center justify-between">
                  <span className="text-ink-400">Sent On</span>
                  <span className="font-semibold text-ink-900">{new Date(quote.sentAt).toLocaleDateString("en-IN")}</span>
                </div>
              )}
            </div>
            {quote.notes && (
              <div className="mt-3 bg-cream-50 border border-cream-200 rounded-xl px-4 py-3 text-sm text-ink-600 italic">
                "{quote.notes}"
              </div>
            )}
          </div>

          {/* INCLUSIONS */}
          {inclusions.length > 0 && (
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wide text-emerald-600 mb-3 flex items-center gap-1.5">
                <CheckCircle size={12}/> Inclusions
              </div>
              <div className="space-y-2">
                {inclusions.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-ink-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 grid place-items-center shrink-0">
                      <CheckCircle size={10} className="text-emerald-600"/>
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXCLUSIONS */}
          {exclusions.length > 0 && (
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wide text-red-500 mb-3 flex items-center gap-1.5">
                <XCircle size={12}/> Exclusions
              </div>
              <div className="space-y-2">
                {exclusions.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-ink-500">
                    <span className="w-5 h-5 rounded-full bg-red-100 border border-red-200 grid place-items-center shrink-0">
                      <XCircle size={10} className="text-red-500"/>
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CANCELLATION POLICY */}
          {cancellation.filter(r => r.label).length > 0 && (
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-3 flex items-center gap-1.5">
                <AlertCircle size={12}/> Cancellation Policy
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-ink-400">
                  <span>Timeframe</span><span>Refund</span>
                </div>
                {cancellation.filter(r => r.label).map((row, i) => (
                  <div key={i} className="grid grid-cols-2 px-4 py-3 border-b border-slate-100 last:border-0 items-center gap-3">
                    <span className="text-sm text-ink-700 font-medium">{row.label}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit ${refundColor(row.refund)}`}>{row.refund}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TERMS */}
          {terms && (
            <div className="px-6 py-5">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-3 flex items-center gap-1.5">
                <FileText size={12}/> Terms & Conditions
              </div>
              <div className="space-y-2">
                {terms.split("\n").filter(Boolean).map((line, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-ink-500 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-slate-100 grid place-items-center shrink-0 font-bold text-[10px] mt-0.5">{i + 1}</span>
                    {line.replace(/^\d+\.\s*/, "")}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
