import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

export async function HomeCtaSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          title="Not Sure Where to Begin"
          description="Speak with NIP before you search. Our advisory team can help you understand the market, define your priorities, and identify what is worth your attention."
          editable={{
            relUrl: homeEditable.relUrl,
            titleKey: homeEditable.homeCta.titleKey,
            descKey: homeEditable.homeCta.descKey,
          }}
        />
        <div className="mx-auto flex max-w-[356px] flex-col items-stretch justify-center gap-3 sm:flex-row">
          <Button href="/contact" size="lg" className="w-full flex-1">
            Speak with NIP
          </Button>
          <Button href="/concierge" variant="accent" size="lg" className="w-full flex-1">
            Ask the Concierge
          </Button>
        </div>
      </Container>
    </section>
  );
}
