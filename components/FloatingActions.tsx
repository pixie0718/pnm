"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Phone, MessageCircle, X, ArrowRight,
  Send, ChevronUp, Headphones,
} from "lucide-react";

const PHONE      = "18001234567";
const WHATSAPP   = "918001234567"; // 91 + number
const PHONE_DISP = "1800-123-4567";

/* ── Quick query form ── */
function QueryPanel({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to API
    setSent(true);
  }

  return (
    <div className="w-72 bg-white rounded-2xl border border-midnight-100 overflow-hidden"
      style={{ boxShadow: "0 24px 64px -12px rgba(10,14,39,0.22)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-midnight-900 text-white">
        <div>
          <p className="text-xs text-midnight-300 leading-none mb-0.5">We reply in minutes</p>
          <p className="text-sm font-bold">Send us a quick query</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-midnight-700 flex items-center justify-center hover:bg-midnight-500 transition"
        >
          <X size={13} />
        </button>
      </div>

      {sent ? (
        <div className="px-5 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-mint-500/10 flex items-center justify-center mx-auto mb-3">
            <Send size={20} className="text-mint-500" />
          </div>
          <p className="font-bold text-midnight-900 mb-1">Message sent!</p>
          <p className="text-xs text-midnight-500">Our team will call you back within 10 minutes.</p>
          <button
            onClick={onClose}
            className="mt-4 text-xs font-semibold text-saffron-500 hover:text-saffron-600 transition"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="px-4 py-4 space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-midnight-500 uppercase tracking-wide mb-1">
              Your Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Rahul Sharma"
              className="w-full text-sm px-3 py-2 rounded-xl border border-midnight-100 text-midnight-900 placeholder-midnight-300 outline-none focus:border-saffron-300 focus:ring-2 focus:ring-saffron-100 transition"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-midnight-500 uppercase tracking-wide mb-1">
              Phone
            </label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full text-sm px-3 py-2 rounded-xl border border-midnight-100 text-midnight-900 placeholder-midnight-300 outline-none focus:border-saffron-300 focus:ring-2 focus:ring-saffron-100 transition"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-midnight-500 uppercase tracking-wide mb-1">
              Message
            </label>
            <textarea
              rows={2}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Moving from Mumbai to Delhi next month..."
              className="w-full text-sm px-3 py-2 rounded-xl border border-midnight-100 text-midnight-900 placeholder-midnight-300 outline-none focus:border-saffron-300 focus:ring-2 focus:ring-saffron-100 transition resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-400 text-white font-bold text-sm rounded-xl py-2.5 transition"
          >
            <Send size={13} /> Send Message
          </button>
        </form>
      )}
    </div>
  );
}

/* ── Main floating actions ── */
export default function FloatingActions() {
  const [visible, setVisible]   = useState(false);
  const [fabOpen, setFabOpen]   = useState(false);
  const [showQuery, setShowQuery] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  /* show after scrolling 300px */
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setFabOpen(false);
        setShowQuery(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [
    {
      key: "whatsapp",
      icon: <MessageCircle size={16} />,
      label: "WhatsApp",
      color: "bg-[#25D366] hover:bg-[#1ebe5d] text-white",
      onClick: () => window.open(`https://wa.me/${WHATSAPP}?text=Hi%2C+I+need+help+with+my+move`, "_blank"),
    },
    {
      key: "call",
      icon: <Phone size={16} />,
      label: PHONE_DISP,
      color: "bg-midnight-900 hover:bg-midnight-700 text-white",
      onClick: () => window.open(`tel:${PHONE}`),
    },
    {
      key: "query",
      icon: <Send size={16} />,
      label: "Quick Query",
      color: "bg-saffron-500 hover:bg-saffron-400 text-white",
      onClick: () => setShowQuery((s) => !s),
    },
  ];

  return (
    <div
      className={`fixed bottom-6 left-0 right-0 px-4 sm:px-6 z-50 flex items-end justify-between pointer-events-none transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* LEFT — contact FAB */}
      <div ref={fabRef} className="pointer-events-auto flex flex-col items-start gap-2">

        {/* Query panel */}
        <div className={`transition-all duration-300 origin-bottom-left ${showQuery ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
          <QueryPanel onClose={() => { setShowQuery(false); setFabOpen(false); }} />
        </div>

        {/* Expanded action buttons */}
        <div className={`flex flex-col gap-2 transition-all duration-300 origin-bottom-left ${fabOpen && !showQuery ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}>
          {actions.map((a, i) => (
            <button
              key={a.key}
              type="button"
              onClick={a.onClick}
              style={{ transitionDelay: `${i * 40}ms` }}
              className={`flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all ${a.color}`}
            >
              {a.icon}
              {a.label}
            </button>
          ))}
        </div>

        {/* Main FAB trigger */}
        <button
          type="button"
          onClick={() => { setFabOpen((o) => !o); setShowQuery(false); }}
          className={`relative flex items-center gap-2.5 pl-3.5 pr-5 py-3 rounded-full font-bold text-sm shadow-xl transition-all duration-300 ${
            fabOpen
              ? "bg-midnight-900 text-white"
              : "bg-white text-midnight-900 border border-midnight-100"
          }`}
          style={{ boxShadow: fabOpen ? "0 8px 30px -6px rgba(10,14,39,0.4)" : "0 8px 30px -6px rgba(10,14,39,0.18)" }}
        >
          {/* pulse ring when closed */}
          {!fabOpen && (
            <span className="absolute inset-0 rounded-full animate-ping-slow bg-saffron-200 opacity-60" />
          )}
          <span className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${fabOpen ? "bg-midnight-700 rotate-45" : "bg-saffron-500"}`}>
            {fabOpen ? <X size={14} className="text-white" /> : <Headphones size={14} className="text-white" />}
          </span>
          <span>{fabOpen ? "Close" : "Need Help?"}</span>
          {!fabOpen && (
            <ChevronUp size={13} className="text-midnight-400" />
          )}
        </button>
      </div>

      {/* RIGHT — Get Quote CTA */}
      <Link
        href="/booking"
        className="pointer-events-auto group flex items-center gap-2.5 bg-saffron-500 hover:bg-saffron-400 text-white font-bold text-sm pl-4 pr-5 py-3 rounded-full transition-all duration-300 shadow-xl"
        style={{ boxShadow: "0 8px 30px -6px rgba(255,107,53,0.5)" }}
      >
        <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          🚚
        </span>
        <span className="hidden sm:inline">Get Quote Now</span>
        <span className="sm:hidden">Quote</span>
        <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
