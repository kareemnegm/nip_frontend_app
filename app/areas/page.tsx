import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { CtaBand, PageHero } from "@/components/sections";
import { Button, CommunityCard, Container } from "@/components/ui";
import { sampleCommunities } from "@/components/placeholders";

export const metadata: Metadata = {
  title: "Areas | NIP Reality",
};

const areas = [...sampleCommunities, ...sampleCommunities].map((area, index) => ({
  ...area,
  title: [
    "Palm Jumeirah",
    "Dubai Marina",
    "Downtown",
    "Business Bay",
    "Creek Harbour",
    "Emirates Hills",
  ][index],
}));

export default function AreasPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Areas | Communities"
        title="Explore Dubai's Communities"
        description="A considered guide to the neighbourhoods shaping long-term value across Dubai."
      />

      <section className="w-full bg-surface">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {areas.map((area, index) => (
              <CommunityCard key={`area-${index}`} {...area} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Considering a Move to Dubai?"
        actions={<Button href="/contact" variant="accent">Speak with NIP</Button>}
      />
    </SiteShell>
  );
}
