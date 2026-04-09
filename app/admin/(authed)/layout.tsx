import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";
import { LayoutDashboard, Inbox, ShieldCheck, BookOpen } from "lucide-react";

export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Admin top bar */}
      <div className="bg-midnight-900 text-white border-b border-midnight-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 text-sm font-bold">
              <ShieldCheck size={16} className="text-saffron-500" />
              <span className="display">ShiftIndia Admin</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              <AdminLink href="/admin" label="Overview" icon={<LayoutDashboard size={14} />} />
              <AdminLink href="/admin/inquiries" label="Inquiries" icon={<Inbox size={14} />} />
              <AdminLink href="/admin/blog" label="Blog" icon={<BookOpen size={14} />} />
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-midnight-200">
              Signed in as <strong className="text-white">{session.email}</strong>
            </span>
            <LogoutButton />
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}

function AdminLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-midnight-200 hover:bg-midnight-700 hover:text-white transition"
    >
      {icon}
      {label}
    </Link>
  );
}
