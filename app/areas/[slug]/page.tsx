import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { CtaBand, PageHero, SectionHeading } from "@/components/sections";
import {
  Button,
  Container,
  FactsStrip,
  Icon,
  ImagePlaceholder,
  OffPlanCard,
  PropertyCard,
} from "@/components/ui";
import type { FactItem } from "@/components/ui/FactsStrip";
import { sampleOffPlan, sampleProperties } from "@/components/placeholders";

export const metadata: Metadata = {
  title: "The Place | NIP Reality",
};

const areaFacts: FactItem[] = [
  { label: "Avg Price", value: "AED 6,000/sqft", icon: "currency" },
  { label: "Projects", value: "12", icon: "building" },
  { label: "Avg Yield", value: "6.2%", icon: "percent" },
  { label: "Setting", value: "Waterfront", icon: "mapPin" },
  { label: "To Downtown", value: "20 min", icon: "clock" },
];

const highlights = [
  "Private Beaches",
  "Branded Residences",
  "Fine Dining",
  "Marina Berths",
  "Five Star Resorts",
  "Family Villas",
];

const connectivity = [
  "Airport · 35 min",
  "Downtown · 20 min",
  "Marina · 10 min",
  "Expo City · 30 min",
];

export default function AreaPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Area | Dubai"
        title="Palm Jumeirah"
        description="The world's defining man-made island — beachfront living, branded residences and a postcard address."
        tone="dark"
      />

      <section className="w-full bg-surface">
        <Container className="py-10 sm:py-12">
          <FactsStrip items={areaFacts} />
        </Container>
      </section>

      <section className="w-full bg-surface">
        <Container className="pb-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-brand sm:text-3xl">
            About Palm Jumeirah
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-secondary">
            {
              "An engineering landmark turned lifestyle benchmark. Palm Jumeirah pairs private beach frontage with branded residences from the world's leading hospitality names. The Crescent holds the resorts; the fronds hold the villas; the trunk carries apartments and the everyday rhythm of island life."
            }
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {highlights.map((highlight) => (
              <span
                key={highlight}
                className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-ink-secondary"
              >
                <Icon name="check" className="h-3.5 w-3.5 text-brand" />
                {highlight}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="w-full bg-sapphire-50">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            title="Projects in This Area"
            description="Off-plan launches with payment plans inside Palm Jumeirah."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sampleOffPlan.slice(0, 3).map((project, index) => (
              <OffPlanCard key={`area-project-${index}`} {...project} />
            ))}
          </div>
        </Container>
      </section>

      <section className="w-full bg-surface">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            title="Available Properties"
            description="Ready residences currently available in this community."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sampleProperties.slice(0, 3).map((property, index) => (
              <PropertyCard key={`area-property-${index}`} {...property} />
            ))}
          </div>
        </Container>
      </section>

      <section className="w-full bg-surface">
        <Container className="pb-16 sm:pb-20">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-brand sm:text-3xl">
            Connectivity &amp; Location
          </h2>
          <ImagePlaceholder icon="mapPin" className="mt-5 aspect-[16/7]" />
          <div className="mt-4 flex flex-wrap gap-2">
            {connectivity.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-ink-secondary"
              >
                <Icon name="mapPin" className="h-3.5 w-3.5 text-brand" />
                {item}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Considering Palm Jumeirah?"
        actions={<Button href="/contact" variant="accent">Speak with NIP</Button>}
      />
    </SiteShell>
  );
}
