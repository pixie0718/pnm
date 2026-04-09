"use client";
import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Phone, Loader2, Truck, ArrowRight, UserCircle } from "lucide-react";

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const from = sp.get("from") || "/account";

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 hero-mesh grain relative">
      <div className="absolute top-20 right-0 w-[400px] h-[400px] dot-grid opacity-50 pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold mb-6">
            <span className="w-10 h-10 rounded-full bg-midnight-900 text-saffron-500 grid place-items-center">
              <Truck size={18} />
            </span>
            <span className="display text-midnight-900 text-xl">ShiftIndia</span>
          </Link>
          <div className="eyebrow justify-center mb-3">
            <span className="w-8 h-px bg-saffron-500"></span>
            Customer sign in
            <span className="w-8 h-px bg-saffron-500"></span>
          </div>
          <h1 className="display text-4xl font-bold text-midnight-900">
            Welcome <span className="grad-saffron">back</span>
          </h1>
          <p className="text-midnight-500 mt-2">
            Track your moves, view quotes, manage bookings
          </p>
        </div>

        <form onSubmit={onSubmit} className="card p-8 space-y-5">
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
            <label className="label">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-300" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
              <><Loader2 size={16} className="animate-spin" /> Signing in...</>
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>

          <div className="text-xs text-midnight-500 flex items-center gap-2 justify-center pt-2 border-t border-midnight-100">
            <UserCircle size={14} className="text-saffron-500" />
            New here?{" "}
            <Link href="/signup" className="text-saffron-600 font-semibold hover:underline">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] grid place-items-center">Loading...</div>}>
      <LoginInner />
    </Suspense>
  );
}
