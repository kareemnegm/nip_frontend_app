import type { InsightCardProps } from "@/components/ui/Cards";
import { InsightCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { CatalogEmptyState } from "@/components/ui/ApiPagination";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

export async function FeaturedInsightSection({
  insights = [],
}: {
  insights?: InsightCardProps[];
}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          title="Featured Insight"
          description="A closer look at the signals, locations, and ownership decisions shaping Dubai's next chapter."
          editable={{
            relUrl: homeEditable.relUrl,
            titleKey: homeEditable.featuredInsight.titleKey,
            descKey: homeEditable.featuredInsight.descKey,
          }}
        />
        {insights.length === 0 ? (
          <CatalogEmptyState message="Insights will appear here once articles are published." />
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
