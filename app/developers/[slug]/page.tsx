import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { CtaBand, SectionHeading } from "@/components/sections";
import {
  Button,
  CommunityCard,
  Container,
  FactsStrip,
  Icon,
  OffPlanCard,
} from "@/components/ui";
import type { FactItem } from "@/components/ui/FactsStrip";
import { sampleCommunities, sampleOffPlan } from "@/components/placeholders";

export const metadata: Metadata = {
  title: "The Maker | NIP Reality",
};

const developerFacts: FactItem[] = [
  { label: "Established", value: "1997", icon: "calendar" },
  { label: "Projects", value: "200+", icon: "building" },
  { label: "Communities", value: "30+", icon: "grid" },
  { label: "Awards", value: "28", icon: "check" },
  { label: "Homes Delivered", value: "88,300+", icon: "home" },
  { label: "Reach", value: "Global", icon: "globe" },
];

const strengths = [
  "Iconic Master Plans",
  "Reliable Handover",
  "Strong Resale",
  "Branded Partnerships",
  "Amenity-Led",
  "Global Track Record",
];

export default function DeveloperPage() {
  return (
    <SiteShell>
      <section className="w-full bg-sapphire-50">
        <Container className="py-12 sm:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                Master Developer | Dubai
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-brand sm:text-5xl">
                Emaar Properties
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-secondary">
                {
                  "The developer behind Downtown Dubai, Dubai Marina and Dubai Hills — defining the city's most recognised communities since 1997."
                }
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <span className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[0.2em] text-brand">
                EMAAR
              </span>
              <Button href="/contact">Speak with NIP</Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="w-full bg-surface">
        <Container className="py-10 sm:py-12">
          <FactsStrip items={developerFacts} />
        </Container>
      </section>

      <section className="w-full bg-surface">
        <Container className="pb-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-brand sm:text-3xl">
            About the Developer
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-secondary">
            {
              "Emaar is the master developer most associated with modern Dubai — from the Burj Khalifa and Downtown to the master-planned communities that set the benchmark for amenity, build quality and resale strength. For NIP clients, an Emaar address typically means liquidity, brand assurance and dependable handover."
            }
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {strengths.map((strength) => (
              <span
                key={strength}
                className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-ink-secondary"
              >
                <Icon name="check" className="h-3.5 w-3.5 text-brand" />
                {strength}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="w-full bg-sapphire-50">
        <Container className="py-16 sm:py-20">
          <SectionHeading title="Projects by Emaar" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sampleOffPlan.map((project, index) => (
              <OffPlanCard key={`dev-project-${index}`} {...project} />
            ))}
          </div>
        </Container>
      </section>

      <section className="w-full bg-surface">
        <Container className="py-16 sm:py-20">
          <SectionHeading title="Where Emaar Builds" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sampleCommunities.map((community, index) => (
              <CommunityCard key={`dev-community-${index}`} {...community} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        eyebrow="Advisory"
        title="Interested in an Emaar Address?"
        actions={<Button href="/contact" variant="accent">Speak with NIP</Button>}
      />
    </SiteShell>
  );
}
