import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/sections";
import { Button, Container, Icon, ImagePlaceholder } from "@/components/ui";

export const metadata: Metadata = {
  title: "About NIP | NIP Reality",
};

const partners = ["MERAAS", "EMAAR", "OMNIYAT", "NAKHEEL", "SOBHA"];

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="About NIP"
        title="One Source. One System. One Standard."
        description="NIP was created for clients who want more than access to property. They want context, judgment, and a single advisory standard across every step of the real estate journey."
        align="center"
        tone="light"
        className="bg-surface"
        actions={
          <>
            <Button href="/contact">Speak with NIP</Button>
            <Button href="/insights" variant="accent">
              Read our Insights <Icon name="arrowRight" className="h-4 w-4" />
            </Button>
          </>
        }
      />

      <section className="w-full bg-surface">
        <Container className="pb-12 text-center">
          <h2 className="mx-auto max-w-3xl font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
            Dubai&apos;s Property Market Moves Quickly
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink-secondary">
            {
              "New launches, private resales, waterfront residences, branded developments, and selected off-market opportunities appear every day. For private clients, the challenge is not finding options. The challenge is knowing which options deserve attention."
            }
          </p>
        </Container>
      </section>

      <section className="w-full bg-surface">
        <Container className="grid items-center gap-10 pb-16 lg:grid-cols-2 sm:pb-20">
          <ImagePlaceholder className="aspect-square w-full" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              Our Role
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
              We Do Not Begin with Inventory
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-ink-secondary">
              {
                "We begin with the client's context: purpose, timing, risk, lifestyle, capital strategy, and long-term view. From there, we help identify the areas, developers, projects, and properties that align with the brief."
              }
            </p>
          </div>
        </Container>
      </section>

      <section className="w-full bg-brand text-white">
        <Container className="py-14 sm:py-16">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {partners.map((partner) => (
              <span
                key={partner}
                className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-[0.15em] text-white/80"
              >
                {partner}
              </span>
            ))}
          </div>
          <p className="mt-8 text-center text-xs uppercase tracking-[0.18em] text-white/60">
            Trusted Partnership with Dubai&apos;s Leading Developers
          </p>
        </Container>
      </section>

      <section className="w-full bg-surface">
        <Container className="py-16 text-center sm:py-20">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
            NIP is Built Around a Simple Standard:
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium italic text-ink-secondary">
            {
              "\u201cOne source for insight. One system for decision-making. One standard for every client journey.\u201d"
            }
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact">Speak with NIP</Button>
            <Button href="/insights" variant="accent">
              Read our Insights <Icon name="arrowRight" className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
