import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customer-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const session = await getCurrentCustomer();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const name = body.name?.toString().trim();
  const email = body.email?.toString().trim() || null;

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Check email uniqueness if changed
  if (email) {
    const existing = await prisma.customer.findFirst({
      where: { email, NOT: { id: session.customerId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
  }

  const updated = await prisma.customer.update({
    where: { id: session.customerId },
    data: { name, email },
    select: { id: true, name: true, phone: true, email: true },
  });

  return NextResponse.json({ customer: updated });
}
