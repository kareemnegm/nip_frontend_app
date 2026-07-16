import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { resolveBlogFeaturedImage } from "@/lib/api/media-url";
import type { ApiBlog } from "@/types/api";

export type InsightCardModel = {
  category: string;
  title: string;
  excerpt: string;
  readTime?: string;
  author?: string;
  href: string;
  imageUrl?: string;
};

const DEFAULT_AUTHOR = "NIP Advisory";

export function resolveBlogAuthor(blog: ApiBlog): string {
  return blog.author ?? blog.author_name ?? DEFAULT_AUTHOR;
}

export function formatBlogReadTime(
  readTime: ApiBlog["read_time"],
): string {
  if (readTime == null || readTime === "") return "";
  if (typeof readTime === "number") return `${readTime} min read`;
  if (/\bmin\b/i.test(readTime)) return readTime;
  const parsed = Number.parseInt(String(readTime), 10);
  if (!Number.isNaN(parsed)) return `${parsed} min read`;
  return String(readTime);
}

/** Truncated summary for cards/meta tags — never shown as full body copy. */
export function resolveBlogExcerpt(blog: ApiBlog): string {
  if (blog.excerpt?.trim()) return blog.excerpt.trim();
  const raw = blog.body ?? blog.content ?? blog.source_code ?? "";
  const text = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > 200 ? `${text.slice(0, 200).trimEnd()}…` : text;
}

/**
 * Full, untruncated lead paragraph for the article page itself.
 * Only returns the author-written excerpt as-is — never a cut-off fragment
 * of the body, since that would show fake/incomplete text to readers.
 */
export function resolveBlogLeadParagraph(blog: ApiBlog): string {
  return blog.excerpt?.trim() ?? "";
}

export function mapBlogToInsightCard(
  blog: ApiBlog,
  locale: Locale,
): InsightCardModel {
  return {
    category: blog.category?.name ?? "Insight",
    title: blog.title,
    excerpt: resolveBlogExcerpt(blog),
    readTime: formatBlogReadTime(blog.read_time) || "5 min read",
    author: resolveBlogAuthor(blog),
    href: localizedHref(locale, `/insights/${blog.slug}`),
    imageUrl: resolveBlogFeaturedImage(blog),
  };
}
