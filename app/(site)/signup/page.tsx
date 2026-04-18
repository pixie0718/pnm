"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Phone, Mail, User, Loader2, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email: email || undefined, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed");
      router.push("/account");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Sign up failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 hero-mesh grain relative">
      <div className="absolute top-20 right-0 w-[400px] h-[400px] dot-grid opacity-50 pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold mb-6">
            <Image src="/logopnm_bg.png" alt="राधे Packers and Movers" width={200} height={40} className="h-10 w-auto" />
          </Link>
          <div className="eyebrow justify-center mb-3">
            <span className="w-8 h-px bg-saffron-500"></span>
            Create account
            <span className="w-8 h-px bg-saffron-500"></span>
          </div>
          <h1 className="display text-2xl font-bold text-midnight-900">
            Join <span className="grad-saffron">Radhe Packers and Movers</span>
          </h1>
          <p className="text-midnight-500 mt-2">
            Track your moves and manage bookings in one place
          </p>
        </div>

        <form onSubmit={onSubmit} className="card p-8 space-y-5">
          <div>
            <label className="label">Full name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-300" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Sharma"
                className="input !pl-11"
              />
            </div>
          </div>

          <div>
            <label className="label">Phone number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-300" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="input !pl-11"
              />
            </div>
          </div>

          <div>
            <label className="label">Email <span className="text-midnight-400 font-normal">(optional)</span></label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input !pl-11"
              />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-300" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="input !pl-11"
              />
            </div>
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
              <><Loader2 size={16} className="animate-spin" /> Creating...</>
            ) : (
              <>Create account <ArrowRight size={16} /></>
            )}
          </button>

          <div className="text-xs text-midnight-500 flex items-center gap-2 justify-center pt-2 border-t border-midnight-100">
            Already have an account?{" "}
            <Link href="/login" className="text-saffron-600 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
