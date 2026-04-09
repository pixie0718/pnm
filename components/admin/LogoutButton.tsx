"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="inline-flex items-center gap-1.5 bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold rounded-full px-3 py-1.5 transition disabled:opacity-70"
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
      Logout
    </button>
  );
}
