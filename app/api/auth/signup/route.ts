import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_TTL_MS,
  signCustomerSession,
} from "@/lib/customer-auth";
import { hashPassword } from "@/lib/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name?.toString().trim();
    const phone = body.phone?.toString().trim();
    const email = body.email?.toString().trim() || null;
    const password = body.password?.toString();

    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: "Name, phone and password are required" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    if (!/^[0-9+\-\s]{7,20}$/.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number" },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);

    const customer = await prisma.customer.create({
      data: { name, phone, email, passwordHash },
    });

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
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        const target = (err.meta?.target as string[] | undefined)?.join(", ") || "phone";
        return NextResponse.json(
          { error: `An account with this ${target} already exists` },
          { status: 409 }
        );
      }
    }
    console.error("POST /api/auth/signup error:", err);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
