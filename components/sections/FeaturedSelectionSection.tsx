import { PropertyCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { curatedProperties } from "./home-data";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

export async function FeaturedSelectionSection() {
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
        <div className="grid gap-2 xl:grid-cols-3">
          {curatedProperties.map((property, index) => (
            <PropertyCard key={`featured-${index}`} className="min-h-[480px]" {...property} />
          ))}
        </div>
      </Container>
    </section>
  );
}
