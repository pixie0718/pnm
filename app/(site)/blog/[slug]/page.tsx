import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords,
    alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.ogImage ? [post.ogImage] : post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });

  if (!post || post.status !== "published") notFound();

  const related = await prisma.blogPost.findMany({
    where: { status: "published", NOT: { slug: params.slug } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, publishedAt: true, createdAt: true },
  });

  return (
    <div className="min-h-[80vh] bg-cream-50">
      {/* Cover */}
      {post.coverImage && (
        <div className="h-80 md:h-[420px] relative overflow-hidden bg-midnight-900">
          <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/80 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-midnight-500 hover:text-midnight-900 mb-8 transition">
          <ArrowLeft size={16} /> All Posts
        </Link>

        {/* Header */}
        <div className="card p-8 md:p-12 mb-8">
          <div className="flex items-center gap-4 text-sm text-midnight-500 mb-5 flex-wrap">
            <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <h1 className="display text-3xl md:text-5xl font-bold text-midnight-900 leading-[1.05]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 text-lg text-midnight-600 leading-relaxed border-l-4 border-saffron-400 pl-4">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="card p-8 md:p-12 mb-10">
          <div
            className="prose prose-midnight max-w-none prose-headings:font-bold prose-headings:text-midnight-900 prose-p:text-midnight-700 prose-p:leading-relaxed prose-a:text-saffron-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-midnight-900 prose-li:text-midnight-700 prose-h2:text-2xl prose-h3:text-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div>
            <div className="eyebrow mb-5">
              <span className="w-8 h-px bg-saffron-500"></span>
              More Articles
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group card overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative bg-midnight-800 h-36 overflow-hidden">
                    {r.coverImage ? (
                      <img src={r.coverImage} alt={r.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-saffron-500/20 to-midnight-800 flex items-center justify-center">
                        <BookOpen size={28} className="text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-midnight-900 text-sm leading-snug line-clamp-2 group-hover:text-saffron-600 transition-colors">
                      {r.title}
                    </h4>
                    <span className="mt-2 text-xs text-midnight-400">
                      {new Date(r.publishedAt ?? r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
