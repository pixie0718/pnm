import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InquiryStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

/** GET /api/inquiries/:id — get one inquiry with quotes */
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { quotes: { orderBy: { createdAt: "desc" } } },
  });

  if (!inquiry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, inquiry });
}

/** PATCH /api/inquiries/:id — update status */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = await req.json();
    const allowed: InquiryStatus[] = ["new", "contacted", "quoted", "booked", "cancelled"];
    if (body.status && !allowed.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: {
        status: body.status,
        notes: body.notes,
      },
    });
    return NextResponse.json({ success: true, inquiry: updated });
  } catch (err) {
    console.error("PATCH /api/inquiries/:id error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

/** DELETE /api/inquiries/:id */
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await prisma.inquiry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/inquiries/:id error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
