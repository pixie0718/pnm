import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Inbox, Phone, Mail, MapPin, Calendar, Home, Clock,
  ArrowUpRight, TrendingUp, Users, CheckCircle, Star, XCircle,
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

  const stats = [
    {
      label: "Total Inquiries",
      value: total,
      icon: Users,
      gradient: "from-brand-600 to-blue-500",
      trend: "All time",
    },
    {
      label: "New Leads",
      value: countMap.new || 0,
      icon: Star,
      gradient: "from-amber-500 to-saffron-500",
      trend: "Action needed",
    },
    {
      label: "Quoted",
      value: countMap.quoted || 0,
      icon: TrendingUp,
      gradient: "from-violet-600 to-fuchsia-500",
      trend: "In progress",
    },
    {
      label: "Booked",
      value: countMap.booked || 0,
      icon: CheckCircle,
      gradient: "from-emerald-500 to-teal-500",
      trend: "Converted",
    },
  ];

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

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="text-xs text-ink-500 uppercase tracking-wide font-semibold">Admin Panel</div>
          <h1 className="text-3xl font-extrabold text-ink-900">Customer Inquiries</h1>
          <p className="text-sm text-ink-500 mt-1">Live quote requests from the website</p>
        </div>
        <Link href="/admin" className="btn btn-ghost text-sm">
          ← Dashboard
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-6">
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} text-white grid place-items-center`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-semibold text-ink-400">{s.trend}</span>
              </div>
              <div className="text-2xl font-extrabold text-ink-900 mt-4">{s.value}</div>
              <div className="text-sm text-ink-500">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* FILTER TABS */}
      <div className="card p-1.5 mb-6 flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const active = (status ?? undefined) === t.key;
          const href = t.key ? `/admin/inquiries?status=${t.key}` : "/admin/inquiries";
          return (
            <Link
              key={t.label}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
                active
                  ? "bg-midnight-900 text-white shadow"
                  : "text-ink-600 hover:bg-slate-100"
              }`}
            >
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                active ? "bg-white/20 text-white" : "bg-slate-100 text-ink-500"
              }`}>
                {t.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* TABLE / EMPTY STATE */}
      {inquiries.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 grid place-items-center mx-auto mb-4">
            <Inbox size={28} className="text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-ink-900">No inquiries found</h3>
          <p className="text-ink-500 mt-2 text-sm">
            {status ? `No inquiries with status "${status}" yet.` : "When customers submit the homepage form, they'll appear here."}
          </p>
          {status && (
            <Link href="/admin/inquiries" className="btn btn-ghost text-sm mt-4 inline-flex">
              Clear filter
            </Link>
          )}
        </div>
      ) : (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-ink-900">
              {status ? `${status.charAt(0).toUpperCase() + status.slice(1)} Inquiries` : "All Inquiries"}
            </h2>
            <span className="chip">{inquiries.length} shown</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-500 border-b border-slate-100">
                  <th className="py-3 pr-4 font-semibold">ID</th>
                  <th className="py-3 pr-4 font-semibold">Route</th>
                  <th className="py-3 pr-4 font-semibold">Customer</th>
                  <th className="py-3 pr-4 font-semibold">Contact</th>
                  <th className="py-3 pr-4 font-semibold">Moving Date</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition group">
                    {/* ID */}
                    <td className="py-4 pr-4">
                      <div className="font-mono text-xs text-ink-400">#{inq.id}</div>
                      <div className="text-[11px] text-ink-300 mt-0.5 flex items-center gap-1">
                        <Clock size={10} /> {timeAgo(inq.createdAt)}
                      </div>
                    </td>

                    {/* ROUTE */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2 font-semibold text-ink-900">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                          {inq.pickupCity}
                        </span>
                        <span className="text-ink-300 text-xs">→</span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                          {inq.dropCity}
                        </span>
                      </div>
                      <div className="text-xs text-ink-400 mt-0.5 flex items-center gap-1">
                        <Home size={10} /> {inq.houseSize}
                        {inq.quotes.length > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">
                            {inq.quotes.length} quote{inq.quotes.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* CUSTOMER */}
                    <td className="py-4 pr-4">
                      <div className="font-medium text-ink-900">{inq.name || <span className="text-ink-300">—</span>}</div>
                      {inq.notes && (
                        <div className="text-xs text-ink-400 mt-0.5 max-w-[180px] truncate" title={inq.notes}>
                          💬 {inq.notes}
                        </div>
                      )}
                    </td>

                    {/* CONTACT */}
                    <td className="py-4 pr-4">
                      <div className="space-y-1">
                        {inq.phone && (
                          <a
                            href={`tel:${inq.phone}`}
                            className="flex items-center gap-1.5 text-ink-600 hover:text-amber-600 transition"
                          >
                            <Phone size={12} /> {inq.phone}
                          </a>
                        )}
                        {inq.email && (
                          <a
                            href={`mailto:${inq.email}`}
                            className="flex items-center gap-1.5 text-ink-400 hover:text-amber-600 transition text-xs"
                          >
                            <Mail size={11} /> {inq.email}
                          </a>
                        )}
                      </div>
                    </td>

                    {/* MOVING DATE */}
                    <td className="py-4 pr-4">
                      {inq.movingDate ? (
                        <div className="flex items-center gap-1.5 text-ink-600">
                          <Calendar size={12} />
                          {new Date(inq.movingDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      ) : (
                        <span className="text-ink-300">—</span>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="py-4 pr-4">
                      <StatusBadge status={inq.status} />
                    </td>

                    {/* ACTION */}
                    <td className="py-4 text-right">
                      <Link
                        href={`/admin/inquiries/${inq.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-midnight-900 text-white text-xs font-semibold hover:bg-midnight-700 transition"
                      >
                        Open <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
