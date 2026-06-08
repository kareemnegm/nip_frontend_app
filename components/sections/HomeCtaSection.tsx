import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";

export function HomeCtaSection() {
  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-24">
      <Container className="space-y-10">
        <SectionHeading
          title="Not Sure Where to Begin"
          description="Speak with a NIP advisor for a discreet, tailored conversation about your goals, timeline, and the communities that fit your mandate."
        />
        <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <Button href="/contact" size="lg" className="w-full sm:w-auto">
            Speak with NIP
          </Button>
          <Button href="/concierge" variant="accent" size="lg" className="w-full sm:w-auto">
            Ask the Concierge
          </Button>
        </div>
      </Container>
    </section>
  );
}
