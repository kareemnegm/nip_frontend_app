import { Button } from "@/components/ui/Button";
import type { PropertyCardProps } from "@/components/ui/Cards";
import { PropertyCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { CatalogEmptyState } from "@/components/ui/ApiPagination";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

export async function CuratedCollectionSection({
  properties = [],
}: {
  properties?: PropertyCardProps[];
}) {
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
        {properties.length === 0 ? (
          <CatalogEmptyState message="Curated listings will appear here once areas and properties are published." />
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            {properties.map((property, index) => (
              <PropertyCard key={property.href ?? `curated-${index}`} className="min-h-[480px]" {...property} />
            ))}
          </div>
        )}
        <div className="flex justify-center">
          <Button href="/properties" size="lg" className="h-9">
            Explore the Collection
          </Button>
        </div>
      </Container>
    </section>
  );
}
