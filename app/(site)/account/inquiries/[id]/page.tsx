import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Home, Calendar, Phone, Package, ShieldCheck,
  Building2, Layers, Clock, Truck, CheckCircle, XCircle,
  IndianRupee, Star, BadgePercent, FileText, AlertCircle,
  Sparkles, MapPin, ArrowRight,
} from "lucide-react";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";
import AcceptQuoteButton from "@/components/customer/AcceptQuoteButton";

export const dynamic = "force-dynamic";

interface ParsedNotes {
  pickupFloor?: string; pickupLift?: boolean;
  dropFloor?: string;   dropLift?: boolean;
  inventory: { item: string; qty: number }[];
  addons: string[];
}
function parseNotes(raw: string | null): ParsedNotes {
  if (!raw) return { inventory: [], addons: [] };
  const inventoryMatch = raw.match(/Inventory:\s*(.+?)(?:\s+Add-ons:|$)/i);
  const addonsMatch    = raw.match(/Add-ons:\s*(.+?)$/i);
  const pickupMatch    = raw.match(/Pickup:\s*.+?\(Floor\s*(\d+),\s*Lift\s*(Yes|No)\)/i);
  const dropMatch      = raw.match(/Drop:\s*.+?\(Floor\s*(\d+),\s*Lift\s*(Yes|No)\)/i);
  const inventory: { item: string; qty: number }[] = [];
  if (inventoryMatch) {
    inventoryMatch[1].split(",").forEach((chunk) => {
      const m = chunk.trim().match(/^(.+?)\s*\((\d+)\)$/);
      if (m) inventory.push({ item: m[1].trim(), qty: Number(m[2]) });
    });
  }
  return {
    pickupFloor: pickupMatch?.[1], pickupLift: pickupMatch?.[2]?.toLowerCase() === "yes",
    dropFloor: dropMatch?.[1],     dropLift: dropMatch?.[2]?.toLowerCase() === "yes",
    inventory,
    addons: addonsMatch ? addonsMatch[1].split(",").map((a) => a.trim()).filter(Boolean) : [],
  };
}

const ITEM_ICONS: Record<string, string> = {
  "double bed": "🛏", "single bed": "🛏", "sofa": "🛋", "refrigerator": "🧊",
  "washing machine": "🫧", "tv": "📺", "television": "📺", "wardrobe": "🚪",
  "boxes": "📦", "box": "📦", "dining table": "🪑", "table": "🪑", "ac": "❄️", "geyser": "🚿",
};
function getIcon(item: string) {
  const key = item.toLowerCase();
  for (const [k, v] of Object.entries(ITEM_ICONS)) { if (key.includes(k)) return v; }
  return "📦";
}
function refundColor(refund: string) {
  const r = refund.toLowerCase();
  if (r.includes("full refund")) return "bg-emerald-100 text-emerald-700";
  if (r.includes("no refund") || r.includes("full charge") || r.includes("forfeited")) return "bg-red-100 text-red-600";
  return "bg-amber-100 text-amber-700";
}

