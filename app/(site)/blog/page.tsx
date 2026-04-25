import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "Moving Tips & Guides",
  description: "Moving tips, guides, and insights from India's most trusted packers & movers. Learn about safe and efficient relocation.",
  alternates: {
    canonical: "https://radhepackersandmovers.com/blog",
  },
  openGraph: {
    title: "Moving Tips & Guides | Radhe Packers and Movers",
    description: "Moving tips, guides, and insights from India's most trusted packers & movers. Learn about safe and efficient relocation.",
    url: "https://radhepackersandmovers.com/blog",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moving Tips & Guides | Radhe Packers and Movers",
    description: "Moving tips, guides, and insights from India's most trusted packers & movers.",
    images: ["/og-image.jpg"],
  },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true, title: true, slug: true, excerpt: true,
      coverImage: true, author: true, publishedAt: true, createdAt: true,
    },
  });

  return (
    <div className="min-h-[80vh] bg-cream-50">
      {/* Hero */}
      <div className="bg-midnight-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="eyebrow !text-white/60 mb-4 justify-center">
            <span className="w-8 h-px bg-white/40"></span>
            Our Blog
          </div>
          <h1 className="display text-5xl md:text-6xl font-bold leading-[0.95]">
            Moving <span className="grad-saffron">Tips & Guides</span>
          </h1>
          <p className="mt-5 text-lg text-white/70 max-w-xl mx-auto">
            Everything you need to know about relocating in India — from packing hacks to city guides.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={48} className="mx-auto text-midnight-300 mb-4" />
            <p className="text-midnight-500 font-medium text-lg">No posts published yet.</p>
            <p className="text-midnight-400 text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {posts[0] && (
              <Link href={`/blog/${posts[0].slug}`} className="group block card overflow-hidden mb-10 hover:shadow-lg transition-shadow">
                <div className="grid md:grid-cols-2">
                  <div className="bg-midnight-800 relative overflow-hidden min-h-[280px]">
                    {posts[0].coverImage ? (
                      <img
                        src={posts[0].coverImage}
                        alt={posts[0].title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-saffron-500/30 to-midnight-800 flex items-center justify-center">
                        <BookOpen size={64} className="text-white/20" />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 text-xs font-bold bg-saffron-500 text-white px-3 py-1 rounded-full">Featured</span>
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs text-midnight-500 mb-4">
                      <span className="flex items-center gap-1"><User size={12} /> {posts[0].author}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(posts[0].publishedAt ?? posts[0].createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <h2 className="display text-2xl md:text-3xl font-bold text-midnight-900 leading-snug group-hover:text-saffron-600 transition-colors">
                      {posts[0].title}
                    </h2>
                    {posts[0].excerpt && (
                      <p className="mt-3 text-midnight-600 leading-relaxed line-clamp-3">{posts[0].excerpt}</p>
                    )}
                    <span className="mt-6 inline-flex items-center gap-2 text-saffron-600 font-semibold text-sm group-hover:gap-3 transition-all">
                      Read Article <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of posts */}
            {posts.length > 1 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(1).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group card overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                  >
                    <div className="relative overflow-hidden bg-midnight-800 h-48">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-saffron-500/20 to-midnight-800 flex items-center justify-center">
                          <BookOpen size={40} className="text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-midnight-400 mb-3">
                        <span className="flex items-center gap-1"><User size={11} /> {post.author}</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <h3 className="display text-lg font-bold text-midnight-900 leading-snug group-hover:text-saffron-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-2 text-sm text-midnight-500 leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1.5 text-saffron-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                        Read more <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
