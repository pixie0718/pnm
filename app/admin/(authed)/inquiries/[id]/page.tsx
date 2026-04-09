import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Phone, Mail, Calendar, Clock, MapPin, ArrowLeft,
  Home, Truck, Package, ShieldCheck, ArrowUpRight,
  Building2, Layers, Send, IndianRupee,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import QuoteDrawer from "@/components/admin/QuoteDrawer";
import QuoteViewDrawer from "@/components/admin/QuoteViewDrawer";
import StatusUpdater from "@/components/admin/StatusUpdater";

export const dynamic = "force-dynamic";

// ── Note parser ──────────────────────────────────────────────
interface ParsedNotes {
  pickupFloor?: string;
  pickupLift?: boolean;
  dropFloor?: string;
  dropLift?: boolean;
  inventory: { item: string; qty: number }[];
  addons: string[];
  raw: string;
}

function parseNotes(raw: string | null): ParsedNotes {
  if (!raw) return { inventory: [], addons: [], raw: "" };

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

  const addons = addonsMatch
    ? addonsMatch[1].split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  return {
    pickupFloor: pickupMatch?.[1],
    pickupLift:  pickupMatch?.[2]?.toLowerCase() === "yes",
    dropFloor:   dropMatch?.[1],
    dropLift:    dropMatch?.[2]?.toLowerCase() === "yes",
    inventory,
    addons,
    raw,
  };
}

// ── Inventory icon map ────────────────────────────────────────
const ITEM_ICONS: Record<string, string> = {
  "double bed": "🛏",
  "single bed": "🛏",
  "sofa": "🛋",
  "refrigerator": "🧊",
  "washing machine": "🫧",
  "tv": "📺",
  "television": "📺",
  "wardrobe": "🚪",
  "boxes": "📦",
  "box": "📦",
  "dining table": "🪑",
  "table": "🪑",
  "chair": "🪑",
  "ac": "❄️",
  "air conditioner": "❄️",
  "geyser": "🚿",
  "microwave": "📦",
  "bike": "🏍",
  "motorcycle": "🏍",
  "car": "🚗",
};

function getIcon(item: string) {
  const key = item.toLowerCase();
  for (const [k, v] of Object.entries(ITEM_ICONS)) {
    if (key.includes(k)) return v;
  }
  return "📦";
}

// ── Quote status style ────────────────────────────────────────
const QUOTE_STYLE: Record<string, string> = {
  sent:     "bg-blue-50 text-blue-700 border border-blue-200",
  accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  rejected: "bg-red-50 text-red-600 border border-red-200",
  draft:    "bg-slate-100 text-slate-600 border border-slate-200",
};

