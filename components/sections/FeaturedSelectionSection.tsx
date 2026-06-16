import type { PropertyCardProps } from "@/components/ui/Cards";
import { PropertyCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { CatalogEmptyState } from "@/components/ui/ApiPagination";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

export async function FeaturedSelectionSection({
  properties = [],
}: {
  properties?: PropertyCardProps[];
}) {
  return (
    <section className="bg-sapphire-50 py-16 sm:py-20">
      <Container className="space-y-10 xl:px-[100px]">
        <SectionHeading
          title="Featured Selection"
          description="A small selection from the current NIP view - Chosen for relevance, not volume"
          editable={{
            relUrl: homeEditable.relUrl,
            titleKey: homeEditable.featuredSelection.titleKey,
            descKey: homeEditable.featuredSelection.descKey,
          }}
        />
        {properties.length === 0 ? (
          <CatalogEmptyState message="Featured properties will appear here once published on the backend." />
        ) : (
          <div className="grid gap-2 xl:grid-cols-3">
            {properties.map((property, index) => (
              <PropertyCard key={property.href ?? `featured-${index}`} className="min-h-[480px]" {...property} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
