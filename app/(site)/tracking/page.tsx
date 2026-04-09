"use client";
import { Phone, MessageCircle, Check, Truck, Package, Home, MapPin } from "lucide-react";

const timeline = [
  { k: "packing", label: "Packing Started", time: "Today, 08:30 AM", icon: Package, done: true },
  { k: "loaded", label: "Loaded on Truck", time: "Today, 11:45 AM", icon: Truck, done: true },
  { k: "transit", label: "In Transit", time: "En route · Expected delivery tomorrow", icon: MapPin, done: true, active: true },
  { k: "delivered", label: "Delivered", time: "Pending", icon: Home, done: false },
];

export default function TrackingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-ink-500 uppercase tracking-wide font-semibold">Order #SHM-2026-4821</div>
          <h1 className="text-2xl font-extrabold text-ink-900">Your move is on the way 🚚</h1>
        </div>
        <span className="badge bg-emerald-50 text-emerald-700 !py-2 !px-3">● Live Tracking</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* MAP */}
        <div className="card overflow-hidden">
          <div className="relative h-[500px] map-grid bg-slate-50">
            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb"/>
                  <stop offset="100%" stopColor="#10b981"/>
                </linearGradient>
              </defs>
              <path d="M 80 420 Q 300 300, 450 250 T 800 80" stroke="url(#routeGrad)" strokeWidth="4" fill="none" strokeDasharray="10 6" strokeLinecap="round"/>
            </svg>

            {/* Origin pin */}
            <div className="absolute left-[60px] bottom-[70px]">
              <div className="w-5 h-5 rounded-full bg-brand-600 border-4 border-white shadow-lg"></div>
              <div className="mt-1 text-xs font-bold text-ink-900 bg-white rounded-md px-2 py-1 shadow-soft whitespace-nowrap">Ahmedabad</div>
            </div>

            {/* Truck (current position) */}
            <div className="absolute left-[440px] top-[230px]">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-brand-600 text-white grid place-items-center shadow-glow pulse-dot relative">
                  <Truck size={22}/>
                </div>
              </div>
              <div className="mt-2 text-xs font-bold text-ink-900 bg-white rounded-md px-2 py-1 shadow-soft whitespace-nowrap">Truck · 78 km/h</div>
            </div>

            {/* Destination pin */}
            <div className="absolute right-[60px] top-[60px]">
              <div className="w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-lg"></div>
              <div className="mt-1 text-xs font-bold text-ink-900 bg-white rounded-md px-2 py-1 shadow-soft whitespace-nowrap">Mumbai</div>
            </div>

            {/* Stats overlay */}
            <div className="absolute top-4 left-4 right-4 flex gap-3 flex-wrap">
              <div className="bg-white/95 backdrop-blur rounded-xl px-4 py-3 shadow-soft">
                <div className="text-xs text-ink-500">Distance Left</div>
                <div className="font-bold text-ink-900">210 km</div>
              </div>
              <div className="bg-white/95 backdrop-blur rounded-xl px-4 py-3 shadow-soft">
                <div className="text-xs text-ink-500">ETA</div>
                <div className="font-bold text-ink-900">Tomorrow, 9:30 AM</div>
              </div>
              <div className="bg-white/95 backdrop-blur rounded-xl px-4 py-3 shadow-soft">
                <div className="text-xs text-ink-500">Status</div>
                <div className="font-bold text-emerald-600">On Schedule</div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="space-y-6">
          {/* Driver */}
          <div className="card p-6">
            <h3 className="font-bold mb-4">Your Driver</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-600 to-emerald-500 text-white grid place-items-center font-bold text-lg">RK</div>
              <div className="flex-1">
                <div className="font-bold text-ink-900">Rajesh Kumar</div>
                <div className="text-sm text-ink-500">MH-04-XY-2847 · ★ 4.9</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <a href="tel:+910000000000" className="btn btn-ghost text-sm"><Phone size={14}/> Call</a>
              <button className="btn btn-primary text-sm"><MessageCircle size={14}/> Chat</button>
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-6">
            <h3 className="font-bold mb-5">Status Timeline</h3>
            <div className="space-y-5">
              {timeline.map((t, i) => {
                const Icon = t.icon;
                return (
                  <div key={t.k} className="flex gap-4 relative">
                    {i < timeline.length - 1 && (
                      <div className={`absolute left-[18px] top-10 bottom-[-20px] w-0.5 ${t.done ? "bg-emerald-500" : "bg-slate-200"}`}/>
                    )}
                    <div className={`w-9 h-9 shrink-0 rounded-full grid place-items-center z-10 ${
                      t.active ? "bg-brand-600 text-white shadow-glow" :
                      t.done ? "bg-emerald-500 text-white" : "bg-slate-100 text-ink-500"
                    }`}>
                      {t.done && !t.active ? <Check size={16}/> : <Icon size={16}/>}
                    </div>
                    <div>
                      <div className={`font-semibold ${t.active ? "text-brand-600" : t.done ? "text-ink-900" : "text-ink-500"}`}>{t.label}</div>
                      <div className="text-xs text-ink-500">{t.time}</div>
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
