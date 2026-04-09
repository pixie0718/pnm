"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, Phone, Mail, MessageCircle, ArrowRight } from "lucide-react";

const categories = [
  {
    label: "Getting Started",
    faqs: [
      {
        q: "How does ShiftIndia work?",
        a: "Tell us your pickup city, drop city, house size, and moving date. Our platform instantly generates quotes from verified vendors near you. Compare prices, check inclusions, and confirm your booking — all in under 2 minutes. Track your move live and pay only after delivery.",
      },
      {
        q: "Is ShiftIndia free to use?",
        a: "100% free for customers. There's no platform fee, no registration charge, and no obligation to book after getting quotes. You pay only the vendor's quoted price — nothing more.",
      },
      {
        q: "Do I need to create an account?",
        a: "You can get quotes without an account. But creating a free account lets you track your inquiry, receive and compare quotes in one place, and manage your bookings.",
      },
      {
        q: "How long does it take to get quotes?",
        a: "Most customers receive their first quote within 2 hours of submitting an inquiry. For peak dates (weekends, month-ends), it may take up to 4 hours.",
      },
    ],
  },
  {
    label: "Vendors & Quality",
    faqs: [
      {
        q: "Are the vendors verified?",
        a: "Yes — every vendor undergoes a multi-step verification: GST registration check, KYC documents, physical address verification, and a quality audit. We also continuously monitor ratings and reviews, and remove vendors who consistently underperform.",
      },
      {
        q: "How many vendors will quote me?",
        a: "Typically 3–8 vendors quote per inquiry, depending on your city pair and availability. More vendors compete for your business, which keeps prices fair.",
      },
      {
        q: "Can I choose a specific vendor?",
        a: "You can browse vendor profiles, read reviews, and compare inclusions before choosing. If you have a preferred vendor already on ShiftIndia, you can also search them directly.",
      },
      {
        q: "What if a vendor behaves unprofessionally?",
        a: "Contact us immediately on 1800-123-4567 or hello@shiftindia.in. We have a zero-tolerance policy for misconduct. The vendor will be suspended pending investigation, and we'll arrange an alternative at no extra cost.",
      },
    ],
  },
  {
    label: "Pricing & Payment",
    faqs: [
      {
        q: "How is pricing calculated?",
        a: "Pricing depends on distance, house size, number of items, floor number at pickup/drop, lift availability, packing type, and any add-ons you select. Every quote is fully itemised — no vague 'miscellaneous' charges.",
      },
      {
        q: "Are there any hidden charges?",
        a: "No. The quoted price is final. The only extras that can legitimately apply are: (1) if you add items on moving day that weren't in the original inventory, or (2) long-carry charges if the truck can't park within 50m of your building — and these must be disclosed before the move starts.",
      },
      {
        q: "Do I have to pay an advance?",
        a: "Advance is never mandatory on ShiftIndia. Some vendors request a small booking amount (usually 10–30%) to confirm the date. The balance is always paid after delivery.",
      },
      {
        q: "How do I pay?",
        a: "UPI, credit/debit card, net banking, or cash — your choice. Payment is always between you and the vendor, with ShiftIndia's escrow protection ensuring your money is safe.",
      },
      {
        q: "What is escrow protection?",
        a: "When you pay through ShiftIndia's escrow, your money is held securely and released to the vendor only after you confirm successful delivery. If there's a dispute, we mediate and release funds only when resolved.",
      },
    ],
  },
  {
    label: "During the Move",
    faqs: [
      {
        q: "Do you offer live tracking?",
        a: "Yes. Every truck on our platform has GPS tracking. You (and up to 3 family members) can watch the move in real time from our app or website — no calls needed.",
      },
      {
        q: "What if the truck is late?",
        a: "If a vendor is more than 2 hours late without prior notice, you're entitled to a delay compensation of ₹500/hour, capped at ₹5,000. Raise a claim in your booking page.",
      },
      {
        q: "Who does the packing — vendor or us?",
        a: "The vendor handles all packing unless you've opted out. If you've selected Premium Packing, they bring high-quality materials including bubble wrap, stretch film, and wooden crates for fragile items.",
      },
      {
        q: "What items cannot be moved?",
        a: "Hazardous materials (LPG cylinders, chemicals), live animals, perishable food, and items of extreme value (above ₹10L per item) without special declaration. For art, jewellery, or antiques — declare upfront for special handling.",
      },
    ],
  },
  {
    label: "Damage & Claims",
    faqs: [
      {
        q: "What if my belongings are damaged?",
        a: "Every booking includes ₹5 lakh damage protection. If something is damaged during transit, photograph the damage before unpacking further, and raise a claim in your account within 24 hours of delivery. We process valid claims within 72 hours.",
      },
      {
        q: "What does the damage protection cover?",
        a: "Physical damage during loading, transit, and unloading. It does not cover pre-existing damage, items packed by the customer themselves, or normal wear and tear.",
      },
      {
        q: "How do I raise a damage claim?",
        a: "Go to Account → Your Bookings → Raise a Claim. Upload photos of damaged items and a brief description. Our claims team contacts you within 4 working hours.",
      },
    ],
  },
  {
    label: "Cancellation & Rescheduling",
    faqs: [
      {
        q: "Can I cancel my booking?",
        a: "Yes. Free cancellation up to 48 hours before your moving date. Cancellation between 24–48 hours: 25% of booking amount retained. Less than 24 hours: up to 50% retained. Same-day cancellation: vendor may charge the full amount.",
      },
      {
        q: "Can I reschedule?",
        a: "Free rescheduling up to 48 hours before your move, subject to vendor availability on the new date. Within 48 hours, a rescheduling fee of ₹299–₹999 may apply.",
      },
      {
        q: "What if the vendor cancels?",
        a: "If a vendor cancels on you, you get a full refund of any advance paid, plus we immediately find you an equivalent replacement at no extra charge. If we can't find a replacement within 4 hours, you get ₹2,000 compensation.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-slate-200 rounded-2xl overflow-hidden transition-all ${open ? "shadow-sm" : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-slate-50 transition"
      >
        <span className="font-semibold text-midnight-900 text-sm md:text-base">{q}</span>
        <ChevronDown
          size={18}
          className={`text-midnight-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-midnight-600 leading-relaxed border-t border-slate-100 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0].label);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? categories.flatMap((c) =>
        c.faqs
          .filter(
            (f) =>
              f.q.toLowerCase().includes(search.toLowerCase()) ||
              f.a.toLowerCase().includes(search.toLowerCase())
          )
          .map((f) => ({ ...f, category: c.label }))
      )
    : null;

  const activeCategory_ = categories.find((c) => c.label === activeCategory)!;

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="bg-midnight-900 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative">
          <div className="text-xs font-bold uppercase tracking-widest text-saffron-400 mb-3">Help Center</div>
          <h1 className="display text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-midnight-300 mb-8">Everything you need to know about moving with ShiftIndia.</p>

          {/* SEARCH */}
          <div className="relative max-w-lg mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-400" />
            <input
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border-0 text-midnight-900 placeholder:text-midnight-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
              placeholder="Search questions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* SEARCH RESULTS */}
        {filtered !== null ? (
          <div>
            <div className="text-sm text-midnight-500 mb-6">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
            </div>
            {filtered.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-4xl mb-3">🤔</div>
                <div className="font-bold text-midnight-900 mb-2">No results found</div>
                <p className="text-sm text-midnight-500">Try different keywords, or contact our support team.</p>
                <a href="tel:18001234567" className="btn btn-primary mt-5 inline-flex">
                  <Phone size={14} /> Call Support
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((f) => (
                  <div key={f.q}>
                    <div className="text-[11px] font-bold uppercase tracking-wide text-saffron-500 mb-1 px-1">{f.category}</div>
                    <FAQItem q={f.q} a={f.a} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-[220px_1fr] gap-10">
            {/* CATEGORY SIDEBAR */}
            <nav className="space-y-1">
              {categories.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setActiveCategory(c.label)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeCategory === c.label
                      ? "bg-midnight-900 text-white"
                      : "text-midnight-600 hover:bg-slate-100"
                  }`}
                >
                  {c.label}
                  <span className={`ml-2 text-xs ${activeCategory === c.label ? "text-white/60" : "text-midnight-400"}`}>
                    {c.faqs.length}
                  </span>
                </button>
              ))}
            </nav>

            {/* FAQ LIST */}
            <div>
              <h2 className="text-2xl font-extrabold text-midnight-900 mb-6">{activeCategory_.label}</h2>
              <div className="space-y-3">
                {activeCategory_.faqs.map((f) => (
                  <FAQItem key={f.q} q={f.q} a={f.a} />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CONTACT CTA */}
      <section className="bg-cream-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="display text-3xl font-bold text-midnight-900 mb-2">Still have questions?</h2>
          <p className="text-midnight-500 mb-8">Our team is available Mon–Sat, 9AM–8PM.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:18001234567" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-midnight-900 text-white font-bold text-sm hover:bg-midnight-700 transition">
              <Phone size={15} /> 1800-123-4567 (Toll Free)
            </a>
            <a href="mailto:hello@shiftindia.in" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-midnight-700 font-bold text-sm hover:bg-slate-100 transition">
              <Mail size={15} /> hello@shiftindia.in
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
