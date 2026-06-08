import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { CtaBand, PageHero } from "@/components/sections";
import { Button, Container, Icon } from "@/components/ui";

export const metadata: Metadata = {
  title: "Developers | NIP Reality",
};

const developers = [
  { name: "Emaar", projects: "200+ Projects" },
  { name: "Meraas", projects: "60+ Projects" },
  { name: "Omniyat", projects: "30+ Projects" },
  { name: "Nakheel", projects: "40+ Projects" },
  { name: "Sobha", projects: "50+ Projects" },
  { name: "Damac", projects: "120+ Projects" },
];

export default function DevelopersPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Developers | Makers"
        title="Dubai's Leading Developers"
        description="The master developers behind Dubai's most recognised communities, assessed for build quality, liquidity and handover record."
      />

      <section className="w-full bg-surface">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {developers.map((developer) => (
              <Link
                key={developer.name}
                href="/developers/emaar"
                className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-white p-8 transition-shadow hover:shadow-[var(--shadow-card)]"
              >
                <span className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-brand">
                  {developer.name}
                </span>
                <span className="text-sm text-ink-secondary">{developer.projects}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  View Maker <Icon name="arrowRight" className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Looking for the Right Developer?"
        actions={<Button href="/contact" variant="accent">Speak with NIP</Button>}
      />
    </SiteShell>
  );
}
