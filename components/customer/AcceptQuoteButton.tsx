"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";

type State = "idle" | "confirming" | "loading" | "done";

export default function AcceptQuoteButton({
  quoteId,
  vendorName,
  price,
}: {
  quoteId: number;
  vendorName: string;
  price: string;
}) {
  const router  = useRouter();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function act(status: "accepted" | "rejected") {
    setState("loading");
    setError(null);
    try {
      const res = await fetch(`/api/customer/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setState("done");
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      setState("idle");
    }
  }

  if (state === "done") return null; // page will refresh and show new status

  // CONFIRM STATE
  if (state === "confirming") {
    return (
      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
        <div className="flex items-start gap-2 flex-1">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-bold text-midnight-900">Confirm acceptance?</div>
            <div className="text-xs text-midnight-500 mt-0.5">
              You're accepting <strong>{vendorName}</strong> at <strong>{price}</strong>. Our team will contact you shortly.
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setState("idle")}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-midnight-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => act("accepted")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition"
          >
            <CheckCircle size={14} /> Yes, Accept
          </button>
        </div>
      </div>
    );
  }

  // LOADING STATE
  if (state === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-midnight-500">
        <Loader2 size={16} className="animate-spin" /> Saving…
      </div>
    );
  }

  // IDLE — show accept + reject buttons
  return (
    <div className="flex-1 flex items-center justify-between gap-3 flex-wrap w-full">
      <div>
        <div className="text-sm font-bold text-midnight-900">Interested in this quote?</div>
        <div className="text-xs text-midnight-500 mt-0.5">Accept to confirm, or decline if not interested</div>
      </div>
      {error && <p className="text-xs text-red-500 w-full">{error}</p>}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => act("rejected")}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-midnight-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition"
        >
          <XCircle size={14} /> Decline
        </button>
        <button
          onClick={() => setState("confirming")}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition"
        >
          <CheckCircle size={14} /> Accept Quote
        </button>
      </div>
    </div>
  );
}
