import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { QuoteStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

/** PATCH /api/quotes/:id — update status (send/accept/reject) */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = await req.json();
    const allowed: QuoteStatus[] = ["draft", "sent", "accepted", "rejected"];
    if (body.status && !allowed.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.quote.update({
      where: { id },
      data: {
        status: body.status,
        sentAt: body.status === "sent" ? new Date() : undefined,
      },
    });

    if (body.status === "sent") {
      await prisma.inquiry.update({
        where: { id: updated.inquiryId },
        data: { status: "quoted" },
      });
    }

    return NextResponse.json({ success: true, quote: updated });
  } catch (err) {
    console.error("PATCH /api/quotes/:id error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

/** DELETE /api/quotes/:id */
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await prisma.quote.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/quotes/:id error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
