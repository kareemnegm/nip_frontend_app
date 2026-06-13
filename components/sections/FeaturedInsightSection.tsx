import { InsightCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { featuredInsights } from "./home-data";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

export async function FeaturedInsightSection() {
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
        <div className="grid gap-6 xl:grid-cols-3">
          {featuredInsights.map((insight, index) => (
            <InsightCard
              key={`${insight.title}-${index}`}
              className="min-h-[440px]"
              {...insight}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
