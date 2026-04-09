import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getCurrentCustomer();
  if (!session) {
    return NextResponse.json({ customer: null });
  }
  const customer = await prisma.customer.findUnique({
    where: { id: session.customerId },
    select: { id: true, name: true, phone: true, email: true },
  });
  return NextResponse.json({ customer });
}
