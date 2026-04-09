"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send, Save } from "lucide-react";

export default function QuoteForm({ inquiryId }: { inquiryId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"draft" | "sent" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    vendorName: "",
    priceLow: "",
    priceHigh: "",
    eta: "1-2 days",
    notes: "",
  });

  async function submit(e: FormEvent, send: boolean) {
    e.preventDefault();
    setError(null);
    setLoading(send ? "sent" : "draft");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId,
          vendorName: form.vendorName,
          priceLow: Number(form.priceLow),
          priceHigh: Number(form.priceHigh),
          eta: form.eta,
          notes: form.notes,
          send,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setForm({ vendorName: "", priceLow: "", priceHigh: "", eta: "1-2 days", notes: "" });
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setLoading(null);
    }
  }

  return (
    <form className="card p-6">
      <h3 className="display text-xl font-bold text-midnight-900 mb-4">Add Quote</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Vendor name</label>
          <input
            className="input"
            required
            value={form.vendorName}
            onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
            placeholder="e.g. SafeMove Logistics"
          />
        </div>
        <div>
          <label className="label">Price low (₹)</label>
          <input
            className="input"
            type="number"
            required
            value={form.priceLow}
            onChange={(e) => setForm({ ...form, priceLow: e.target.value })}
            placeholder="15000"
          />
        </div>
        <div>
          <label className="label">Price high (₹)</label>
          <input
            className="input"
            type="number"
            required
            value={form.priceHigh}
            onChange={(e) => setForm({ ...form, priceHigh: e.target.value })}
            placeholder="18000"
          />
        </div>
        <div>
          <label className="label">ETA</label>
          <input
            className="input"
            value={form.eta}
            onChange={(e) => setForm({ ...form, eta: e.target.value })}
            placeholder="1-2 days"
          />
        </div>
        <div>
          <label className="label">Notes (optional)</label>
          <input
            className="input"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Includes packing & insurance"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 font-medium">⚠ {error}</p>
      )}

      <div className="mt-5 flex gap-3 flex-wrap">
        <button
          onClick={(e) => submit(e, false)}
          disabled={loading !== null}
          className="btn btn-ghost text-sm"
        >
          {loading === "draft" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save as Draft
        </button>
        <button
          onClick={(e) => submit(e, true)}
          disabled={loading !== null}
          className="btn btn-primary text-sm"
        >
          {loading === "sent" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          Send to Customer
        </button>
      </div>
    </form>
  );
}
