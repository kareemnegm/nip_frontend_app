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
import { mapBlogToInsightCard } from "@/lib/mappers/blog";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const blog = await getBlogBySlug(slug, locale);
  if (!blog) return { title: "Insight | NIP Reality" };
  return {
    title: `${blog.title} | NIP Reality`,
    description: blog.excerpt ?? blog.content?.slice(0, 160),
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
          excerpt={blog.excerpt}
          author={blog.author_name}
          publishedAt={blog.created_at}
          readTime={blog.read_time}
        />

        {featuredImage ? (
          <InsightArticleFeaturedImage src={featuredImage} alt={blog.title} />
        ) : null}

        <InsightArticleBody html={body} />
        <InsightArticleAdvisoryCta locale={locale} />
      </article>

      {relatedCards.length > 0 ? (
        <RelatedInsightsSection title={t("relatedTitle")} cards={relatedCards} />
      ) : null}
    </SiteShell>
  );
}
