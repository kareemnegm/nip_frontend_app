import { PropertyCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { curatedProperties } from "./home-data";
import { SectionHeading } from "./SectionHeading";

export function FeaturedSelectionSection() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <Container className="space-y-10 lg:space-y-12">
        <SectionHeading
          title="Featured Selection"
          description="Handpicked opportunities aligned to current market momentum, lifestyle preference, and investment outlook."
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {curatedProperties.map((property, index) => (
            <PropertyCard key={`featured-${index}`} {...property} />
          ))}
        </div>
      </Container>
    </section>
  );
}
