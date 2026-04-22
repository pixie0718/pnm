"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Truck, ArrowUpRight, LogOut, LogIn,
  Home, MapPin, Map, User, Phone,
} from "lucide-react";

const links = [
  { href: "/",        label: "Home",    icon: Home,   mobileHide: false },
  { href: "/cities",  label: "Cities",  icon: MapPin, mobileHide: false },
  { href: "/states",  label: "States",  icon: Map,    mobileHide: true  },
  { href: "/booking", label: "Quote",   icon: Truck,  mobileHide: false },
  { href: "/contact", label: "Contact", icon: Phone,  mobileHide: false },
  { href: "/account", label: "Account", icon: User,   mobileHide: false },
];

type Customer = { id: number; name: string; phone: string; email: string | null };

export default function Navbar() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loaded, setLoaded] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) { setCustomer(d?.customer ?? null); setLoaded(true); }
      })
      .catch(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setCustomer(null);
    router.push("/");
    router.refresh();
  }

  const firstName = customer?.name.split(" ")[0] ?? "";
  const initials  = customer
    ? customer.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "";

  return (
    <>
      {/* ─── Top header (sticky) ─── */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center justify-between h-20 bg-white/80 backdrop-blur-xl border border-midnight-100 rounded-3xl px-3 pl-5 shadow-soft">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold">
              <Image src="/logopnm_bg.png" alt="राधे Packers and Movers" width={350} height={50} className="h-20 w-auto" />
            </Link>

            {/* Desktop nav pills */}
            <nav className="hidden md:flex items-center gap-1 bg-cream-100 rounded-full p-1">
              {links.map((l) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                      active
                        ? "bg-white text-midnight-900 shadow-soft"
                        : "text-midnight-700 hover:bg-white hover:text-midnight-900"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-2">
              {!loaded ? (
                <div className="w-24 h-9" />
              ) : customer ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 bg-cream-100 hover:bg-cream-200 rounded-full pl-1 pr-4 py-1 transition"
                  >
                    <span className="w-7 h-7 rounded-full bg-midnight-900 text-saffron-500 grid place-items-center text-xs font-bold">
                      {initials}
                    </span>
                    <span className="text-sm font-semibold text-midnight-900">{firstName}</span>
                  </Link>
                  <button
                    onClick={logout}
                    title="Sign out"
                    className="w-9 h-9 rounded-full bg-cream-100 hover:bg-cream-200 grid place-items-center text-midnight-700 transition"
                  >
                    <LogOut size={15} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-semibold text-midnight-700 hover:text-midnight-900 px-3">
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="group inline-flex items-center gap-1.5 bg-midnight-900 text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-saffron-500 transition"
                  >
                    Sign Up
                    <ArrowUpRight size={15} className="group-hover:rotate-45 transition" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile: compact auth in top bar */}
            <div className="md:hidden flex items-center">
              {!loaded ? null : customer ? (
                <Link
                  href="/account"
                  className="w-9 h-9 rounded-full bg-midnight-900 text-saffron-500 grid place-items-center text-xs font-bold"
                >
                  {initials}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 bg-midnight-900 text-white rounded-full px-4 py-2 text-xs font-bold"
                >
                  <LogIn size={13} /> Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile bottom tab bar ─── */}
      <nav
        aria-label="Main navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-midnight-100"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-end">
          {links.filter((l) => !l.mobileHide).map((l) => {
            const Icon   = l.icon;
            const isQuote  = l.href === "/booking";
            const isActive = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);

            if (isQuote) {
              return (
                <Link key={l.href} href={l.href} className="flex-1 flex flex-col items-center pb-2">
                  <span
                    className="w-12 h-12 rounded-2xl bg-saffron-500 text-white grid place-items-center -translate-y-3 border-[3px] border-white"
                    style={{ boxShadow: "0 8px 24px -6px rgba(20,184,166,0.55)" }}
                  >
                    <Icon size={22} />
                  </span>
                  <span className="text-[10px] font-bold text-saffron-500 leading-none -mt-1">
                    {l.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={l.href}
                href={l.href}
                className="flex-1 flex flex-col items-center gap-0.5 pt-2 pb-2"
              >
                <Icon size={22} className={isActive ? "text-saffron-500" : "text-midnight-400"} />
                <span
                  className={`text-[10px] font-semibold leading-none ${
                    isActive ? "text-saffron-500" : "text-midnight-400"
                  }`}
                >
                  {l.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
