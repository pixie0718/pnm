"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, Send, Save, X, Plus, IndianRupee,
  CheckCircle, XCircle, FileText, Truck, BadgePercent,
} from "lucide-react";

// ── Preset options ────────────────────────────────────────────
const INCLUSION_OPTIONS = [
  "Packing materials & labour",
  "Loading & unloading",
  "Transportation",
  "Unpacking at destination",
  "Damage insurance",
  "Floor / staircase charges",
  "Furniture dismantling & reassembly",
  "Storage (if required)",
];

const EXCLUSION_OPTIONS = [
  "Bike / vehicle transport",
  "AC dismantling & installation",
  "Extra fragile / antique items",
  "Waiting / detention charges",
  "Re-delivery charges",
  "Toll & parking (extra)",
  "Long-carry charges",
];

const DEFAULT_TC = `1. 30% advance on booking confirmation; balance before unloading.
2. Goods insured during transit — claims within 24 hrs of delivery.
3. Cancellation 48 hrs prior: full refund. Less than 48 hrs: advance forfeited.
4. Company not liable for force majeure (floods, strikes, etc.).
5. Any additional services will be charged separately.`;

// ── Types ─────────────────────────────────────────────────────
const CANCELLATION_PRESETS = [
  { label: "More than 7 days",    refund: "Full refund" },
  { label: "3–7 days before",     refund: "50% refund" },
  { label: "24–72 hours before",  refund: "Advance forfeited" },
  { label: "Less than 24 hours",  refund: "No refund" },
  { label: "Day of move",         refund: "Full charge applicable" },
];

interface CancellationRow { label: string; refund: string; }

interface FormState {
  vendorName: string;
  vendorPhone: string;
  priceLow: string;
  priceHigh: string;
  advancePercent: string;
  gstIncluded: boolean;
  eta: string;
  loadingDate: string;
  inclusions: string[];
  customInclusion: string;
  exclusions: string[];
  customExclusion: string;
  cancellationPolicy: CancellationRow[];
  terms: string;
  notes: string;
}

