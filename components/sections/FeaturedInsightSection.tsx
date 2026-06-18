import type { InsightCardProps } from "@/components/ui/Cards";
import { InsightCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { CatalogEmptyState } from "@/components/ui/ApiPagination";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import { getTranslations } from "next-intl/server";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

export async function FeaturedInsightSection({
  insights = [],
}: {
  insights?: InsightCardProps[];
}) {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "home.empty" });

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          title={await getCmsPlaceholder("placeholders.home.featuredInsight", "title", locale)}
          description={await getCmsPlaceholder("placeholders.home.featuredInsight", "desc", locale)}
          editable={{
            relUrl: homeEditable.relUrl,
            titleKey: homeEditable.featuredInsight.titleKey,
            descKey: homeEditable.featuredInsight.descKey,
          }}
        />
        {insights.length === 0 ? (
          <CatalogEmptyState message={t("insights")} />
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            {insights.map((insight, index) => (
              <InsightCard
                key={insight.href ?? `${insight.title}-${index}`}
                className="min-h-[440px]"
                {...insight}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
