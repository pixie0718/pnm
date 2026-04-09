import { redirect, notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/BlogForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  const post = await prisma.blogPost.findUnique({ where: { id: Number(params.id) } });
  if (!post) notFound();

  return (
    <BlogForm
      initial={{
        id: post.id,
        title: post.title,
        excerpt: post.excerpt ?? "",
        content: post.content,
        coverImage: post.coverImage ?? "",
        author: post.author,
        status: post.status,
        metaTitle: post.metaTitle ?? "",
        metaDescription: post.metaDescription ?? "",
        metaKeywords: post.metaKeywords ?? "",
        focusKeyword: post.focusKeyword ?? "",
        ogImage: post.ogImage ?? "",
        canonicalUrl: post.canonicalUrl ?? "",
      }}
    />
  );
}
