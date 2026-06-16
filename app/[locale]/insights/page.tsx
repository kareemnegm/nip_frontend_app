import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { CatalogHeroSection } from "@/components/sections/CatalogHeroSection";
import { ApiPagination, CatalogEmptyState, InsightCard } from "@/components/ui";
import { InsightCategoryFilters } from "@/components/ui/InsightCategoryFilters";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { getBlogCategories, getBlogs } from "@/lib/api/blogs";
import { cn } from "@/lib/cn";
import { localizedHref, resolveLocale } from "@/lib/i18n/helpers";
import { mapBlogToInsightCard } from "@/lib/mappers/blog";

export const metadata: Metadata = {
  title: "Insights | NIP Reality",
  description:
    "Considered perspective on the communities, projects and policy shaping long-term value across Dubai.",
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function InsightsPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const sp = await searchParams;
  const page = sp.page ? Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) : 1;
  const category = Array.isArray(sp.category) ? sp.category[0] : sp.category;

  const [{ data, meta }, categories] = await Promise.all([
    getBlogs({ page, per_page: 9, category }),
    getBlogCategories(),
  ]);

  const insights = data.map((blog) => mapBlogToInsightCard(blog, locale));
  const featured = insights[0];

  return (
    <SiteShell>
      <CatalogHeroSection
        page="insights"
        locale={locale}
        placeholders={{
          eyebrow: "INSIGHTS | MARKET PERSPECTIVE",
          title: "Insight & Intelligence",
          description:
            "Considered perspective on the communities, projects and policy shaping long-term value across Dubai.",
        }}
        innerClassName="space-y-6"
      >
        <InsightCategoryFilters
          categories={categories.map((item) => ({
            label: item.name,
            slug: item.slug,
          }))}
          activeCategory={category}
        />
      </CatalogHeroSection>

      <section className="bg-white pb-[72px] pt-10">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={cn(sitePageInnerClassName, "space-y-14")}>
            {featured ? (
              <Link
                href={featured.href}
                className="grid gap-6 overflow-hidden rounded-[var(--radius-card)] border border-line bg-sapphire-50 shadow-[var(--shadow-card)] lg:grid-cols-2"
              >
                <div className="min-h-[280px] bg-basalt-100 lg:min-h-[360px]" />
                <div className="flex flex-col justify-center p-8 lg:p-10">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
                    Featured | {featured.category}
                  </p>
                  <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-body-md leading-[22px] text-ink-secondary">
                    {featured.excerpt}
                  </p>
                </div>
              </Link>
            ) : null}

            <div className="space-y-8">
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                Latest
              </p>

              {insights.length === 0 ? (
                <CatalogEmptyState message="Insights will appear here once articles are published." />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {insights.map((insight) => (
                    <InsightCard key={insight.href} className="min-h-[440px]" {...insight} />
                  ))}
                </div>
              )}

              <ApiPagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                basePath={localizedHref(locale, "/insights")}
                query={category ? { category } : undefined}
              />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
