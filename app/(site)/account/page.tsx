import { redirect } from "next/navigation";
import Link from "next/link";
import { Inbox, MapPin, Calendar, Home as HomeIcon, Phone, Mail, LogOut, Truck, ArrowRight } from "lucide-react";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";
import CustomerLogoutButton from "@/components/CustomerLogoutButton";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getCurrentCustomer();
  if (!session) redirect("/login?from=/account");

  const customer = await prisma.customer.findUnique({
    where: { id: session.customerId },
  });

  if (!customer) redirect("/login");

  // Backfill: any orphan inquiries matching this customer's phone
  // (e.g. submitted as a guest before signup) get linked now.
  await prisma.inquiry.updateMany({
    where: { phone: customer.phone, customerId: null },
    data: { customerId: customer.id },
  });

  const inquiries = await prisma.inquiry.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
    include: { quotes: { orderBy: { createdAt: "desc" } } },
  });

  return (
    <div className="min-h-[80vh] bg-cream-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header card */}
        <div className="card p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-saffron-500/10 rounded-full blur-3xl"></div>
          <div className="relative flex items-start justify-between flex-wrap gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-saffron-500 to-saffron-600 text-white grid place-items-center shadow-glow">
                <span className="display text-3xl font-bold">
                  {customer.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                </span>
              </div>
              <div>
                <div className="eyebrow mb-2">
                  <span className="w-8 h-px bg-saffron-500"></span>
                  My Account
                </div>
                <h1 className="display text-3xl md:text-4xl font-bold text-midnight-900">
                  Hey, {customer.name.split(" ")[0]} 👋
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-midnight-500 flex-wrap">
                  <span className="flex items-center gap-1.5"><Phone size={14} /> {customer.phone}</span>
                  {customer.email && (
                    <span className="flex items-center gap-1.5"><Mail size={14} /> {customer.email}</span>
                  )}
                </div>
              </div>
            </div>
            <CustomerLogoutButton />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-5">
            <div className="text-xs text-midnight-500 font-semibold uppercase tracking-wider">Total Inquiries</div>
            <div className="display text-3xl font-bold text-midnight-900 mt-1">{inquiries.length}</div>
          </div>
          <div className="card p-5">
            <div className="text-xs text-midnight-500 font-semibold uppercase tracking-wider">Quoted</div>
            <div className="display text-3xl font-bold text-midnight-900 mt-1">
              {inquiries.filter((i) => i.status === "quoted").length}
            </div>
          </div>
          <div className="card p-5">
            <div className="text-xs text-midnight-500 font-semibold uppercase tracking-wider">Booked</div>
            <div className="display text-3xl font-bold text-midnight-900 mt-1">
              {inquiries.filter((i) => i.status === "booked").length}
            </div>
          </div>
        </div>

        {/* Inquiries */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="eyebrow mb-2">
                <span className="w-8 h-px bg-saffron-500"></span>
                Your Moves
              </div>
              <h2 className="display text-2xl font-bold text-midnight-900">Inquiries & quotes</h2>
            </div>
            <Link href="/" className="btn btn-primary">
              <Truck size={16} /> New inquiry
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-midnight-100 rounded-3xl">
              <Inbox size={42} className="mx-auto text-midnight-300" />
              <p className="mt-4 text-midnight-500 font-medium">No inquiries yet</p>
              <Link href="/" className="btn btn-primary mt-5">
                Get your first quote <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((i) => (
                <div key={i.id} className="border border-midnight-100 rounded-2xl p-5 hover:shadow-soft transition">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-midnight-500">#INQ-{i.id.toString().padStart(4, "0")}</span>
                        <StatusBadge status={i.status} />
                      </div>
                      <div className="display text-lg font-bold text-midnight-900 flex items-center gap-2">
                        <MapPin size={16} className="text-saffron-500" />
                        {i.pickupCity} → {i.dropCity}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-midnight-500 flex-wrap">
                        <span className="flex items-center gap-1.5"><HomeIcon size={13} /> {i.houseSize}</span>
                        {i.movingDate && (
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} />
                            {new Date(i.movingDate).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </span>
                        )}
                        <span className="text-xs">
                          Created {new Date(i.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {i.quotes.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-midnight-100">
                      <div className="text-xs font-semibold text-midnight-500 uppercase tracking-wider mb-2">
                        {i.quotes.length} Quote{i.quotes.length > 1 ? "s" : ""}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {i.quotes.map((q) => (
                          <div key={q.id} className="bg-cream-100 rounded-xl p-3 text-sm">
                            <div className="font-bold text-midnight-900">{q.vendorName}</div>
                            <div className="text-saffron-600 font-bold">
                              ₹{q.priceLow.toLocaleString()} – ₹{q.priceHigh.toLocaleString()}
                            </div>
                            {q.eta && <div className="text-xs text-midnight-500">ETA: {q.eta}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
