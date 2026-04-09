import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

/** PATCH /api/customer/quotes/:id — customer accepts or rejects a quote */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getCurrentCustomer();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await req.json();
  const { status } = body;

  if (status !== "accepted" && status !== "rejected") {
    return NextResponse.json({ error: "Status must be accepted or rejected" }, { status: 400 });
  }

  // Verify the quote belongs to this customer's inquiry
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { inquiry: { select: { customerId: true } } },
  });

  if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  if (quote.inquiry.customerId !== session.customerId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.quote.update({
    where: { id },
    data: { status },
  });

  // When accepted: reject all other quotes + mark inquiry as booked
  if (status === "accepted") {
    await prisma.quote.updateMany({
      where: { inquiryId: quote.inquiryId, id: { not: id } },
      data: { status: "rejected" },
    });
    await prisma.inquiry.update({
      where: { id: quote.inquiryId },
      data: { status: "booked" },
    });
  }

  return NextResponse.json({ success: true, quote: updated });
}
