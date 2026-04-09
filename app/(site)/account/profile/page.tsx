"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, User, Mail, Phone } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/customer/profile/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.customer) {
          setForm({
            name: data.customer.name ?? "",
            email: data.customer.email ?? "",
            phone: data.customer.phone ?? "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/customer/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/account"), 1200);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-cream-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <Link href="/account" className="inline-flex items-center gap-2 text-sm text-midnight-500 hover:text-midnight-900 mb-8 transition">
          <ArrowLeft size={16} /> Back to Account
        </Link>

        <div className="card p-8">
          <div className="eyebrow mb-3">
            <span className="w-8 h-px bg-saffron-500"></span>
            Profile
          </div>
          <h1 className="display text-3xl font-bold text-midnight-900 mb-8">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-midnight-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  minLength={2}
                  placeholder="Your full name"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-midnight-200 bg-white text-midnight-900 placeholder:text-midnight-400 focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/20 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-midnight-700 mb-2">
                Email Address <span className="text-midnight-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-midnight-200 bg-white text-midnight-900 placeholder:text-midnight-400 focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/20 transition"
                />
              </div>
            </div>

            {/* Phone (read-only) */}
            <div>
              <label className="block text-sm font-semibold text-midnight-700 mb-2">
                Phone Number <span className="text-midnight-400 font-normal">(cannot be changed)</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-400" />
                <input
                  type="text"
                  value={form.phone}
                  disabled
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-midnight-100 bg-midnight-50 text-midnight-400 cursor-not-allowed"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-mint-700 bg-mint-50 border border-mint-200 rounded-2xl px-4 py-3">
                Profile updated! Redirecting...
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-lg w-full"
            >
              {saving ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Save size={16} /> Save Changes</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
