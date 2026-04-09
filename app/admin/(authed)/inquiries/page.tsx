import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Inbox, Phone, Mail, MapPin, Calendar, Home, Clock, ArrowUpRight, Filter,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status as
    | "new"
    | "contacted"
    | "quoted"
    | "booked"
    | "cancelled"
    | undefined;

  const [inquiries, counts] = await Promise.all([
    prisma.inquiry.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { quotes: true },
    }),
    prisma.inquiry.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const total = counts.reduce((sum, c) => sum + c._count._all, 0);
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));

  const tabs = [
    { key: undefined, label: "All", count: total },
    { key: "new", label: "New", count: countMap.new || 0 },
    { key: "contacted", label: "Contacted", count: countMap.contacted || 0 },
    { key: "quoted", label: "Quoted", count: countMap.quoted || 0 },
    { key: "booked", label: "Booked", count: countMap.booked || 0 },
    { key: "cancelled", label: "Cancelled", count: countMap.cancelled || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="text-xs text-midnight-500 uppercase tracking-wide font-bold">
            Admin · Inquiries
          </div>
          <h1 className="display text-4xl font-bold text-midnight-900 mt-1">
            Customer Inquiries
          </h1>
          <p className="text-midnight-500 mt-1">
            All quote requests from the website. Live data from MySQL.
          </p>
        </div>
        <Link href="/admin" className="btn btn-ghost text-sm">
          ← Admin Home
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {[
          { label: "Total", value: total, color: "bg-midnight-900 text-white" },
          { label: "New", value: countMap.new || 0, color: "bg-saffron-500 text-white" },
          { label: "Contacted", value: countMap.contacted || 0, color: "bg-cream-200 text-midnight-900" },
          { label: "Quoted", value: countMap.quoted || 0, color: "bg-mint-500 text-white" },
          { label: "Booked", value: countMap.booked || 0, color: "bg-midnight-700 text-white" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
            <div className="text-xs font-bold uppercase tracking-wider opacity-80">{s.label}</div>
            <div className="display text-3xl font-bold mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      {/* FILTER TABS */}
      <div className="card p-2 mb-6 flex items-center gap-1 overflow-x-auto">
        <Filter size={16} className="text-midnight-500 ml-3 mr-1 shrink-0" />
        {tabs.map((t) => {
          const active = (status ?? undefined) === t.key;
          const href = t.key ? `/admin/inquiries?status=${t.key}` : "/admin/inquiries";
          return (
            <Link
              key={t.label}
              href={href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                active
                  ? "bg-midnight-900 text-white"
                  : "text-midnight-700 hover:bg-cream-100"
              }`}
            >
              {t.label}
              <span className={`ml-2 text-xs ${active ? "text-saffron-300" : "text-midnight-500"}`}>
                {t.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* LIST */}
      {inquiries.length === 0 ? (
        <div className="card p-16 text-center">
          <Inbox size={48} className="mx-auto text-midnight-300 mb-4" />
          <h3 className="display text-2xl font-bold text-midnight-900">No inquiries yet</h3>
          <p className="text-midnight-500 mt-2">
            When customers submit the homepage form, they'll show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="card p-6 hover:shadow-glow transition group"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-mono text-xs text-midnight-500">#{inq.id}</span>
                    <StatusBadge status={inq.status} />
                    <span className="chip">
                      <Home size={12} /> {inq.houseSize}
                    </span>
                    {inq.quotes.length > 0 && (
                      <span className="chip !bg-mint-500/10 !border-mint-500/30 !text-mint-600">
                        {inq.quotes.length} {inq.quotes.length === 1 ? "quote" : "quotes"}
                      </span>
                    )}
                  </div>

                  <div className="display text-2xl font-bold text-midnight-900 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-saffron-500"></span>
                      {inq.pickupCity}
                    </span>
                    <span className="text-midnight-300">→</span>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-mint-500"></span>
                      {inq.dropCity}
                    </span>
                  </div>

                  {inq.name && (
                    <div className="mt-3 text-sm font-semibold text-midnight-900">
                      {inq.name}
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-4 flex-wrap text-sm text-midnight-500">
                    {inq.phone && (
                      <a
                        href={`tel:${inq.phone}`}
                        className="flex items-center gap-1.5 hover:text-saffron-600"
                      >
                        <Phone size={13} /> {inq.phone}
                      </a>
                    )}
                    {inq.email && (
                      <a
                        href={`mailto:${inq.email}`}
                        className="flex items-center gap-1.5 hover:text-saffron-600"
                      >
                        <Mail size={13} /> {inq.email}
                      </a>
                    )}
                    {inq.movingDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />{" "}
                        {new Date(inq.movingDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-midnight-300">
                      <Clock size={13} /> {timeAgo(inq.createdAt)}
                    </span>
                  </div>

                  {inq.notes && (
                    <div className="mt-3 text-sm bg-cream-100 border border-cream-200 rounded-xl p-3 text-midnight-700">
                      💬 {inq.notes}
                    </div>
                  )}
                </div>

                <Link
                  href={`/admin/inquiries/${inq.id}`}
                  className="btn btn-primary !py-2.5 !px-4 text-sm"
                >
                  Open <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString("en-IN");
}
