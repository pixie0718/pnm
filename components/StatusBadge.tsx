type Status = "new" | "contacted" | "quoted" | "booked" | "cancelled";

const styles: Record<Status, string> = {
  new: "bg-saffron-500/10 text-saffron-600 border-saffron-500/30",
  contacted: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  quoted: "bg-mint-500/10 text-mint-600 border-mint-500/30",
  booked: "bg-midnight-900 text-white border-midnight-900",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/30",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${styles[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
}
