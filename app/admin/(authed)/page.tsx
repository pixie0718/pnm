"use client";
import Link from "next/link";
import { Users, ShieldCheck, AlertTriangle, BadgeIndianRupee, Check, X, Eye, TrendingUp, Inbox, ArrowUpRight } from "lucide-react";

const pendingVendors = [
  { id: "VND-0451", name: "Mahadev Transport", city: "Pune", docs: "GST, KYC, License", since: "2 days ago" },
  { id: "VND-0450", name: "Sai Movers", city: "Hyderabad", docs: "GST, KYC", since: "3 days ago" },
  { id: "VND-0449", name: "Ganesh Logistics", city: "Ahmedabad", docs: "GST, KYC, License, Insurance", since: "5 days ago" },
];

const disputes = [
  { id: "DSP-221", customer: "Amit Shah", vendor: "QuickShift", issue: "Damaged TV", amount: "₹18,500", status: "Under Review" },
  { id: "DSP-220", customer: "Neha Rao", vendor: "BudgetMove", issue: "Late delivery", amount: "₹12,400", status: "Refund Issued" },
];

const revenue = [42, 58, 51, 67, 72, 85, 78, 91, 88, 95, 102, 118];
const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs text-ink-500 uppercase tracking-wide font-semibold">Admin Panel</div>
          <h1 className="text-3xl font-extrabold text-ink-900">Platform Overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/inquiries" className="btn btn-primary text-sm">
            <Inbox size={14} /> View Inquiries <ArrowUpRight size={14} />
          </Link>
          <span className="badge bg-brand-50 text-brand-700 !py-2 !px-3">🛡 Super Admin</span>
        </div>
      </div>

      {/* TOP STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", v: "₹2.8Cr", icon: BadgeIndianRupee, c: "from-emerald-500 to-teal-500", t: "+24%" },
          { label: "Active Vendors", v: "18,542", icon: Users, c: "from-brand-600 to-blue-500", t: "+312" },
          { label: "Total Bookings", v: "1,24,890", icon: ShieldCheck, c: "from-violet-600 to-fuchsia-500", t: "+8.2%" },
          { label: "Open Disputes", v: "7", icon: AlertTriangle, c: "from-amber-500 to-red-500", t: "-3" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-6">
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.c} text-white grid place-items-center`}><Icon size={20}/></div>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> {s.t}</span>
              </div>
              <div className="text-2xl font-extrabold text-ink-900 mt-4">{s.v}</div>
              <div className="text-sm text-ink-500">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* REVENUE CHART */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">Revenue (2025)</h2>
            <select className="input !w-auto !py-1.5 text-xs">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="flex items-end justify-between gap-2 h-48">
            {revenue.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-brand-600 to-emerald-500 rounded-md hover:opacity-80 transition" style={{ height: `${v * 1.6}px` }}></div>
                <div className="text-xs text-ink-500 font-semibold">{months[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* COMMISSION */}
        <div className="card p-6">
          <h3 className="font-bold mb-4">Commission Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Default Commission</label>
              <input className="input" type="text" defaultValue="12%"/>
            </div>
            <div>
              <label className="label">Premium Vendors</label>
              <input className="input" type="text" defaultValue="8%"/>
            </div>
            <div>
              <label className="label">Platform Fee</label>
              <input className="input" type="text" defaultValue="₹99"/>
            </div>
            <button className="btn btn-primary w-full text-sm">Update</button>
          </div>
        </div>
      </div>

      {/* VENDOR VERIFICATION */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Pending Vendor Verification</h2>
          <span className="chip">{pendingVendors.length} pending</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-500 border-b border-slate-100">
                <th className="py-3 font-semibold">Vendor ID</th>
                <th className="py-3 font-semibold">Name</th>
                <th className="py-3 font-semibold">City</th>
                <th className="py-3 font-semibold">Documents</th>
                <th className="py-3 font-semibold">Submitted</th>
                <th className="py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingVendors.map((v) => (
                <tr key={v.id} className="border-b border-slate-50">
                  <td className="py-4 font-mono text-xs">{v.id}</td>
                  <td className="py-4 font-medium">{v.name}</td>
                  <td className="py-4 text-ink-500">{v.city}</td>
                  <td className="py-4"><span className="chip text-xs">{v.docs}</span></td>
                  <td className="py-4 text-ink-500">{v.since}</td>
                  <td className="py-4">
                    <div className="flex gap-2 justify-end">
                      <button className="w-8 h-8 rounded-lg bg-slate-100 text-ink-700 grid place-items-center"><Eye size={14}/></button>
                      <button className="w-8 h-8 rounded-lg bg-red-50 text-red-600 grid place-items-center"><X size={14}/></button>
                      <button className="w-8 h-8 rounded-lg bg-emerald-500 text-white grid place-items-center"><Check size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISPUTES */}
      <div className="card p-6">
        <h2 className="text-lg font-bold mb-5">Recent Disputes</h2>
        <div className="space-y-3">
          {disputes.map((d) => (
            <div key={d.id} className="flex items-center justify-between border border-slate-200 rounded-xl p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-ink-500">{d.id}</span>
                  <span className={`badge ${d.status === "Refund Issued" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{d.status}</span>
                </div>
                <div className="font-semibold text-ink-900 mt-1">{d.issue}</div>
                <div className="text-sm text-ink-500">{d.customer} vs {d.vendor} · {d.amount}</div>
              </div>
              <button className="btn btn-ghost text-sm">Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