export default async function CustomerInquiryDetailPage({ params }: { params: { id: string } }) {
  const session = await getCurrentCustomer();
  if (!session) redirect("/login?from=/account");

  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { quotes: { orderBy: { createdAt: "desc" } } },
  });
  if (!inquiry || inquiry.customerId !== session.customerId) notFound();

  const notes      = parseNotes(inquiry.notes);
  const sentQuotes = inquiry.quotes.filter((q) => q.status !== "draft");
  const totalItems = notes.inventory.reduce((s, i) => s + i.qty, 0);
  const movingDateStr = inquiry.movingDate
    ? new Date(inquiry.movingDate).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="min-h-[80vh] bg-cream-50">

      {/* ── TOP HERO BANNER ── */}
      <div className="bg-midnight-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/account" className="inline-flex items-center gap-2 text-sm text-midnight-300 hover:text-white mb-6 transition">
            <ArrowLeft size={14}/> My Account
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="font-mono text-xs text-midnight-400 bg-midnight-800 px-2.5 py-1 rounded-lg">
                  #INQ-{inquiry.id.toString().padStart(4, "0")}
                </span>
                <StatusBadge status={inquiry.status}/>
                {sentQuotes.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 px-2.5 py-1 rounded-full">
                    <Sparkles size={10}/> {sentQuotes.length} quote{sentQuotes.length > 1 ? "s" : ""} received
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-saffron-400"/>
                  <span className="text-3xl md:text-4xl font-extrabold">{inquiry.pickupCity}</span>
                </div>
                <ArrowRight size={20} className="text-midnight-400"/>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-mint-400"/>
                  <span className="text-3xl md:text-4xl font-extrabold">{inquiry.dropCity}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 text-sm text-midnight-300 flex-wrap">
                <span className="flex items-center gap-1.5"><Home size={13}/> {inquiry.houseSize}</span>
                {movingDateStr && <span className="flex items-center gap-1.5"><Calendar size={13}/> {movingDateStr}</span>}
                <span className="flex items-center gap-1.5 text-midnight-500"><Clock size={13}/> Submitted {new Date(inquiry.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="flex gap-3 flex-wrap">
              {[
                { label: "Quotes", value: sentQuotes.length },
                { label: "Items", value: totalItems || "—" },
                { label: "Add-ons", value: notes.addons.length || "—" },
              ].map((s) => (
                <div key={s.label} className="bg-midnight-800 rounded-2xl px-5 py-3 text-center min-w-[80px]">
                  <div className="text-xl font-extrabold text-white">{s.value}</div>
                  <div className="text-xs text-midnight-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* ── LEFT: QUOTES ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* QUOTES HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-midnight-900">
                  {sentQuotes.length > 0 ? "Your Quotes" : "Awaiting Quotes"}
                </h2>
                <p className="text-sm text-midnight-500 mt-0.5">
                  {sentQuotes.length > 0
                    ? `${sentQuotes.length} offer${sentQuotes.length > 1 ? "s" : ""} from verified partners`
                    : "Our team is reviewing your request"}
                </p>
              </div>
            </div>

            {/* NO QUOTES */}
            {sentQuotes.length === 0 && (
              <div className="card p-12 text-center border-2 border-dashed border-midnight-100">
                <div className="w-16 h-16 rounded-2xl bg-cream-100 grid place-items-center mx-auto mb-4">
                  <IndianRupee size={28} className="text-midnight-300"/>
                </div>
                <h3 className="font-bold text-midnight-900 text-lg">No quotes yet</h3>
                <p className="text-sm text-midnight-500 mt-2 max-w-xs mx-auto leading-relaxed">
                  Our team is reviewing your request. You'll receive quotes from verified partners shortly.
                </p>
              </div>
            )}

            {/* QUOTE CARDS */}
            {sentQuotes.map((q, idx) => {
              const f = (q.features ?? {}) as Record<string, any>;
              const inclusions: string[] = Array.isArray(f.inclusions) ? f.inclusions : [];
              const exclusions: string[] = Array.isArray(f.exclusions) ? f.exclusions : [];
              const cancellation: { label: string; refund: string }[] = Array.isArray(f.cancellationPolicy) ? f.cancellationPolicy : [];
              const terms: string = typeof f.terms === "string" ? f.terms : "";
              const advancePct: number | null = typeof f.advancePercent === "number" ? f.advancePercent : null;
              const gstIncluded: boolean = f.gstIncluded !== false;
              const vendorPhone: string | null = f.vendorPhone || null;
              const advanceAmt = advancePct !== null ? Math.round(q.priceLow * advancePct / 100) : null;

              return (
                <div key={q.id} className={`rounded-2xl overflow-hidden border-2 bg-white shadow-sm ${idx === 0 ? "border-saffron-400" : "border-slate-200"}`}>

                  {/* RIBBON */}
                  {idx === 0 && (
                    <div className="bg-gradient-to-r from-saffron-500 to-saffron-400 px-5 py-2 flex items-center gap-2">
                      <Star size={13} fill="white" className="text-white"/>
                      <span className="text-white text-xs font-extrabold uppercase tracking-widest">Recommended</span>
                    </div>
                  )}

                  {/* QUOTE TOP — vendor + price side by side */}
                  <div className="p-6 flex items-start gap-5 flex-wrap">
                    {/* AVATAR */}
                    <div className={`w-14 h-14 rounded-2xl text-white grid place-items-center text-2xl font-extrabold shrink-0 ${idx === 0 ? "bg-gradient-to-br from-saffron-500 to-saffron-600" : "bg-gradient-to-br from-midnight-700 to-midnight-900"}`}>
                      {q.vendorName.charAt(0).toUpperCase()}
                    </div>

                    {/* VENDOR DETAILS */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-extrabold text-midnight-900">{q.vendorName}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {q.eta && (
                          <span className="inline-flex items-center gap-1.5 text-sm text-midnight-600 bg-slate-100 px-3 py-1 rounded-lg font-medium">
                            <Truck size={13}/> {q.eta}
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-lg font-medium ${gstIncluded ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {gstIncluded ? <CheckCircle size={13}/> : <XCircle size={13}/>}
                          GST {gstIncluded ? "Included" : "Excluded"}
                        </span>
                        {vendorPhone && (
                          <a href={`tel:${vendorPhone}`} className="inline-flex items-center gap-1.5 text-sm text-midnight-600 bg-slate-100 px-3 py-1 rounded-lg font-medium hover:bg-saffron-50 hover:text-saffron-700 transition">
                            <Phone size={13}/> {vendorPhone}
                          </a>
                        )}
                      </div>
                      {q.notes && (
                        <p className="mt-3 text-sm text-midnight-500 italic bg-cream-50 border border-cream-200 rounded-xl px-3 py-2">"{q.notes}"</p>
                      )}
                    </div>

                    {/* PRICE */}
                    <div className={`rounded-2xl p-4 text-center shrink-0 min-w-[160px] border ${idx === 0 ? "bg-saffron-50 border-saffron-200" : "bg-slate-50 border-slate-200"}`}>
                      <div className="text-xs text-midnight-500 font-semibold mb-1">Estimated Cost</div>
                      <div className={`text-3xl font-extrabold leading-none ${idx === 0 ? "text-saffron-600" : "text-midnight-900"}`}>
                        ₹{q.priceLow.toLocaleString("en-IN")}
                      </div>
                      {q.priceLow !== q.priceHigh && (
                        <div className="text-xs text-midnight-400 mt-1">up to ₹{q.priceHigh.toLocaleString("en-IN")}</div>
                      )}
                      {advanceAmt !== null && (
                        <div className="mt-2 pt-2 border-t border-dashed border-slate-300">
                          <div className="text-[11px] text-midnight-400">Advance ({advancePct}%)</div>
                          <div className="text-sm font-bold text-midnight-800">₹{advanceAmt.toLocaleString("en-IN")}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* INCLUSIONS + EXCLUSIONS */}
                  {(inclusions.length > 0 || exclusions.length > 0) && (
                    <div className="grid sm:grid-cols-2 border-t border-slate-100">
                      {inclusions.length > 0 && (
                        <div className="p-5 bg-emerald-50/50 sm:border-r border-b sm:border-b-0 border-slate-100">
                          <div className="text-xs font-extrabold uppercase tracking-wide text-emerald-700 mb-3 flex items-center gap-1.5">
                            <CheckCircle size={12}/> What's Included
                          </div>
                          <div className="space-y-2">
                            {inclusions.map((item) => (
                              <div key={item} className="flex items-center gap-2.5 text-sm text-midnight-700">
                                <span className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 grid place-items-center shrink-0">
                                  <CheckCircle size={10} className="text-emerald-600"/>
                                </span>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {exclusions.length > 0 && (
                        <div className="p-5 bg-red-50/30">
                          <div className="text-xs font-extrabold uppercase tracking-wide text-red-600 mb-3 flex items-center gap-1.5">
                            <XCircle size={12}/> Not Included
                          </div>
                          <div className="space-y-2">
                            {exclusions.map((item) => (
                              <div key={item} className="flex items-center gap-2.5 text-sm text-midnight-500">
                                <span className="w-5 h-5 rounded-full bg-red-100 border border-red-200 grid place-items-center shrink-0">
                                  <XCircle size={10} className="text-red-500"/>
                                </span>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CANCELLATION */}
                  {cancellation.filter(r => r.label).length > 0 && (
                    <div className="border-t border-slate-100 p-5">
                      <div className="text-xs font-extrabold uppercase tracking-wide text-midnight-500 mb-3 flex items-center gap-1.5">
                        <AlertCircle size={12}/> Cancellation Policy
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {cancellation.filter(r => r.label).map((row, i) => (
                          <div key={i} className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-2.5 gap-3 bg-slate-50">
                            <span className="text-sm text-midnight-600">{row.label}</span>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${refundColor(row.refund)}`}>{row.refund}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* T&C ACCORDION */}
                  {terms && (
                    <details className="border-t border-slate-100 group">
                      <summary className="flex items-center justify-between px-5 py-3 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 transition">
                        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-midnight-400">
                          <FileText size={11}/> Terms & Conditions
                        </span>
                        <span className="text-xs text-midnight-400 group-open:hidden">Show ↓</span>
                        <span className="text-xs text-midnight-400 hidden group-open:block">Hide ↑</span>
                      </summary>
                      <div className="px-5 py-4 bg-white space-y-2">
                        {terms.split("\n").filter(Boolean).map((line, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-midnight-500 leading-relaxed">
                            <span className="w-5 h-5 rounded-full bg-slate-100 grid place-items-center shrink-0 font-bold text-[10px] mt-0.5">{i + 1}</span>
                            {line.replace(/^\d+\.\s*/, "")}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  {/* CTA */}
                  <div className={`px-6 py-4 flex items-center gap-4 flex-wrap ${idx === 0 ? "bg-saffron-50 border-t border-saffron-100" : "bg-slate-50 border-t border-slate-100"}`}>
                    {q.status === "sent" && (
                      <AcceptQuoteButton
                        quoteId={q.id}
                        vendorName={q.vendorName}
                        price={`₹${q.priceLow.toLocaleString("en-IN")}`}
                      />
                    )}
                    {q.status === "accepted" && (
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <CheckCircle size={16}/> Quote accepted — our team will contact you soon
                      </div>
                    )}
                    {q.status === "rejected" && (
                      <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                        <XCircle size={16}/> You declined this quote
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* INVENTORY */}
            {notes.inventory.length > 0 && (
              <div className="card p-6">
                <h2 className="font-extrabold text-midnight-900 mb-5 flex items-center gap-2">
                  <Package size={16} className="text-midnight-400"/> Your Items
                  <span className="chip ml-auto">{totalItems} total pieces</span>
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {notes.inventory.map((item) => (
                    <div key={item.item} className="flex flex-col items-center gap-2 border border-slate-200 rounded-xl p-3 bg-slate-50 text-center hover:bg-white hover:shadow-sm transition">
                      <span className="text-2xl">{getIcon(item.item)}</span>
                      <span className="text-xs font-semibold text-midnight-700 leading-tight">{item.item}</span>
                      <span className="text-[11px] font-bold bg-midnight-900 text-white px-2 py-0.5 rounded-full">× {item.qty}</span>
                    </div>
                  ))}
                </div>
                {notes.addons.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="text-xs font-bold uppercase tracking-wide text-midnight-500 mb-2">Add-ons Selected</div>
                    <div className="flex flex-wrap gap-2">
                      {notes.addons.map((addon) => (
                        <span key={addon} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 rounded-lg text-xs font-semibold">
                          <ShieldCheck size={11}/> {addon}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: STICKY SIDEBAR ── */}
          <div className="space-y-4 lg:sticky lg:top-20">

            {/* MOVE SUMMARY */}
            <div className="card p-5">
              <h3 className="font-extrabold text-midnight-900 mb-4 text-sm uppercase tracking-wide">Move Summary</h3>

              {/* ROUTE VISUAL */}
              <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <span className="w-3 h-3 rounded-full bg-saffron-500 shrink-0"/>
                    <span className="w-0.5 h-8 bg-slate-200"/>
                    <span className="w-3 h-3 rounded-full bg-mint-500 shrink-0"/>
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <div>
                      <div className="font-bold text-midnight-900">{inquiry.pickupCity}</div>
                      {inquiry.pickupAddress && <div className="text-xs text-midnight-400 mt-0.5">{inquiry.pickupAddress}</div>}
                      <div className="flex gap-2 mt-1">
                        {notes.pickupFloor && <span className="text-[11px] text-midnight-400 flex items-center gap-1"><Building2 size={9}/> Fl. {notes.pickupFloor}</span>}
                        {notes.pickupLift !== undefined && (
                          <span className={`text-[11px] flex items-center gap-1 font-semibold ${notes.pickupLift ? "text-emerald-600" : "text-red-400"}`}>
                            <Layers size={9}/> Lift {notes.pickupLift ? "✓" : "✗"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-midnight-900">{inquiry.dropCity}</div>
                      {inquiry.dropAddress && <div className="text-xs text-midnight-400 mt-0.5">{inquiry.dropAddress}</div>}
                      <div className="flex gap-2 mt-1">
                        {notes.dropFloor && <span className="text-[11px] text-midnight-400 flex items-center gap-1"><Building2 size={9}/> Fl. {notes.dropFloor}</span>}
                        {notes.dropLift !== undefined && (
                          <span className={`text-[11px] flex items-center gap-1 font-semibold ${notes.dropLift ? "text-emerald-600" : "text-red-400"}`}>
                            <Layers size={9}/> Lift {notes.dropLift ? "✓" : "✗"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                {[
                  { label: "House Size",   value: inquiry.houseSize,  icon: <Home size={13}/> },
                  { label: "Moving Date",  value: movingDateStr || "Not set", icon: <Calendar size={13}/> },
                  { label: "Total Items",  value: totalItems ? `${totalItems} pieces` : "—", icon: <Package size={13}/> },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-1.5 text-midnight-400">{row.icon} {row.label}</span>
                    <span className="font-semibold text-midnight-900 text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTACT SUPPORT */}
            <div className="card p-5">
              <h3 className="font-extrabold text-midnight-900 mb-1 text-sm">Need Help?</h3>
              <p className="text-xs text-midnight-400 mb-4">Our team is available 9AM–8PM, Mon–Sat</p>
              <a href="tel:+918000000000" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-midnight-900 text-white text-sm font-bold hover:bg-midnight-700 transition">
                <Phone size={14}/> +91 80000 00000
              </a>
            </div>

            {/* STATUS TIMELINE */}
            <div className="card p-5">
              <h3 className="font-extrabold text-midnight-900 mb-4 text-sm uppercase tracking-wide">Status</h3>
              {[
                { key: "new",       label: "Inquiry Submitted" },
                { key: "contacted", label: "Team Reviewing" },
                { key: "quoted",    label: "Quotes Sent" },
                { key: "booked",    label: "Booking Confirmed" },
              ].map((step, i, arr) => {
                const statusOrder = ["new", "contacted", "quoted", "booked"];
                const currentIdx  = statusOrder.indexOf(inquiry.status);
                const stepIdx     = statusOrder.indexOf(step.key);
                const done    = stepIdx <= currentIdx;
                const current = stepIdx === currentIdx;
                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`w-6 h-6 rounded-full border-2 grid place-items-center shrink-0 ${done ? "bg-midnight-900 border-midnight-900" : "bg-white border-slate-300"}`}>
                        {done && <CheckCircle size={12} className="text-white"/>}
                      </span>
                      {i < arr.length - 1 && <span className={`w-0.5 h-6 mt-1 ${done && stepIdx < currentIdx ? "bg-midnight-900" : "bg-slate-200"}`}/>}
                    </div>
                    <div className={`pb-4 text-sm ${current ? "font-bold text-midnight-900" : done ? "text-midnight-600" : "text-midnight-300"}`}>
                      {step.label}
                      {current && <span className="ml-2 text-[11px] font-bold text-saffron-500 uppercase">← Now</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
