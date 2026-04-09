import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Phone, Mail, Calendar, Clock, MapPin, ArrowLeft, Home } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import QuoteForm from "@/components/admin/QuoteForm";
import StatusUpdater from "@/components/admin/StatusUpdater";

export const dynamic = "force-dynamic";

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/admin/inquiries"
        className="inline-flex items-center gap-2 text-sm text-midnight-500 hover:text-midnight-900 mb-6"
      >
        <ArrowLeft size={16} /> Back to inquiries
      </Link>

      <div className="card p-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-midnight-500">#{inquiry.id}</span>
              <StatusBadge status={inquiry.status} />
            </div>
            <h1 className="display text-4xl md:text-5xl font-bold text-midnight-900">
              {inquiry.pickupCity} <span className="text-midnight-300">→</span>{" "}
              {inquiry.dropCity}
            </h1>
            <p className="text-midnight-500 mt-2">
              {inquiry.houseSize} ·{" "}
              {inquiry.movingDate
                ? new Date(inquiry.movingDate).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Date not specified"}
            </p>
          </div>
          <StatusUpdater id={inquiry.id} current={inquiry.status} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Section title="Customer">
            <Row icon={<Home size={14} />} label="Name" value={inquiry.name || "—"} />
            <Row
              icon={<Phone size={14} />}
              label="Phone"
              value={inquiry.phone || "—"}
              href={inquiry.phone ? `tel:${inquiry.phone}` : undefined}
            />
            <Row
              icon={<Mail size={14} />}
              label="Email"
              value={inquiry.email || "—"}
              href={inquiry.email ? `mailto:${inquiry.email}` : undefined}
            />
          </Section>

          <Section title="Move Details">
            <Row icon={<MapPin size={14} />} label="Pickup" value={inquiry.pickupCity} />
            {inquiry.pickupAddress && <Row label="Address" value={inquiry.pickupAddress} />}
            <Row icon={<MapPin size={14} />} label="Drop" value={inquiry.dropCity} />
            {inquiry.dropAddress && <Row label="Address" value={inquiry.dropAddress} />}
            <Row icon={<Home size={14} />} label="Size" value={inquiry.houseSize} />
            {inquiry.movingDate && (
              <Row
                icon={<Calendar size={14} />}
                label="Moving date"
                value={new Date(inquiry.movingDate).toLocaleDateString("en-IN")}
              />
            )}
          </Section>
        </div>

        {inquiry.notes && (
          <div className="mt-6 p-4 bg-cream-100 border border-cream-200 rounded-2xl">
            <div className="text-xs font-bold uppercase tracking-wide text-midnight-500 mb-2">
              Customer Notes
            </div>
            <p className="text-midnight-900">{inquiry.notes}</p>
          </div>
        )}

        <div className="mt-6 text-xs text-midnight-300 flex items-center gap-2">
          <Clock size={12} />
          Submitted {new Date(inquiry.createdAt).toLocaleString("en-IN")} via{" "}
          {inquiry.source}
        </div>
      </div>

      {/* QUOTES */}
      <div className="mt-8">
        <h2 className="display text-2xl font-bold text-midnight-900 mb-4">
          Quotes ({inquiry.quotes.length})
        </h2>

        {inquiry.quotes.length === 0 ? (
          <div className="card p-6 text-center text-midnight-500">
            No quotes sent yet. Add one below.
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {inquiry.quotes.map((q) => (
              <div key={q.id} className="card p-5 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-midnight-900">{q.vendorName}</strong>
                    <span
                      className={`badge ${
                        q.status === "sent"
                          ? "bg-mint-500/10 text-mint-600"
                          : q.status === "accepted"
                          ? "bg-midnight-900 text-white"
                          : q.status === "rejected"
                          ? "bg-red-500/10 text-red-600"
                          : "bg-cream-200 text-midnight-700"
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <div className="text-sm text-midnight-500 mt-1">
                    {q.eta || "—"} · ₹{q.priceLow.toLocaleString()} – ₹
                    {q.priceHigh.toLocaleString()}
                  </div>
                  {q.notes && <p className="text-xs text-midnight-500 mt-1">{q.notes}</p>}
                </div>
                <div className="text-right">
                  <div className="display text-2xl font-bold text-saffron-600">
                    ₹{q.priceLow.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-midnight-500">
                    {q.sentAt
                      ? `Sent ${new Date(q.sentAt).toLocaleDateString("en-IN")}`
                      : "Draft"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add quote form */}
        <QuoteForm inquiryId={inquiry.id} />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-midnight-500 mb-3">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  href,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <span className="text-midnight-900 font-medium">{value}</span>
  );
  return (
    <div className="flex items-start gap-3 text-sm">
      {icon && <span className="text-saffron-500 mt-0.5">{icon}</span>}
      <span className="text-midnight-500 w-20 shrink-0">{label}</span>
      {href ? (
        <a href={href} className="hover:text-saffron-600">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