// ── Page ─────────────────────────────────────────────────────
export default async function InquiryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { quotes: { orderBy: { createdAt: "desc" } } },
  });
  if (!inquiry) notFound();

  const notes = parseNotes(inquiry.notes);
  const movingDateStr = inquiry.movingDate
    ? new Date(inquiry.movingDate).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* BACK */}
      <Link
        href="/admin/inquiries"
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 mb-6 transition"
      >
        <ArrowLeft size={15} /> Back to Inquiries
      </Link>

      {/* HERO HEADER CARD */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="font-mono text-xs text-ink-400 bg-slate-100 px-2 py-0.5 rounded">#{inquiry.id}</span>
              <StatusBadge status={inquiry.status} />
              <span className="chip text-xs"><Home size={11}/> {inquiry.houseSize}</span>
              <span className="text-xs text-ink-400 flex items-center gap-1">
                <Clock size={11}/> {new Date(inquiry.createdAt).toLocaleString("en-IN")}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-ink-900 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                {inquiry.pickupCity}
              </span>
              <span className="text-ink-300 font-light">→</span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                {inquiry.dropCity}
              </span>
            </h1>

            {movingDateStr && (
              <p className="text-ink-500 mt-1.5 flex items-center gap-1.5">
                <Calendar size={14} /> {movingDateStr}
              </p>
            )}
          </div>

          {/* STATUS UPDATER + ADD QUOTE */}
          <div className="flex items-center gap-3 flex-wrap">
            <StatusUpdater id={inquiry.id} current={inquiry.status} />
            <QuoteDrawer inquiryId={inquiry.id} />
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">

        {/* LEFT: Customer + Move Details */}
        <div className="lg:col-span-2 space-y-6">

          {/* CUSTOMER CARD */}
          <div className="card p-6">
            <SectionHeading icon={<Phone size={15}/>} title="Customer Details" />
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <InfoBlock label="Name" value={inquiry.name || "—"} />
              <InfoBlock
                label="Phone"
                value={inquiry.phone || "—"}
                href={inquiry.phone ? `tel:${inquiry.phone}` : undefined}
                icon={<Phone size={13}/>}
              />
              <InfoBlock
                label="Email"
                value={inquiry.email || "—"}
                href={inquiry.email ? `mailto:${inquiry.email}` : undefined}
                icon={<Mail size={13}/>}
              />
            </div>
          </div>

          {/* MOVE DETAILS CARD */}
          <div className="card p-6">
            <SectionHeading icon={<Truck size={15}/>} title="Move Details" />
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              {/* PICKUP */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-700 mb-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Pickup
                </div>
                <div className="text-lg font-bold text-ink-900">{inquiry.pickupCity}</div>
                {inquiry.pickupAddress && (
                  <div className="text-sm text-ink-500 mt-1">{inquiry.pickupAddress}</div>
                )}
                <div className="mt-3 flex items-center gap-3 text-xs text-ink-500">
                  {notes.pickupFloor && (
                    <span className="flex items-center gap-1">
                      <Building2 size={11}/> Floor {notes.pickupFloor}
                    </span>
                  )}
                  {notes.pickupLift !== undefined && (
                    <span className={`flex items-center gap-1 font-semibold ${notes.pickupLift ? "text-emerald-600" : "text-red-500"}`}>
                      <Layers size={11}/> Lift {notes.pickupLift ? "Available" : "Not Available"}
                    </span>
                  )}
                </div>
              </div>

              {/* DROP */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Drop
                </div>
                <div className="text-lg font-bold text-ink-900">{inquiry.dropCity}</div>
                {inquiry.dropAddress && (
                  <div className="text-sm text-ink-500 mt-1">{inquiry.dropAddress}</div>
                )}
                <div className="mt-3 flex items-center gap-3 text-xs text-ink-500">
                  {notes.dropFloor && (
                    <span className="flex items-center gap-1">
                      <Building2 size={11}/> Floor {notes.dropFloor}
                    </span>
                  )}
                  {notes.dropLift !== undefined && (
                    <span className={`flex items-center gap-1 font-semibold ${notes.dropLift ? "text-emerald-600" : "text-red-500"}`}>
                      <Layers size={11}/> Lift {notes.dropLift ? "Available" : "Not Available"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* INVENTORY CARD */}
          {notes.inventory.length > 0 && (
            <div className="card p-6">
              <SectionHeading icon={<Package size={15}/>} title="Inventory" badge={`${notes.inventory.reduce((s, i) => s + i.qty, 0)} items`} />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                {notes.inventory.map((item) => (
                  <div
                    key={item.item}
                    className="flex flex-col items-center justify-center gap-2 border border-slate-200 rounded-xl p-3 bg-slate-50 hover:bg-slate-100 transition text-center"
                  >
                    <span className="text-2xl">{getIcon(item.item)}</span>
                    <span className="text-xs font-semibold text-ink-700 leading-tight">{item.item}</span>
                    <span className="text-[11px] font-bold bg-midnight-900 text-white px-2 py-0.5 rounded-full">
                      × {item.qty}
                    </span>
                  </div>
                ))}
              </div>

              {/* ADDONS */}
              {notes.addons.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-2 flex items-center gap-1.5">
                    <ShieldCheck size={12}/> Add-ons
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {notes.addons.map((addon) => (
                      <span
                        key={addon}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 rounded-lg text-xs font-semibold"
                      >
                        <ShieldCheck size={11}/> {addon}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RAW NOTES — fallback if no structured data */}
          {inquiry.notes && notes.inventory.length === 0 && (
            <div className="card p-6">
              <SectionHeading title="Customer Notes" />
              <p className="text-ink-700 mt-3 text-sm leading-relaxed whitespace-pre-line">{inquiry.notes}</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* QUICK STATS */}
          <div className="card p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-4">Summary</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">House Size</span>
                <span className="font-semibold text-ink-900">{inquiry.houseSize}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Total Items</span>
                <span className="font-semibold text-ink-900">
                  {notes.inventory.reduce((s, i) => s + i.qty, 0) || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Add-ons</span>
                <span className="font-semibold text-ink-900">{notes.addons.length || "—"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Quotes sent</span>
                <span className="font-semibold text-ink-900">{inquiry.quotes.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Source</span>
                <span className="font-semibold text-ink-900 capitalize">{inquiry.source || "website"}</span>
              </div>
            </div>
          </div>

          {/* MOVING DATE */}
          {movingDateStr && (
            <div className="card p-6 bg-gradient-to-br from-midnight-900 to-midnight-700 text-white">
              <div className="text-xs font-bold uppercase tracking-wide text-midnight-300 mb-2">Moving Date</div>
              <div className="text-2xl font-extrabold">
                {new Date(inquiry.movingDate!).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </div>
              <div className="text-midnight-300 text-sm mt-0.5">
                {new Date(inquiry.movingDate!).toLocaleDateString("en-IN", { weekday: "long", year: "numeric" })}
              </div>
            </div>
          )}

          {/* CONTACT QUICK ACTIONS */}
          {(inquiry.phone || inquiry.email) && (
            <div className="card p-6">
              <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-3">Quick Contact</div>
              <div className="space-y-2">
                {inquiry.phone && (
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 transition"
                  >
                    <Phone size={15}/> {inquiry.phone}
                  </a>
                )}
                {inquiry.email && (
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-ink-700 font-semibold text-sm hover:bg-slate-100 transition"
                  >
                    <Mail size={15}/> {inquiry.email}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QUOTES SECTION */}
      <div className="card p-6 mb-6">
        <SectionHeading
          icon={<IndianRupee size={15}/>}
          title="Quotes"
          badge={inquiry.quotes.length > 0 ? `${inquiry.quotes.length} sent` : "None yet"}
        />

        {inquiry.quotes.length === 0 ? (
          <div className="text-center py-10 text-ink-400 text-sm mt-4">
            No quotes added yet. Use the form below to add one.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {inquiry.quotes.map((q) => (
              <div key={q.id} className="flex items-center justify-between gap-4 border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-blue-500 text-white grid place-items-center shrink-0">
                    <Truck size={16}/>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-ink-900">{q.vendorName}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${QUOTE_STYLE[q.status]}`}>
                        {q.status}
                      </span>
                    </div>
                    <div className="text-sm text-ink-500 mt-0.5">
                      ETA: {q.eta || "—"} · ₹{q.priceLow.toLocaleString()} – ₹{q.priceHigh.toLocaleString()}
                    </div>
                    {q.notes && <p className="text-xs text-ink-400 mt-1">{q.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-ink-900">
                      ₹{q.priceLow.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-ink-400 mt-0.5">
                      {q.sentAt
                        ? `Sent ${new Date(q.sentAt).toLocaleDateString("en-IN")}`
                        : "Draft — not sent"}
                    </div>
                  </div>
                  <QuoteViewDrawer quote={{
                    id: q.id,
                    vendorName: q.vendorName,
                    priceLow: q.priceLow,
                    priceHigh: q.priceHigh,
                    eta: q.eta,
                    notes: q.notes,
                    status: q.status,
                    sentAt: q.sentAt,
                    features: q.features as Record<string, any> | null,
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

// ── Helper components ─────────────────────────────────────────
function SectionHeading({
  icon, title, badge,
}: {
  icon?: React.ReactNode;
  title: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="text-ink-400">{icon}</span>}
      <h2 className="font-bold text-ink-900">{title}</h2>
      {badge && <span className="chip text-xs ml-auto">{badge}</span>}
    </div>
  );
}

function InfoBlock({
  label, value, href, icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon?: React.ReactNode;
}) {
  const content = (
    <div>
      <div className="text-xs text-ink-400 font-semibold uppercase tracking-wide mb-1">{label}</div>
      <div className={`font-semibold text-ink-900 flex items-center gap-1.5 ${href ? "hover:text-amber-600" : ""}`}>
        {icon && <span className="text-ink-400">{icon}</span>}
        {value}
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
