import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/sections";
import { Button, Container, Icon, ImagePlaceholder } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ask the Concierge | NIP Reality",
};

const quickPrompts = [
  "Best areas for investment?",
  "Golden Visa & property",
  "Off-plan vs ready",
  "Payment plans explained",
];

export default function ConciergePage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="AI Concierge"
        title="Ask the Concierge"
        description="Instant answers on communities, pricing, off-plan and the Golden Visa — and a direct line to a private advisor whenever you want one."
        align="center"
        tone="light"
      />

      <section className="w-full bg-sapphire-50">
        <Container className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
            <div className="flex flex-wrap gap-2 border-b border-line p-4">
              {quickPrompts.map((prompt) => (
                <span
                  key={prompt}
                  className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-secondary"
                >
                  {prompt}
                </span>
              ))}
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-sapphire-50 px-4 py-3 text-sm text-ink-secondary">
                {
                  "Hello — I'm the NIP Concierge. Ask me about communities, pricing, off-plan or the Golden Visa. I can also connect you with a private advisor."
                }
              </div>
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-brand px-4 py-3 text-sm text-white">
                Which areas offer the best long-term value right now?
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-sapphire-50 px-4 py-3 text-sm text-ink-secondary">
                {
                  "A few stand out for scarcity and infrastructure — Palm Jumeirah, Downtown and the Creek corridor. Here's one that fits a long-hold profile:"
                }
              </div>

              <div className="max-w-sm overflow-hidden rounded-[var(--radius-card)] border border-line">
                <ImagePlaceholder rounded={false} className="aspect-[1.7]" />
                <div className="space-y-3 p-4">
                  <h3 className="text-lg font-bold text-brand">Property Name</h3>
                  <p className="flex items-center gap-1 text-xs text-ink-secondary">
                    <Icon name="mapPin" className="h-4 w-4 text-brand" />
                    Sheikh Zayed Road, Dubai
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-ink">
                    <span>2 Beds</span>
                    <span>3 Baths</span>
                    <span>2,315 sq ft</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-ink-tertiary">Starting From</p>
                      <p className="text-lg font-bold text-brand">AED 2,658,000</p>
                    </div>
                    <Button variant="link">
                      Explore Property <Icon name="arrowRight" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-line p-4">
              <input
                aria-label="Ask anything about Dubai property"
                placeholder="Ask anything about Dubai property..."
                className="h-11 flex-1 rounded-[var(--radius-field)] border border-line px-4 text-sm text-ink outline-none placeholder:text-ink-tertiary focus:border-brand"
              />
              <Button type="submit" size="sm">
                Send <Icon name="send" className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-ink-secondary">
            Prefer a Person?{" "}
            <Link href="/contact" className="font-semibold text-brand hover:underline">
              Speak with a Private Advisor →
            </Link>
          </p>
        </Container>
      </section>
    </SiteShell>
  );
}
