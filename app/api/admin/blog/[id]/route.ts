import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const post = await prisma.blogPost.findUnique({ where: { id: Number(params.id) } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ post });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.blogPost.findUnique({ where: { id: Number(params.id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const title = body.title?.toString().trim();
  const content = body.content?.toString().trim();
  const excerpt = body.excerpt?.toString().trim() || null;
  const coverImage = body.coverImage?.toString().trim() || null;
  const author = body.author?.toString().trim() || existing.author;
  const status: "draft" | "published" = body.status === "published" ? "published" : "draft";

  // SEO fields
  const metaTitle = body.metaTitle?.toString().trim() || null;
  const metaDescription = body.metaDescription?.toString().trim() || null;
  const metaKeywords = body.metaKeywords?.toString().trim() || null;
  const focusKeyword = body.focusKeyword?.toString().trim() || null;
  const ogImage = body.ogImage?.toString().trim() || null;
  const canonicalUrl = body.canonicalUrl?.toString().trim() || null;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const wasPublished = existing.status === "published";
  const nowPublished = status === "published";

  const post = await prisma.blogPost.update({
    where: { id: Number(params.id) },
    data: {
      title, content, excerpt, coverImage, author, status,
      metaTitle, metaDescription, metaKeywords, focusKeyword, ogImage, canonicalUrl,
      publishedAt: nowPublished && !wasPublished ? new Date() : existing.publishedAt,
    },
  });

  return NextResponse.json({ post });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.blogPost.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
