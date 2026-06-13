import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { curatedProperties } from "./home-data";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

export async function CuratedCollectionSection() {
  return (
    <section className="bg-sapphire-50 py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          title="Curated Collection"
          description="A considered selection of properties, projects, and places connected by a clear point of view - not a search filter."
          editable={{
            relUrl: homeEditable.relUrl,
            titleKey: homeEditable.curatedCollection.titleKey,
            descKey: homeEditable.curatedCollection.descKey,
          }}
        />
        <div className="grid gap-6 xl:grid-cols-3">
          {curatedProperties.map((property, index) => (
            <PropertyCard key={`curated-${index}`} className="min-h-[480px]" {...property} />
          ))}
        </div>
        <div className="flex justify-center">
          <Button href="/properties" size="lg" className="h-9">
            Explore the Collection
          </Button>
        </div>
      </Container>
    </section>
  );
}
