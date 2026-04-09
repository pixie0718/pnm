import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, Pencil, Trash2, Eye, FileText } from "lucide-react";
import BlogDeleteButton from "@/components/admin/BlogDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, slug: true, status: true,
      author: true, publishedAt: true, createdAt: true, excerpt: true,
    },
  });

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="text-xs text-midnight-500 uppercase tracking-wide font-semibold mb-1">Content</div>
          <h1 className="display text-3xl font-bold text-midnight-900">Blog Posts</h1>
        </div>
        <Link href="/admin/blog/new" className="btn btn-primary">
          <Plus size={16} /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <div className="text-xs text-midnight-500 font-semibold uppercase tracking-wider">Total</div>
          <div className="display text-3xl font-bold text-midnight-900 mt-1">{posts.length}</div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-midnight-500 font-semibold uppercase tracking-wider">Published</div>
          <div className="display text-3xl font-bold text-mint-600 mt-1">{published}</div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-midnight-500 font-semibold uppercase tracking-wider">Drafts</div>
          <div className="display text-3xl font-bold text-saffron-600 mt-1">{drafts}</div>
        </div>
      </div>

      {/* Posts table */}
      <div className="card overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={40} className="mx-auto text-midnight-300 mb-4" />
            <p className="text-midnight-500 font-medium">No blog posts yet</p>
            <Link href="/admin/blog/new" className="btn btn-primary mt-5 inline-flex">
              <Plus size={16} /> Write your first post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-midnight-500 border-b border-midnight-100 bg-cream-50">
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Author</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-midnight-50 hover:bg-cream-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-midnight-900 max-w-xs truncate">{post.title}</div>
                      {post.excerpt && (
                        <div className="text-xs text-midnight-400 mt-0.5 max-w-xs truncate">{post.excerpt}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-midnight-600">{post.author}</td>
                    <td className="px-6 py-4">
                      {post.status === "published" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-mint-700 bg-mint-500/10 border border-mint-500/20 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-mint-500"></span> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-700 bg-saffron-500/10 border border-saffron-500/20 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-saffron-500"></span> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-midnight-500 text-xs">
                      {new Date(post.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        {post.status === "published" && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-xl bg-midnight-50 text-midnight-600 hover:bg-midnight-100 grid place-items-center transition"
                            title="View live"
                          >
                            <Eye size={14} />
                          </a>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="w-8 h-8 rounded-xl bg-saffron-50 text-saffron-600 hover:bg-saffron-100 grid place-items-center transition"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </Link>
                        <BlogDeleteButton id={post.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
