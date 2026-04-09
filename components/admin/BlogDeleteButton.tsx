"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function BlogDeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => setConfirming(false)}
          className="text-xs px-2 py-1 rounded-lg bg-midnight-50 text-midnight-600 hover:bg-midnight-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          {loading ? "..." : "Delete"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 grid place-items-center transition"
      title="Delete"
    >
      <Trash2 size={14} />
    </button>
  );
}
