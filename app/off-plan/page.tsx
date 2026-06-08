import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { CtaBand, PageHero } from "@/components/sections";
import { Button, Container, OffPlanCard } from "@/components/ui";
import { sampleOffPlan } from "@/components/placeholders";

export const metadata: Metadata = {
  title: "Off-Plan | NIP Reality",
};

export default function OffPlanPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Off-Plan | New Launches"
        title="Off-Plan & New Launches"
        description="Early access to launches and payment plans from Dubai's leading developers, reviewed for quality and long-term value."
      />

      <section className="w-full bg-surface">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sampleOffPlan.map((project, index) => (
              <OffPlanCard key={`offplan-${index}`} {...project} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        eyebrow="Register Your Interest"
        title="Early Access to Units and Payment Plans"
        actions={<Button href="/contact" variant="accent">Speak with NIP</Button>}
      />
    </SiteShell>
  );
}
