import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import { CatalogHeroSection } from "@/components/sections/CatalogHeroSection";
import {
  ApiPagination,
  CatalogEmptyState,
  FeaturedInsightCard,
  InsightCard,
} from "@/components/ui";
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
  const gridInsights = featured ? insights.slice(1) : insights;

  return (
    <SiteShell>
      <CatalogHeroSection
        page="insights"
        locale={locale}
        className="bg-white pt-[72px] pb-10"
        descriptionClassName="max-w-[640px] text-body-sm text-ink-secondary sm:text-body-lg"
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

      {featured ? (
        <section className="bg-white pb-10">
          <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
            <div className={sitePageInnerClassName}>
              <FeaturedInsightCard
                {...featured}
                featuredPrefix={t("featuredPrefix")}
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white pb-20 pt-6">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={cn(sitePageInnerClassName, "flex flex-col gap-7")}>
            <p className="text-center text-overline font-semibold text-accent">
              {t("latest")}
            </p>

            {insights.length === 0 ? (
              <CatalogEmptyState message={te("insights")} />
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {gridInsights.map((insight) => (
                  <InsightCard key={insight.href} className="min-h-[440px]" {...insight} />
                ))}
              </div>
            )}

            <ApiPagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              basePath={localizedHref(locale, "/insights")}
              query={category ? { category } : undefined}
              className="justify-center pt-4"
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
