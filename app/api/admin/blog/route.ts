import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, slug: true, status: true,
      author: true, publishedAt: true, createdAt: true, excerpt: true,
    },
  });

  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const title = body.title?.toString().trim();
  const content = body.content?.toString().trim();
  const excerpt = body.excerpt?.toString().trim() || null;
  const coverImage = body.coverImage?.toString().trim() || null;
  const author = body.author?.toString().trim() || "Admin";
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

  let slug = slugify(title);
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const post = await prisma.blogPost.create({
    data: {
      title, slug, content, excerpt, coverImage, author, status,
      metaTitle, metaDescription, metaKeywords, focusKeyword, ogImage, canonicalUrl,
      publishedAt: status === "published" ? new Date() : null,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
