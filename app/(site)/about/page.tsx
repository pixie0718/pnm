import Link from "next/link";
import {
  Shield, Truck, Star, Users, MapPin, Zap,
  Heart, TrendingUp, CheckCircle, ArrowRight, Phone, Mail,
} from "lucide-react";
import { CONTACT } from "@/lib/config";

export const metadata = {
  title: "About Us | ShiftIndia",
  description: "India's most trusted packers & movers marketplace. Learn our story, mission, and the team behind ShiftIndia.",
};

const stats = [
  { value: "2.4M+", label: "Happy Moves", icon: Heart },
  { value: "18,500+", label: "Verified Vendors", icon: Shield },
  { value: "120+", label: "Cities Covered", icon: MapPin },
  { value: "4.9★", label: "Average Rating", icon: Star },
];

const values = [
  {
    icon: Shield,
    title: "Trust First",
    desc: "Every vendor on ShiftIndia is KYC-verified, document-checked, and quality-audited before listing. We remove anyone who underperforms.",
  },
  {
    icon: Zap,
    title: "Radical Transparency",
    desc: "No hidden charges. No surprise bills. Every quote is fully itemised — you see exactly what you're paying for, down to the last rupee.",
  },
  {
    icon: Heart,
    title: "Customer Obsession",
    desc: "We built this because we moved ourselves and hated the experience. Every feature exists to make your move less stressful.",
  },
  {
    icon: TrendingUp,
    title: "Vendor Success",
    desc: "We win when our vendors win. We give them tools, leads, and technology to grow their business — not just a listing.",
  },
];

const timeline = [
  { year: "2019", title: "The bad move that started it all", desc: "Founders Rahul & Priya had a nightmare relocation — overcharged, goods damaged, no recourse. They decided to fix it." },
  { year: "2020", title: "ShiftIndia founded", desc: "Launched in Mumbai with 12 vetted vendors. 200 moves in the first month. 4.8 star average from day one." },
  { year: "2021", title: "Expanded to 10 cities", desc: "Series A funding. Built the live tracking system. Launched damage protection in partnership with ICICI Lombard." },
  { year: "2022", title: "50 cities. 5 lakh moves.", desc: "Crossed 5 lakh completed moves. Launched vendor dashboard and the customer app." },
  { year: "2023", title: "Going nationwide", desc: "120+ cities. 18,500 vendors. Launched instant quoting engine powered by our own pricing model." },
  { year: "2024", title: "India's #1 moving marketplace", desc: "2.4 million happy moves. Recognized by ET Startups, Inc42, and YourStory as the most trusted name in home relocation." },
];

const team = [
  { name: "Rahul Mehta", role: "Co-founder & CEO", initials: "RM", gradient: "from-saffron-500 to-saffron-600", bio: "Ex-Swiggy. Moved 6 times in 4 years. Built ShiftIndia so no one else has to suffer." },
  { name: "Priya Singh", role: "Co-founder & COO", initials: "PS", gradient: "from-midnight-700 to-midnight-900", bio: "Ex-OYO supply chain. Manages 18,500 vendors with a 97% satisfaction rate." },
  { name: "Arjun Nair", role: "CTO", initials: "AN", gradient: "from-mint-500 to-teal-600", bio: "Ex-Flipkart engineering. Built the live tracking system and instant quoting engine." },
  { name: "Sneha Kapoor", role: "Head of Trust & Safety", initials: "SK", gradient: "from-violet-600 to-fuchsia-500", bio: "Ex-NPCI. Designed the vendor KYC process and damage protection framework." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative bg-midnight-900 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="inline-flex items-center gap-2 bg-saffron-500/20 border border-saffron-500/30 text-saffron-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            Our Story
          </div>
          <h1 className="display text-5xl md:text-7xl font-bold text-white leading-[0.9] mb-6">
            We hated moving. <br />
            <span className="grad-saffron">So we fixed it.</span>
          </h1>
          <p className="text-lg md:text-xl text-midnight-300 max-w-2xl leading-relaxed">
            ShiftIndia is India's most trusted packers & movers marketplace — built by people who got burned by the industry and decided enough was enough.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/booking" className="btn btn-primary btn-lg">
              Get a Free Quote <ArrowRight size={18} />
            </Link>
            <a href={`tel:${CONTACT.phone}`} className="btn bg-white/10 border border-white/20 text-white hover:bg-white/20 transition btn-lg">
              <Phone size={16} /> Talk to Us
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-saffron-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center text-white">
                  <div className="text-4xl font-extrabold">{s.value}</div>
                  <div className="text-sm font-semibold text-white/80 mt-1 flex items-center justify-center gap-1.5">
                    <Icon size={13} /> {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-saffron-500 mb-3">Our Mission</div>
            <h2 className="display text-4xl font-bold text-midnight-900 leading-tight mb-5">
              Make every move in India stress-free, transparent, and safe.
            </h2>
            <p className="text-midnight-500 leading-relaxed mb-4">
              The Indian relocation industry is a ₹40,000 crore market plagued by opaque pricing, unverified vendors, and zero consumer protection. We're changing that.
            </p>
            <p className="text-midnight-500 leading-relaxed">
              By building the infrastructure layer between customers and vendors — verified listings, transparent quotes, escrow payments, and live tracking — we're creating a market where quality wins.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card p-5">
                  <div className="w-10 h-10 rounded-xl bg-midnight-900 text-white grid place-items-center mb-3">
                    <Icon size={18} />
                  </div>
                  <div className="font-bold text-midnight-900 mb-1">{v.title}</div>
                  <p className="text-xs text-midnight-500 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="bg-cream-50 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-saffron-500 mb-3">Journey</div>
            <h2 className="display text-4xl font-bold text-midnight-900">How we got here</h2>
          </div>
          <div className="relative">
            <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-cream-200" />
            <div className="space-y-10">
              {timeline.map((t, i) => (
                <div key={t.year} className="flex items-start gap-6 relative">
                  <div className={`w-14 h-14 rounded-2xl shrink-0 grid place-items-center font-extrabold text-sm z-10 ${
                    i === timeline.length - 1
                      ? "bg-saffron-500 text-white"
                      : "bg-midnight-900 text-white"
                  }`}>
                    {t.year}
                  </div>
                  <div className="pt-1">
                    <div className="font-bold text-midnight-900 text-lg">{t.title}</div>
                    <p className="text-midnight-500 text-sm mt-1 leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-widest text-saffron-500 mb-3">The Team</div>
          <h2 className="display text-4xl font-bold text-midnight-900">Built by people who care</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m) => (
            <div key={m.name} className="card p-6 text-center">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.gradient} text-white grid place-items-center text-xl font-extrabold mx-auto mb-4`}>
                {m.initials}
              </div>
              <div className="font-bold text-midnight-900">{m.name}</div>
              <div className="text-xs text-saffron-600 font-semibold mt-0.5 mb-3">{m.role}</div>
              <p className="text-xs text-midnight-500 leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section className="bg-midnight-900 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="display text-4xl font-bold text-white mb-4">Want to get in touch?</h2>
          <p className="text-midnight-300 mb-8">Whether you're a customer, vendor, investor, or journalist — we'd love to hear from you.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-500 text-white font-bold hover:bg-saffron-600 transition">
              <Mail size={16} /> Contact Us
            </Link>
            <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition">
              <Mail size={16} /> {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition">
              <Phone size={16} /> {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
