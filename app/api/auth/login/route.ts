import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_TTL_MS,
  signCustomerSession,
} from "@/lib/customer-auth";
import { verifyPassword } from "@/lib/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = body.phone?.toString().trim();
    const password = body.password?.toString();

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Phone and password are required" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({ where: { phone } });
    if (!customer || !verifyPassword(password, customer.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid phone or password" },
        { status: 401 }
      );
    }

    const token = await signCustomerSession(customer.id, customer.phone);

    cookies().set(CUSTOMER_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(CUSTOMER_SESSION_TTL_MS / 1000),
    });

    return NextResponse.json({
      success: true,
      customer: { id: customer.id, name: customer.name, phone: customer.phone, email: customer.email },
    });
  } catch (err) {
    console.error("POST /api/auth/login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
