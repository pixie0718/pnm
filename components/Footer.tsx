import Link from "next/link";
import Image from "next/image";
import { Truck, Instagram, Twitter, Youtube, Linkedin, ArrowUpRight } from "lucide-react";
import { CONTACT } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-midnight-950 text-midnight-200 relative overflow-hidden mt-16 md:mt-28">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(600px 300px at 80% 0%, rgba(20,184,166,0.3), transparent)" }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        {/* Big display CTA line */}
        <div className="border-b border-midnight-700 pb-16 mb-16">
          <h2 className="display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95]">
            Ready to <span className="grad-saffron">move?</span>
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/booking" className="btn btn-primary btn-lg">
              Get Instant Quote <ArrowUpRight size={18} />
            </Link>
            <a href={`tel:${CONTACT.phone}`} className="text-white font-semibold hover:text-saffron-500 transition">
              or call {CONTACT.phoneDisplay} →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-10">
          <div className="col-span-2 sm:col-span-3 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <Image src="/white_logo.png" alt="राधे Packers and Movers" width={180} height={36} className="h-30 w-auto" />
            </Link>
            <p className="mt-5 text-sm text-midnight-300 max-w-xs leading-relaxed">
              India's most trusted packers & movers marketplace. 2.4M+ families moved. 120+ cities. One tap away.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Youtube, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-midnight-700 hover:bg-saffron-500 hover:border-saffron-500 transition grid place-items-center">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Company" links={[
            { label: "About Us", href: "/about" },
            { label: "Careers", href: "#" },
            { label: "Press", href: "#" },
            { label: "Blog", href: "/blog" },
          ]} />
          <FooterCol title="Services" links={[
            { label: "Home Shifting", href: "/booking" },
            { label: "Office Shifting", href: "/booking" },
            { label: "Vehicle Transport", href: "/booking" },
            { label: "Storage", href: "/booking" },
          ]} />
          <FooterCol title="Support" links={[
            { label: "Contact Us", href: "/contact" },
            { label: "FAQ", href: "/faq" },
            { label: "Terms & Conditions", href: "/terms" },
            { label: "Privacy Policy", href: "#" },
          ]} />
        </div>

        <div className="mt-16 pt-8 border-t border-midnight-700 flex flex-col md:flex-row items-center justify-between text-xs text-midnight-300 gap-4">
          <p>© 2026 राधे Packers and Movers. Crafted with ♥ in Bharat.</p>
          <p className="flex items-center gap-4">
            <span>Verified</span>
            <span className="w-1 h-1 rounded-full bg-midnight-500"></span>
            <span>Trusted</span>
            <span className="w-1 h-1 rounded-full bg-midnight-500"></span>
            <span>Transparent</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">{title}</h4>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="hover:text-saffron-500 transition">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
