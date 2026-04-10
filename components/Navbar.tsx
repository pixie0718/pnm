"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Truck, ArrowUpRight, LogOut } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/cities", label: "Cities" },
  { href: "/booking", label: "Get Quote" },
  { href: "/tracking", label: "Track" },
  { href: "/account", label: "My Account" },
];

type Customer = { id: number; name: string; phone: string; email: string | null };

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setCustomer(d?.customer ?? null);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setCustomer(null);
    router.push("/");
    router.refresh();
  }

  const firstName = customer?.name.split(" ")[0] ?? "";
  const initials = customer
    ? customer.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between h-14 bg-white/80 backdrop-blur-xl border border-midnight-100 rounded-full px-3 pl-5 shadow-soft">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="relative w-8 h-8 rounded-full bg-midnight-900 text-saffron-500 grid place-items-center">
              <Truck size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-saffron-500 animate-ping-slow"></span>
            </span>
            <span className="display text-midnight-900 text-lg">ShiftIndia</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-cream-100 rounded-full p-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-midnight-700 hover:bg-white hover:text-midnight-900 transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>

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

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-2 bg-white border border-midnight-100 rounded-3xl p-4 space-y-1 shadow-soft">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 px-3 text-midnight-700 font-medium rounded-xl hover:bg-cream-100"
              >
                {l.label}
              </Link>
            ))}
            {customer ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 border-t border-midnight-100 mt-2 pt-4">
                  <span className="w-9 h-9 rounded-full bg-midnight-900 text-saffron-500 grid place-items-center text-xs font-bold">
                    {initials}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-midnight-900">{customer.name}</div>
                    <div className="text-xs text-midnight-500">{customer.phone}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 py-3 px-3 text-midnight-700 font-medium rounded-xl hover:bg-cream-100"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="block py-3 px-3 text-midnight-700 font-medium rounded-xl hover:bg-cream-100">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="btn btn-primary w-full mt-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
