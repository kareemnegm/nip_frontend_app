import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { curatedProperties } from "./home-data";
import { SectionHeading } from "./SectionHeading";

export function CuratedCollectionSection() {
  return (
    <section className="bg-sapphire-50 py-16 sm:py-20 lg:py-24">
      <Container className="space-y-10 lg:space-y-12">
        <SectionHeading
          title="Curated Collection"
          description="A refined selection of residences chosen for location, quality, and long-term value across Dubai's most sought-after communities."
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {curatedProperties.map((property, index) => (
            <PropertyCard key={`curated-${index}`} {...property} />
          ))}
        </div>
        <div className="flex justify-center pt-2">
          <Button href="/properties" size="lg">
            Explore the Collection
          </Button>
        </div>
      </Container>
    </section>
  );
}
