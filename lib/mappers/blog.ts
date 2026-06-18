import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { resolveBlogFeaturedImage } from "@/lib/api/media-url";
import type { ApiBlog } from "@/types/api";

export type InsightCardModel = {
  category: string;
  title: string;
  excerpt: string;
  readTime?: string;
  href: string;
  imageUrl?: string;
};

export function mapBlogToInsightCard(
  blog: ApiBlog,
  locale: Locale,
): InsightCardModel {
  const excerpt =
    blog.excerpt ??
    (blog.content ? blog.content.replace(/<[^>]+>/g, "").slice(0, 160) : "") ??
    "";

  return {
    category: blog.category?.name ?? "Insight",
    title: blog.title,
    excerpt,
    readTime: blog.read_time ?? "5 min read",
    href: localizedHref(locale, `/insights/${blog.slug}`),
    imageUrl: resolveBlogFeaturedImage(blog),
  };
}
