import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** POST /api/quotes — create a quote against an inquiry */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.inquiryId || !body.vendorName || !body.priceLow || !body.priceHigh) {
      return NextResponse.json(
        { error: "inquiryId, vendorName, priceLow, priceHigh are required" },
        { status: 400 }
      );
    }

    const inquiryId = Number(body.inquiryId);
    const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const send = body.send === true;

    const quote = await prisma.quote.create({
      data: {
        inquiryId,
        vendorName: String(body.vendorName).trim(),
        priceLow: Number(body.priceLow),
        priceHigh: Number(body.priceHigh),
        eta: body.eta ? String(body.eta).trim() : null,
        features: body.features ?? null,
        notes: body.notes ? String(body.notes).trim() : null,
        status: send ? "sent" : "draft",
        sentAt: send ? new Date() : null,
      },
    });

    if (send) {
      await prisma.inquiry.update({
        where: { id: inquiryId },
        data: { status: "quoted" },
      });
    }

    return NextResponse.json({ success: true, quote }, { status: 201 });
  } catch (err) {
    console.error("POST /api/quotes error:", err);
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
  }
}

/** GET /api/quotes?inquiryId=123 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const inquiryId = searchParams.get("inquiryId");

    const quotes = await prisma.quote.findMany({
      where: inquiryId ? { inquiryId: Number(inquiryId) } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, count: quotes.length, quotes });
  } catch (err) {
    console.error("GET /api/quotes error:", err);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}
