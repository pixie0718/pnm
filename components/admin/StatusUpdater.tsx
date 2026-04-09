"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Status = "new" | "contacted" | "quoted" | "booked" | "cancelled";

const options: Status[] = ["new", "contacted", "quoted", "booked", "cancelled"];

export default function StatusUpdater({
  id,
  current,
}: {
  id: number;
  current: Status;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<Status>(current);

  async function update(next: Status) {
    setValue(next);
    setLoading(true);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      setValue(current);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-midnight-500 font-bold uppercase">Status</label>
      <select
        value={value}
        onChange={(e) => update(e.target.value as Status)}
        disabled={loading}
        className="input !w-auto !py-2 text-sm font-semibold"
      >
        {options.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {loading && <Loader2 size={14} className="animate-spin text-midnight-500" />}
    </div>
  );
}
