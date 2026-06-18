import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
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
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { localizedHref, resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";
import { mapBlogToInsightCard } from "@/lib/mappers/blog";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "insights");
}

export default async function InsightsPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const sp = await searchParams;
  const page = sp.page ? Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) : 1;
  const category = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const t = await getTranslations({ locale, namespace: "pages.insights" });
  const te = await getTranslations({ locale, namespace: "home.empty" });

  const [{ data, meta }, categories] = await Promise.all([
    getBlogs({ page, per_page: 9, category, locale }),
    getBlogCategories(locale),
  ]);

  const insights = data.map((blog) => mapBlogToInsightCard(blog, locale));
  const featured = insights[0];

  return (
    <SiteShell>
      <CatalogHeroSection
        page="insights"
        locale={locale}
        placeholders={{
          eyebrow: await getCmsPlaceholder("placeholders.insights.hero", "eyebrow", locale),
          title: await getCmsPlaceholder("placeholders.insights.hero", "title", locale),
          description: await getCmsPlaceholder("placeholders.insights.hero", "description", locale),
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
                {featured.imageUrl ? (
                  <div className="relative min-h-[280px] lg:min-h-[360px]">
                    <Image
                      src={featured.imageUrl}
                      alt={featured.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="min-h-[280px] bg-basalt-100 lg:min-h-[360px]" />
                )}
                <div className="flex flex-col justify-center p-8 lg:p-10">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
                    {t("featuredPrefix")} | {featured.category}
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
                {t("latest")}
              </p>

              {insights.length === 0 ? (
                <CatalogEmptyState message={te("insights")} />
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
