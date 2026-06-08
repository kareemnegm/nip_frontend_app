import { InsightCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { featuredInsights } from "./home-data";
import { SectionHeading } from "./SectionHeading";

export function FeaturedInsightSection() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <Container className="space-y-10 lg:space-y-12">
        <SectionHeading
          title="Featured Insight"
          description="Curated market intelligence and advisory perspectives to help you move with clarity before the market moves."
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {featuredInsights.map((insight, index) => (
            <InsightCard key={`${insight.title}-${index}`} {...insight} />
          ))}
        </div>
      </Container>
    </section>
  );
}
