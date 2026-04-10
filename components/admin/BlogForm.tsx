"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Search, Globe, Tag, Link2, List } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import { parseHeadings } from "@/lib/toc";

type Post = {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  status: "draft" | "published";
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  focusKeyword: string;
  ogImage: string;
  canonicalUrl: string;
};

const inputCls =
  "w-full px-4 py-3 rounded-2xl border border-midnight-200 bg-white text-midnight-900 placeholder:text-midnight-400 focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/20 transition text-sm";

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const pct = (len / max) * 100;
  const color = pct > 100 ? "text-red-500" : pct > 85 ? "text-amber-500" : "text-mint-600";
  return (
    <span className={`text-xs font-semibold ${color}`}>
      {len}/{max}
    </span>
  );
}

function SerpPreview({ title, description, slug }: { title: string; description: string; slug: string }) {
  const displayTitle = title || "Your blog post title";
  const displayDesc = description || "Your meta description will appear here. Write a compelling summary to improve click-through rates from search results.";
  const displayUrl = `shiftindia.in › blog › ${slug || "your-post-slug"}`;

  return (
    <div className="rounded-2xl border border-midnight-100 bg-white p-5">
      <div className="flex items-center gap-2 mb-3">
        <Search size={14} className="text-midnight-400" />
        <span className="text-xs font-semibold text-midnight-500 uppercase tracking-wider">Google Search Preview</span>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4 max-w-xl">
        <div className="text-xs text-midnight-400 mb-1 truncate">{displayUrl}</div>
        <div className="text-blue-600 text-lg font-medium leading-snug hover:underline cursor-pointer truncate">
          {displayTitle.length > 60 ? displayTitle.slice(0, 60) + "..." : displayTitle}
        </div>
        <div className="text-sm text-midnight-600 mt-1 leading-relaxed line-clamp-2">
          {displayDesc.length > 160 ? displayDesc.slice(0, 160) + "..." : displayDesc}
        </div>
      </div>
    </div>
  );
}