// ── Component ─────────────────────────────────────────────────
export default function QuoteDrawer({ inquiryId }: { inquiryId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState<"basic" | "scope" | "terms">("basic");
  const [loading, setLoading] = useState<"draft" | "sent" | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    vendorName: "", vendorPhone: "",
    priceLow: "", priceHigh: "",
    advancePercent: "30",
    gstIncluded: true,
    eta: "3-5 days",
    loadingDate: "",
    inclusions: [
      "Packing materials & labour",
      "Loading & unloading",
      "Transportation",
      "Damage insurance",
    ],
    customInclusion: "",
    exclusions: ["Bike / vehicle transport", "AC dismantling & installation"],
    customExclusion: "",
    cancellationPolicy: CANCELLATION_PRESETS,
    terms: DEFAULT_TC,
    notes: "",
  });

  function toggle(field: "inclusions" | "exclusions", value: string) {
    setForm((f) => {
      const list = f[field];
      return {
        ...f,
        [field]: list.includes(value) ? list.filter((x) => x !== value) : [...list, value],
      };
    });
  }

  function addCustom(field: "inclusions" | "exclusions", key: "customInclusion" | "customExclusion") {
    const val = form[key].trim();
    if (!val) return;
    setForm((f) => ({ ...f, [field]: [...f[field], val], [key]: "" }));
  }

  function close() {
    if (loading) return;
    setOpen(false);
    setError(null);
    setTab("basic");
  }

  async function submit(e: FormEvent, send: boolean) {
    e.preventDefault();
    if (!form.vendorName || !form.priceLow || !form.priceHigh) {
      setError("Vendor name and prices are required.");
      setTab("basic");
      return;
    }
    setError(null);
    setLoading(send ? "sent" : "draft");

    const features = {
      vendorPhone:    form.vendorPhone || null,
      advancePercent: Number(form.advancePercent),
      gstIncluded:    form.gstIncluded,
      loadingDate:    form.loadingDate || null,
      inclusions:          form.inclusions,
      exclusions:          form.exclusions,
      cancellationPolicy:  form.cancellationPolicy,
      terms:               form.terms,
    };

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId,
          vendorName: form.vendorName,
          priceLow:   Number(form.priceLow),
          priceHigh:  Number(form.priceHigh),
          eta:        form.eta,
          notes:      form.notes,
          features,
          send,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      close();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setLoading(null);
    }
  }

  const tabs = [
    { key: "basic",  label: "Pricing & ETA",   icon: <IndianRupee size={13}/> },
    { key: "scope",  label: "Scope",            icon: <CheckCircle size={13}/> },
    { key: "terms",  label: "Terms",            icon: <FileText size={13}/> },
  ] as const;

  return (
    <>
      {/* TRIGGER */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-midnight-900 text-white font-semibold text-sm hover:bg-midnight-700 transition"
      >
        <Plus size={16}/> Add Quote
      </button>

      {/* BACKDROP */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={close} />
      )}

      {/* DRAWER */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}>

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-400 mb-0.5">Inquiry #{inquiryId}</div>
            <h2 className="text-lg font-extrabold text-ink-900">New Quotation</h2>
          </div>
          <button onClick={close} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 grid place-items-center transition">
            <X size={16}/>
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-slate-100 px-4 shrink-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                tab === t.key
                  ? "border-midnight-900 text-midnight-900"
                  : "border-transparent text-ink-400 hover:text-ink-700"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ── TAB 1: PRICING & ETA ── */}
          {tab === "basic" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Vendor / Company Name <span className="text-red-400">*</span></label>
                  <input className="input" placeholder="e.g. SafeMove Logistics" value={form.vendorName}
                    onChange={(e) => setForm({ ...form, vendorName: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="label">Vendor Contact Number</label>
                  <input className="input" placeholder="+91 98765 43210" value={form.vendorPhone}
                    onChange={(e) => setForm({ ...form, vendorPhone: e.target.value })} />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-3 flex items-center gap-1.5">
                  <IndianRupee size={12}/> Pricing
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Price Low (₹) <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"><IndianRupee size={13}/></span>
                      <input className="input !pl-8" type="number" placeholder="15000" value={form.priceLow}
                        onChange={(e) => setForm({ ...form, priceLow: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Price High (₹) <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"><IndianRupee size={13}/></span>
                      <input className="input !pl-8" type="number" placeholder="20000" value={form.priceHigh}
                        onChange={(e) => setForm({ ...form, priceHigh: e.target.value })} />
                    </div>
                  </div>
                </div>

                {form.priceLow && form.priceHigh && (
                  <div className="mt-3 bg-midnight-900 text-white rounded-xl px-4 py-3 flex items-center justify-between text-sm">
                    <span className="text-midnight-300">Quote Range</span>
                    <span className="font-bold">
                      ₹{Number(form.priceLow).toLocaleString("en-IN")} – ₹{Number(form.priceHigh).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="label flex items-center gap-1"><BadgePercent size={12}/> Advance Required</label>
                    <div className="relative">
                      <input className="input !pr-8" type="number" min="0" max="100" value={form.advancePercent}
                        onChange={(e) => setForm({ ...form, advancePercent: e.target.value })} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm">%</span>
                    </div>
                    {form.priceLow && form.advancePercent && (
                      <p className="text-xs text-ink-400 mt-1">
                        ≈ ₹{Math.round(Number(form.priceLow) * Number(form.advancePercent) / 100).toLocaleString("en-IN")} advance
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col justify-between">
                    <label className="label">GST</label>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, gstIncluded: !f.gstIncluded }))}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                        form.gstIncluded
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                          : "bg-slate-50 border-slate-200 text-ink-500"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 grid place-items-center ${form.gstIncluded ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}>
                        {form.gstIncluded && <span className="w-2 h-2 rounded-full bg-white block"/>}
                      </span>
                      {form.gstIncluded ? "Included" : "Excluded"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-3 flex items-center gap-1.5">
                  <Truck size={12}/> Schedule
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Transit / ETA</label>
                    <input className="input" placeholder="e.g. 3-5 days" value={form.eta}
                      onChange={(e) => setForm({ ...form, eta: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Expected Loading Date</label>
                    <input className="input" type="date" value={form.loadingDate}
                      onChange={(e) => setForm({ ...form, loadingDate: e.target.value })} />
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Internal Notes (optional)</label>
                <textarea className="input !h-20 resize-none" placeholder="Anything extra to note..."
                  value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
          )}

          {/* ── TAB 2: SCOPE ── */}
          {tab === "scope" && (
            <div className="space-y-6">
              {/* INCLUSIONS */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-emerald-600 mb-3 flex items-center gap-1.5">
                  <CheckCircle size={12}/> Inclusions
                </div>
                <div className="space-y-2">
                  {INCLUSION_OPTIONS.map((opt) => (
                    <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      form.inclusions.includes(opt)
                        ? "bg-emerald-50 border-emerald-300"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}>
                      <span className={`w-5 h-5 rounded-md border-2 grid place-items-center shrink-0 transition ${
                        form.inclusions.includes(opt) ? "bg-emerald-500 border-emerald-500" : "border-slate-300"
                      }`}>
                        {form.inclusions.includes(opt) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      <input type="checkbox" className="sr-only" checked={form.inclusions.includes(opt)}
                        onChange={() => toggle("inclusions", opt)} />
                      <span className="text-sm text-ink-700 font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input className="input flex-1 !py-2 text-sm" placeholder="Add custom inclusion..."
                    value={form.customInclusion}
                    onChange={(e) => setForm({ ...form, customInclusion: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom("inclusions", "customInclusion"))} />
                  <button type="button" onClick={() => addCustom("inclusions", "customInclusion")}
                    className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition">
                    <Plus size={14}/>
                  </button>
                </div>
              </div>

              {/* EXCLUSIONS */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-red-500 mb-3 flex items-center gap-1.5">
                  <XCircle size={12}/> Exclusions
                </div>
                <div className="space-y-2">
                  {EXCLUSION_OPTIONS.map((opt) => (
                    <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      form.exclusions.includes(opt)
                        ? "bg-red-50 border-red-300"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}>
                      <span className={`w-5 h-5 rounded-md border-2 grid place-items-center shrink-0 transition ${
                        form.exclusions.includes(opt) ? "bg-red-500 border-red-500" : "border-slate-300"
                      }`}>
                        {form.exclusions.includes(opt) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      <input type="checkbox" className="sr-only" checked={form.exclusions.includes(opt)}
                        onChange={() => toggle("exclusions", opt)} />
                      <span className="text-sm text-ink-700 font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input className="input flex-1 !py-2 text-sm" placeholder="Add custom exclusion..."
                    value={form.customExclusion}
                    onChange={(e) => setForm({ ...form, customExclusion: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom("exclusions", "customExclusion"))} />
                  <button type="button" onClick={() => addCustom("exclusions", "customExclusion")}
                    className="px-3 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">
                    <Plus size={14}/>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: TERMS ── */}
          {tab === "terms" && (
            <div className="space-y-6">

              {/* CANCELLATION POLICY */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-3 flex items-center gap-1.5">
                  <XCircle size={12}/> Cancellation Policy
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-ink-400">
                    <span>Timeframe</span>
                    <span>Refund</span>
                  </div>
                  {form.cancellationPolicy.map((row, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2 px-3 py-2 border-b border-slate-100 last:border-0 items-center">
                      <input
                        className="input !py-1.5 text-xs"
                        value={row.label}
                        onChange={(e) => {
                          const updated = [...form.cancellationPolicy];
                          updated[i] = { ...updated[i], label: e.target.value };
                          setForm({ ...form, cancellationPolicy: updated });
                        }}
                      />
                      <div className="flex items-center gap-1.5">
                        <input
                          className="input !py-1.5 text-xs flex-1"
                          value={row.refund}
                          onChange={(e) => {
                            const updated = [...form.cancellationPolicy];
                            updated[i] = { ...updated[i], refund: e.target.value };
                            setForm({ ...form, cancellationPolicy: updated });
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, cancellationPolicy: form.cancellationPolicy.filter((_, j) => j !== i) })}
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 grid place-items-center shrink-0 transition"
                        >
                          <X size={12}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, cancellationPolicy: [...form.cancellationPolicy, { label: "", refund: "" }] })}
                  className="mt-2 flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-900 font-semibold transition"
                >
                  <Plus size={12}/> Add row
                </button>
              </div>

              {/* T&C */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-2 flex items-center gap-1.5">
                  <FileText size={12}/> Terms & Conditions
                </div>
                <textarea
                  className="input !h-52 resize-none font-mono text-xs leading-relaxed"
                  value={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.value })}
                  placeholder="Enter terms and conditions..."
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, terms: DEFAULT_TC })}
                  className="mt-1 text-xs text-ink-400 hover:text-ink-700 underline"
                >
                  Reset to default
                </button>
              </div>

            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              ⚠ {error}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0">
          {/* TAB NAV HINT */}
          <div className="flex gap-1 mb-3">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 h-1 rounded-full transition ${tab === t.key ? "bg-midnight-900" : "bg-slate-200"}`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={(e) => submit(e, false)} disabled={loading !== null}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-ink-700 font-semibold text-sm hover:bg-slate-50 transition disabled:opacity-50">
              {loading === "draft" ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>}
              Save Draft
            </button>
            <button onClick={(e) => submit(e, true)} disabled={loading !== null}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-midnight-900 text-white font-semibold text-sm hover:bg-midnight-700 transition disabled:opacity-50">
              {loading === "sent" ? <Loader2 size={14} className="animate-spin"/> : <Send size={14}/>}
              Send to Customer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
