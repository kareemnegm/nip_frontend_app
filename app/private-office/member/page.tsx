import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { PageHero, SectionHeading } from "@/components/sections";
import {
  AdvisorCard,
  Button,
  Container,
  Icon,
  PropertyCard,
} from "@/components/ui";
import { sampleAdvisorSelection, sampleProperties } from "@/components/placeholders";

export const metadata: Metadata = {
  title: "Private Office | NIP Reality",
};

export default function PrivateOfficeMemberPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Private Office"
        title="Welcome Back, Mr. Kamyar"
        description="Curated by Sara N. | NIP Private Advisory"
        tone="dark"
      />

      <section className="w-full bg-surface">
        <Container className="py-14 sm:py-16">
          <SectionHeading title="Curated for You" align="left" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sampleAdvisorSelection.slice(0, 3).map((item, index) => (
              <AdvisorCard key={`curated-${index}`} {...item} />
            ))}
          </div>
        </Container>
      </section>

      <section className="w-full bg-surface">
        <Container className="pb-14 sm:pb-16">
          <SectionHeading title="Saved Properties" align="left" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sampleProperties.slice(0, 3).map((property, index) => (
              <PropertyCard key={`saved-${index}`} {...property} />
            ))}
          </div>
        </Container>
      </section>

      <section className="w-full bg-sapphire-50">
        <Container className="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
              <Icon name="user" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-brand">Your Advisor | Sara N.</p>
              <p className="text-xs text-ink-tertiary">
                Available Mon–Fri | Responds within hours
              </p>
            </div>
          </div>
          <Button href="/contact">Message your Advisor</Button>
        </Container>
      </section>
    </SiteShell>
  );
}