export default function BlogForm({ initial }: { initial?: Partial<Post> }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<Post>({
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    coverImage: initial?.coverImage ?? "",
    author: initial?.author ?? "Admin",
    status: initial?.status ?? "draft",
    metaTitle: initial?.metaTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
    metaKeywords: initial?.metaKeywords ?? "",
    focusKeyword: initial?.focusKeyword ?? "",
    ogImage: initial?.ogImage ?? "",
    canonicalUrl: initial?.canonicalUrl ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof Post, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Auto-fill SEO from title/excerpt if empty
  function autoFillSeo() {
    setForm((f) => ({
      ...f,
      metaTitle: f.metaTitle || f.title.slice(0, 60),
      metaDescription: f.metaDescription || f.excerpt.slice(0, 160),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = isEdit ? `/api/admin/blog/${initial!.id}` : "/api/admin/blog";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    let data: any = {};
    try { data = await res.json(); } catch {}

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
    } else {
      router.push("/admin/blog");
      router.refresh();
    }
  }

  const serpTitle = form.metaTitle || form.title;
  const serpDesc = form.metaDescription || form.excerpt;
  const slugPreview = form.title
    .toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm text-midnight-500 hover:text-midnight-900 mb-8 transition">
        <ArrowLeft size={16} /> Back to Blog
      </Link>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="display text-3xl font-bold text-midnight-900">
          {isEdit ? "Edit Post" : "New Blog Post"}
        </h1>
        <div className="flex items-center gap-2">
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className="text-sm rounded-xl border border-midnight-200 px-3 py-2 bg-white text-midnight-900 focus:outline-none focus:border-saffron-400"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button form="blog-form" type="submit" disabled={saving} className="btn btn-primary">
            {saving
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Save size={15} /> {isEdit ? "Update" : "Publish"}</>
            }
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-6">
          {error}
        </p>
      )}

      <form id="blog-form" onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN: Content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title */}
            <div className="card p-6">
              <label className="block text-sm font-semibold text-midnight-700 mb-2">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
                placeholder="Enter blog post title..."
                className="w-full px-4 py-3 rounded-2xl border border-midnight-200 bg-white text-midnight-900 placeholder:text-midnight-400 focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/20 transition text-lg font-semibold"
              />
            </div>

            {/* Excerpt */}
            <div className="card p-6">
              <label className="block text-sm font-semibold text-midnight-700 mb-2">
                Excerpt <span className="text-midnight-400 font-normal">(used in blog listing cards)</span>
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={3}
                placeholder="A brief summary of the post..."
                className={inputCls + " resize-none"}
              />
            </div>

            {/* Content */}
            <div className="card p-6">
              <label className="block text-sm font-semibold text-midnight-700 mb-2">Content *</label>
              <textarea
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                required
                rows={20}
                placeholder="Write your blog post content here..."
                className={inputCls + " resize-y font-mono leading-relaxed"}
              />
              <p className="text-xs text-midnight-400 mt-2">HTML is supported — use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;a&gt; etc.</p>
            </div>

            {/* ── SEO SECTION ── */}
            <div className="card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-saffron-500/10 text-saffron-600 grid place-items-center">
                    <Search size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-midnight-900 text-sm">SEO Settings</h3>
                    <p className="text-xs text-midnight-500">Control how this post appears in search engines</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={autoFillSeo}
                  className="text-xs text-saffron-600 hover:text-saffron-700 font-semibold border border-saffron-200 hover:border-saffron-400 px-3 py-1.5 rounded-xl transition"
                >
                  Auto-fill from content
                </button>
              </div>

              {/* Focus Keyword */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-midnight-700 flex items-center gap-1.5">
                    <Tag size={13} /> Focus Keyword
                  </label>
                  <span className="text-xs text-midnight-400">Used to check SEO score</span>
                </div>
                <input
                  type="text"
                  value={form.focusKeyword}
                  onChange={(e) => set("focusKeyword", e.target.value)}
                  placeholder="e.g. packers and movers Delhi"
                  className={inputCls}
                />
                {form.focusKeyword && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      { label: "In title", ok: form.title.toLowerCase().includes(form.focusKeyword.toLowerCase()) },
                      { label: "In meta desc", ok: form.metaDescription.toLowerCase().includes(form.focusKeyword.toLowerCase()) },
                      { label: "In content", ok: form.content.toLowerCase().includes(form.focusKeyword.toLowerCase()) },
                      { label: "In excerpt", ok: form.excerpt.toLowerCase().includes(form.focusKeyword.toLowerCase()) },
                    ].map(({ label, ok }) => (
                      <span key={label} className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${ok ? "bg-mint-500/10 text-mint-700 border border-mint-500/20" : "bg-midnight-50 text-midnight-400 border border-midnight-100"}`}>
                        {ok ? "✓" : "✗"} {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-midnight-700">Meta Title</label>
                  <CharCount value={form.metaTitle} max={60} />
                </div>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => set("metaTitle", e.target.value)}
                  maxLength={60}
                  placeholder={form.title || "SEO title (max 60 chars)"}
                  className={inputCls}
                />
                <p className="text-xs text-midnight-400 mt-1">Leave empty to use the post title</p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-midnight-700">Meta Description</label>
                  <CharCount value={form.metaDescription} max={160} />
                </div>
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => set("metaDescription", e.target.value)}
                  maxLength={160}
                  rows={3}
                  placeholder={form.excerpt || "Compelling description for search results (max 160 chars)"}
                  className={inputCls + " resize-none"}
                />
                <div className="mt-2 h-1.5 rounded-full bg-midnight-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${form.metaDescription.length > 160 ? "bg-red-500" : form.metaDescription.length > 130 ? "bg-amber-500" : "bg-mint-500"}`}
                    style={{ width: `${Math.min((form.metaDescription.length / 160) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="block text-sm font-semibold text-midnight-700 mb-2 flex items-center gap-1.5">
                  <Tag size={13} /> Meta Keywords
                </label>
                <input
                  type="text"
                  value={form.metaKeywords}
                  onChange={(e) => set("metaKeywords", e.target.value)}
                  placeholder="packers movers, relocation, house shifting (comma separated)"
                  className={inputCls}
                />
                {form.metaKeywords && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.metaKeywords.split(",").map((kw) => kw.trim()).filter(Boolean).map((kw) => (
                      <span key={kw} className="text-xs bg-saffron-500/10 text-saffron-700 border border-saffron-500/20 px-2 py-0.5 rounded-full">{kw}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* SERP Preview */}
              <SerpPreview title={serpTitle} description={serpDesc} slug={slugPreview} />
            </div>

            {/* ── OG / Social ── */}
            <div className="card p-6 space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 grid place-items-center">
                  <Globe size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-midnight-900 text-sm">Social & Advanced</h3>
                  <p className="text-xs text-midnight-500">Open Graph image, canonical URL</p>
                </div>
              </div>

              <ImageUpload
                value={form.ogImage}
                onChange={(url) => set("ogImage", url)}
                label="OG Image"
                hint="shown when shared on WhatsApp, Twitter etc."
                aspectHint="1200×630 recommended"
              />

              <div>
                <label className="block text-sm font-semibold text-midnight-700 mb-2 flex items-center gap-1.5">
                  <Link2 size={13} /> Canonical URL
                  <span className="text-midnight-400 font-normal">(optional, leave empty unless duplicating content)</span>
                </label>
                <input
                  type="url"
                  value={form.canonicalUrl}
                  onChange={(e) => set("canonicalUrl", e.target.value)}
                  placeholder="https://shiftindia.in/blog/original-post"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Post settings ── */}
          <div className="space-y-6">

            {/* Publish card */}
            <div className="card p-5 space-y-4">
              <h3 className="font-bold text-midnight-900 text-sm">Publish</h3>
              <div>
                <label className="block text-xs font-semibold text-midnight-500 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className="w-full text-sm rounded-xl border border-midnight-200 px-3 py-2.5 bg-white text-midnight-900 focus:outline-none focus:border-saffron-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <button type="submit" form="blog-form" disabled={saving} className="btn btn-primary w-full">
                {saving
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><Save size={15} /> {isEdit ? "Save Changes" : "Publish Post"}</>
                }
              </button>
              <Link href="/admin/blog" className="btn btn-ghost w-full text-sm">Cancel</Link>
            </div>

            {/* Author & Cover */}
            <div className="card p-5 space-y-4">
              <h3 className="font-bold text-midnight-900 text-sm">Post Details</h3>
              <div>
                <label className="block text-xs font-semibold text-midnight-500 uppercase tracking-wider mb-1.5">Author</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                  placeholder="Admin"
                  className={inputCls}
                />
              </div>
              <ImageUpload
                value={form.coverImage}
                onChange={(url) => set("coverImage", url)}
                label="Cover Image"
                aspectHint="1280×720 recommended"
              />
            </div>

            {/* TOC Preview */}
            {(() => {
              const toc = parseHeadings(form.content);
              return (
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <List size={15} className="text-saffron-500" />
                    <h3 className="font-bold text-midnight-900 text-sm">Table of Contents</h3>
                    {toc.length > 0 && (
                      <span className="ml-auto text-xs text-midnight-400">{toc.length} heading{toc.length > 1 ? "s" : ""}</span>
                    )}
                  </div>
                  {toc.length === 0 ? (
                    <p className="text-xs text-midnight-400 italic">
                      Add &lt;h2&gt;, &lt;h3&gt;, or &lt;h4&gt; headings in your content to auto-generate a TOC.
                    </p>
                  ) : (
                    <ol className="space-y-1.5">
                      {toc.map((item) => (
                        <li
                          key={item.id}
                          style={{ paddingLeft: item.level === 2 ? 0 : item.level === 3 ? "0.875rem" : "1.75rem" }}
                          className="flex items-start gap-1.5"
                        >
                          <span className="text-xs text-midnight-300 font-mono mt-0.5 shrink-0">
                            H{item.level}
                          </span>
                          <span className="text-xs text-midnight-700 leading-snug break-words">
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                  {toc.length > 0 && (
                    <p className="text-xs text-midnight-400 mt-3 pt-3 border-t border-midnight-100">
                      Edit headings in your content to update the TOC.
                    </p>
                  )}
                </div>
              );
            })()}

            {/* SEO score pill */}
            {form.focusKeyword && (
              <div className="card p-5">
                <h3 className="font-bold text-midnight-900 text-sm mb-3">SEO Score</h3>
                {(() => {
                  const checks = [
                    form.title.toLowerCase().includes(form.focusKeyword.toLowerCase()),
                    form.metaDescription.toLowerCase().includes(form.focusKeyword.toLowerCase()),
                    form.content.toLowerCase().includes(form.focusKeyword.toLowerCase()),
                    form.excerpt.toLowerCase().includes(form.focusKeyword.toLowerCase()),
                    form.metaTitle.length > 0,
                    form.metaDescription.length >= 50,
                    form.coverImage.length > 0,
                    form.metaKeywords.length > 0,
                  ];
                  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
                  const color = score >= 80 ? "text-mint-600" : score >= 50 ? "text-amber-600" : "text-red-500";
                  const bg = score >= 80 ? "bg-mint-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";
                  return (
                    <>
                      <div className={`text-4xl font-bold display ${color}`}>{score}<span className="text-lg">%</span></div>
                      <div className="mt-2 h-2 rounded-full bg-midnight-100 overflow-hidden">
                        <div className={`h-full rounded-full ${bg} transition-all`} style={{ width: `${score}%` }} />
                      </div>
                      <p className="text-xs text-midnight-500 mt-2">
                        {score >= 80 ? "Great SEO!" : score >= 50 ? "Needs improvement" : "Poor SEO — fill in more fields"}
                      </p>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
