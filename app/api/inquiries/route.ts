import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getCurrentCustomer } from "@/lib/customer-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/inquiries — create a new customer inquiry */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Required validation
    const required = ["pickupCity", "dropCity", "houseSize"] as const;
    for (const f of required) {
      if (!body[f] || typeof body[f] !== "string") {
        return NextResponse.json(
          { error: `Missing required field: ${f}` },
          { status: 400 }
        );
      }
    }

    // If customer is signed in, auto-link the inquiry to their account
    const session = await getCurrentCustomer();
    let customerId: number | null = null;
    let name = body.name?.toString().trim() || null;
    let phone = body.phone?.toString().trim() || null;
    let email = body.email?.toString().trim() || null;

    if (session) {
      const customer = await prisma.customer.findUnique({
        where: { id: session.customerId },
      });
      if (customer) {
        customerId = customer.id;
        name = name || customer.name;
        phone = phone || customer.phone;
        email = email || customer.email;
      }
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        phone,
        email,
        pickupCity: body.pickupCity.toString().trim(),
        pickupAddress: body.pickupAddress?.toString().trim() || null,
        dropCity: body.dropCity.toString().trim(),
        dropAddress: body.dropAddress?.toString().trim() || null,
        houseSize: body.houseSize.toString().trim(),
        movingDate: body.movingDate ? new Date(body.movingDate) : null,
        notes: body.notes?.toString().trim() || null,
        source: body.source?.toString().trim() || "website",
        customerId,
      },
    });

    return NextResponse.json(
      { success: true, id: inquiry.id, inquiry },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/inquiries error:", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${err.code}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create inquiry" },
      { status: 500 }
    );
  }
}

/** GET /api/inquiries — list inquiries (admin) */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const take = Math.min(Number(searchParams.get("limit") || 50), 200);

    const inquiries = await prisma.inquiry.findMany({
      where: status
        ? { status: status as Prisma.InquiryWhereInput["status"] }
        : undefined,
      orderBy: { createdAt: "desc" },
      take,
      include: {
        quotes: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    console.error("GET /api/inquiries error:", err);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
