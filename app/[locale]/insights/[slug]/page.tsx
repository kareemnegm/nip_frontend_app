import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import {
  InsightArticleAdvisoryCta,
  InsightArticleBody,
  InsightArticleFeaturedImage,
  InsightArticleHero,
  RelatedInsightsSection,
} from "@/components/sections/InsightArticleSections";
import { getBlogBySlug, getBlogs } from "@/lib/api/blogs";
import { resolveBlogFeaturedImage } from "@/lib/api/media-url";
import { resolveLocale } from "@/lib/i18n/helpers";
import {
  formatBlogReadTime,
  mapBlogToInsightCard,
  resolveBlogAuthor,
  resolveBlogExcerpt,
} from "@/lib/mappers/blog";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const blog = await getBlogBySlug(slug, locale);
  if (!blog) return { title: "Insight | NIP Reality" };

  const title = `${blog.title} | NIP Reality`;
  const description = resolveBlogExcerpt(blog) || blog.content?.slice(0, 160);
  const keywords = [
    blog.title,
    blog.category?.name,
    "Dubai real estate",
    "NIP Reality",
  ]
    .filter(Boolean)
    .join(", ");
  const ogImageUrl = resolveBlogFeaturedImage(blog);
  const ogImages = ogImageUrl
    ? [{ url: ogImageUrl, width: 1200, height: 630, alt: blog.title }]
    : undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "article",
      ...(ogImages && { images: ogImages }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

export default async function InsightArticlePage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const blog = await getBlogBySlug(slug, locale);
  if (!blog) notFound();

  const related = await getBlogs({ per_page: 3, category: blog.category?.slug, locale });
  const relatedCards = related.data
    .filter((item) => item.slug !== slug)
    .slice(0, 3)
    .map((item) => mapBlogToInsightCard(item, locale));

  const body = blog.body ?? blog.source_code ?? blog.content ?? "";
  const featuredImage = resolveBlogFeaturedImage(blog);
  const t = await getTranslations({ locale, namespace: "pages.insights" });

  return (
    <SiteShell>
      <article className="w-full bg-white">
        <InsightArticleHero
          locale={locale}
          category={blog.category?.name ?? "Insight"}
          title={blog.title}
          excerpt={resolveBlogExcerpt(blog)}
          author={resolveBlogAuthor(blog)}
          publishedAt={blog.created_at}
          readTime={formatBlogReadTime(blog.read_time)}
        />

        <InsightArticleFeaturedImage
          src={featuredImage}
          alt={blog.title}
        />

        <InsightArticleBody html={body} />
        <InsightArticleAdvisoryCta locale={locale} />
      </article>

      {relatedCards.length > 0 ? (
        <RelatedInsightsSection title={t("relatedTitle")} cards={relatedCards} />
      ) : null}
    </SiteShell>
  );
}
