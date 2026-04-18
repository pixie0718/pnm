"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Phone, Mail, MessageCircle, Send, Loader2, CheckCircle } from "lucide-react";
import { CONTACT } from "@/lib/config";

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pickupCity: "",
    pickupAddress: "",
    dropCity: "",
    dropAddress: "",
    houseSize: "1 BHK",
    movingDate: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "contact_page",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit inquiry");

      setSubmitted(true);
      setForm({
        name: "",
        phone: "",
        email: "",
        pickupCity: "",
        pickupAddress: "",
        dropCity: "",
        dropAddress: "",
        houseSize: "1 BHK",
        movingDate: "",
        notes: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit inquiry");
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 hero-mesh">
        <div className="max-w-md w-full text-center">
          <div className="card p-12">
            <div className="w-16 h-16 rounded-full bg-mint-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-mint-500" />
            </div>
            <h2 className="display text-2xl font-bold text-midnight-900 mb-3">
              Inquiry Submitted!
            </h2>
            <p className="text-midnight-500 mb-6">
              Thank you for contacting us. Our team will review your inquiry and get back to you within 2 hours.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/booking"
                className="btn btn-primary w-full"
              >
                Get Another Quote
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="btn btn-ghost w-full"
              >
                Submit Another Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div className="bg-midnight-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="eyebrow !text-white/60 mb-4 justify-center">
            <span className="w-8 h-px bg-white/40"></span>
            Get In Touch
            <span className="w-8 h-px bg-white/40"></span>
          </div>
          <h1 className="display text-5xl md:text-6xl font-bold leading-[0.95]">
            Contact <span className="grad-saffron">Us</span>
          </h1>
          <p className="mt-5 text-lg text-white/70 max-w-xl mx-auto">
            Have questions? Fill out the form below or reach out directly. We're here to help!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          {/* Contact Form */}
          <div>
            <div className="card p-8">
              <h2 className="display text-2xl font-bold text-midnight-900 mb-6">
                Send Us an Inquiry
              </h2>

              <form onSubmit={onSubmit} className="space-y-5">
                {/* Personal Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Email <span className="text-midnight-400 font-normal">(optional)</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="input"
                  />
                </div>

                {/* Moving Details */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Pickup City *</label>
                    <input
                      type="text"
                      required
                      value={form.pickupCity}
                      onChange={(e) => setForm({ ...form, pickupCity: e.target.value })}
                      placeholder="e.g., Mumbai"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Drop City *</label>
                    <input
                      type="text"
                      required
                      value={form.dropCity}
                      onChange={(e) => setForm({ ...form, dropCity: e.target.value })}
                      placeholder="e.g., Delhi"
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Pickup Address</label>
                  <textarea
                    rows={2}
                    value={form.pickupAddress}
                    onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                    placeholder="Full pickup address"
                    className="input resize-none"
                  />
                </div>

                <div>
                  <label className="label">Drop Address</label>
                  <textarea
                    rows={2}
                    value={form.dropAddress}
                    onChange={(e) => setForm({ ...form, dropAddress: e.target.value })}
                    placeholder="Full drop address"
                    className="input resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">House Size *</label>
                    <select
                      value={form.houseSize}
                      onChange={(e) => setForm({ ...form, houseSize: e.target.value })}
                      className="input"
                    >
                      <option>1 BHK</option>
                      <option>2 BHK</option>
                      <option>3 BHK</option>
                      <option>4+ BHK</option>
                      <option>1 RK</option>
                      <option>Office</option>
                      <option>Warehouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Moving Date</label>
                    <input
                      type="date"
                      value={form.movingDate}
                      onChange={(e) => setForm({ ...form, movingDate: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Additional Notes</label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Any special requirements, fragile items, floor details, etc."
                    className="input resize-none"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded-xl p-3">
                    ⚠ {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full btn-lg disabled:opacity-70"
                >
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                  ) : (
                    <><Send size={16} /> Submit Inquiry</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact Cards */}
            <div className="card p-6">
              <h3 className="font-bold text-midnight-900 mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-cream-100 hover:bg-cream-200 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-saffron-500 text-white grid place-items-center">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-midnight-500">Call Us</p>
                    <p className="font-semibold text-midnight-900">{CONTACT.phoneDisplay}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=Hi%2C%20I%20need%20help%20with%20my%20move`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-cream-100 hover:bg-cream-200 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366] text-white grid place-items-center">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-midnight-500">WhatsApp</p>
                    <p className="font-semibold text-midnight-900">Chat with us</p>
                  </div>
                </a>

                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-cream-100 hover:bg-cream-200 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-midnight-900 text-white grid place-items-center">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-midnight-500">Email</p>
                    <p className="font-semibold text-midnight-900 text-sm">{CONTACT.email}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Query Form */}
            <QuickQueryForm />

            {/* Working Hours */}
            <div className="card p-6">
              <h3 className="font-bold text-midnight-900 mb-3">Working Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-midnight-500">Monday - Saturday</span>
                  <span className="font-semibold">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-midnight-500">Sunday</span>
                  <span className="font-semibold">10:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Quick Query Form Component */
function QuickQueryForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Submit as quick inquiry
    fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        notes: form.message,
        source: "quick_query",
        pickupCity: "N/A",
        dropCity: "N/A",
        houseSize: "N/A",
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setSent(true);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  if (sent) {
    return (
      <div className="card p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-mint-500/10 flex items-center justify-center mx-auto mb-3">
          <Send size={20} className="text-mint-500" />
        </div>
        <p className="font-bold text-midnight-900 mb-1">Message sent!</p>
        <p className="text-xs text-midnight-500">We'll call you back within 10 minutes.</p>
        <button
          onClick={() => { setSent(false); setForm({ name: "", phone: "", message: "" }); }}
          className="mt-4 text-xs font-semibold text-saffron-500 hover:text-saffron-600 transition"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="font-bold text-midnight-900 mb-3">Quick Query</h3>
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your name"
          className="input text-sm py-2"
        />
        <input
          required
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone number"
          className="input text-sm py-2"
        />
        <textarea
          rows={2}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Your message..."
          className="input text-sm py-2 resize-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-sm rounded-xl py-2.5 transition disabled:opacity-70"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          Send Message
        </button>
      </form>
    </div>
  );
}
