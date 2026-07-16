import type { InsightCardProps } from "@/components/ui/Cards";
import { InsightCard } from "@/components/ui/Cards";
import { CardCarousel } from "@/components/ui/CardCarousel";
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
    <section className="overflow-hidden bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          title={await getCmsPlaceholder("placeholders.home.featuredInsight", "title", locale)}
          description={await getCmsPlaceholder("placeholders.home.featuredInsight", "desc", locale)}
          descriptionMaxWidth="max-w-[400px]"
          editable={{
            relUrl: homeEditable.relUrl,
            titleKey: homeEditable.featuredInsight.titleKey,
            descKey: homeEditable.featuredInsight.descKey,
          }}
        />
      </Container>
      {insights.length === 0 ? (
        <Container className="mt-10">
          <CatalogEmptyState message={t("insights")} />
        </Container>
      ) : (
        <CardCarousel
          className="mt-10"
          fullBleed
          slideWidth={480}
          gap={24}
          snapAlign="center"
        >
          {insights.map((insight, index) => (
            <InsightCard
              key={insight.href ?? `${insight.title}-${index}`}
              {...insight}
            />
          ))}
        </CardCarousel>
      )}
    </section>
  );
}
