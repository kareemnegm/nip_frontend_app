import type { InsightCardProps } from "@/components/ui/Cards";
import { InsightCard } from "@/components/ui/Cards";
import { CardCarousel } from "@/components/ui/CardCarousel";
import { Container } from "@/components/ui/Container";
import { CatalogEmptyState } from "@/components/ui/ApiPagination";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import { getTranslations } from "next-intl/server";
import { homeEditable } from "./home-editable";
import type { SectionCms } from "./section-cms";
import { toSectionHeadingEditable } from "./section-cms";
import { SectionHeading } from "./SectionHeading";

const defaultCms: SectionCms = {
  relUrl: homeEditable.relUrl,
  titleKey: homeEditable.featuredInsight.titleKey,
  descKey: homeEditable.featuredInsight.descKey,
};

export async function FeaturedInsightSection({
  insights = [],
  cms = defaultCms,
  placeholderNamespace = "placeholders.home.featuredInsight",
}: {
  insights?: InsightCardProps[];
  cms?: SectionCms;
  placeholderNamespace?: string;
}) {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "home.empty" });

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          title={await getCmsPlaceholder(placeholderNamespace, "title", locale)}
          description={await getCmsPlaceholder(placeholderNamespace, "desc", locale)}
          descriptionMaxWidth="max-w-[400px]"
          editable={toSectionHeadingEditable(cms)}
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
          hoverEdgeScroll
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
