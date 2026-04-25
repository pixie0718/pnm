"use client";
import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, Loader2, ShieldCheck, ArrowRight } from "lucide-react";

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const from = sp.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
    <div className="min-h-screen flex items-center justify-center px-4 py-16 hero-mesh grain relative">
      <div className="absolute top-20 right-0 w-[400px] h-[400px] dot-grid opacity-50 pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex mb-6">
            <Image
              src="/logopnm_bg.png"
              alt="Radhe Packers and Movers"
              width={200}
              height={60}
              className="h-14 w-auto object-contain"
            />
          </Link>
          <div className="eyebrow justify-center mb-3">
            <span className="w-8 h-px bg-saffron-500"></span>
            Admin Access
            <span className="w-8 h-px bg-saffron-500"></span>
          </div>
          <h1 className="display text-4xl font-bold text-midnight-900">
            Welcome <span className="grad-saffron">back</span>
          </h1>
          <p className="text-midnight-500 mt-2">
            Sign in to manage inquiries and quotes
          </p>
        </div>

        <form onSubmit={onSubmit} className="card p-8 space-y-5">
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-300"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hopeshruu@gmail.com"
                className="input !pl-11"
              />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-300"
              />
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
              <>
                <Loader2 size={16} className="animate-spin" /> Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight size={16} />
              </>
            )}
          </button>

          <div className="text-xs text-midnight-500 flex items-center gap-2 justify-center pt-2 border-t border-midnight-100">
            <ShieldCheck size={14} className="text-mint-500" />
            Secured with HMAC session cookies
          </div>
        </form>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] grid place-items-center">Loading...</div>}>
      <LoginInner />
    </Suspense>
  );
}
