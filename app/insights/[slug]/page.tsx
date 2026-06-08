import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { CtaBand, SectionHeading } from "@/components/sections";
import {
  Button,
  Container,
  ImagePlaceholder,
  InsightCard,
} from "@/components/ui";
import { sampleInsights } from "@/components/placeholders";

export const metadata: Metadata = {
  title: "Insight Article | NIP Reality",
};

export default function InsightArticlePage() {
  return (
    <SiteShell>
      <article className="w-full bg-surface">
        <Container className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
              Market Intelligence
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
              Where Dubai Investment Meets Elevated Living
            </h1>
            <p className="mt-4 text-sm leading-7 text-ink-secondary">
              {
                "How disciplined advisory turns a fast-moving market into durable, long-term position — and why location still decides everything."
              }
            </p>
            <p className="mt-5 text-xs text-ink-tertiary">
              By NIP Advisory | May 2026 | 9 min read
            </p>
          </div>

          <ImagePlaceholder className="mx-auto mt-10 aspect-[16/8] max-w-4xl" />

          <div className="mx-auto mt-10 max-w-3xl space-y-6 text-sm leading-7 text-ink-secondary">
            <p>
              {
                "Dubai's residential market has matured past the cycle of speculation that once defined it. The communities commanding lasting value today are those with genuine scarcity — waterfront frontage, master-planned amenity, and proximity to the infrastructure that shapes a decade, not a quarter."
              }
            </p>
            <p>
              {
                "For the private buyer, the implication is straightforward: the headline price is rarely the decision. The decision is the quality of the position — and the discipline of the advice behind it."
              }
            </p>

            <h2 className="pt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-brand sm:text-3xl">
              Location Still Decides Everything
            </h2>
            <p>
              {
                "Across Palm Jumeirah, Downtown and the emerging Creek corridor, the spread between average and exceptional has widened. Selection — not timing — is where advisory earns its keep."
              }
            </p>

            <blockquote className="border-l-2 border-brand pl-5 text-base font-medium italic text-brand">
              {
                "Experience markets reward patience and precision — never noise."
              }
            </blockquote>

            <p>
              {
                "That patience is structural. It is built into how a property is sourced, how a developer's track record is read, and how a payment plan is matched to a buyer's long-term position."
              }
            </p>

            <ImagePlaceholder className="aspect-[16/8]" />
            <p className="text-xs text-ink-tertiary">
              Above: a representative waterfront residence. Imagery for illustration.
            </p>

            <p>
              {
                "The market will keep moving. The advisory discipline that turns movement into long-term position does not."
              }
            </p>
          </div>
        </Container>
      </article>

      <CtaBand
        tone="light"
        eyebrow="NIP Private Advisory"
        title="Considering a Position in This Market?"
        actions={<Button href="/contact">Speak with NIP</Button>}
      />

      <section className="w-full bg-surface">
        <Container className="py-16 sm:py-20">
          <SectionHeading title="Related Insights" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sampleInsights.slice(0, 3).map((insight, index) => (
              <InsightCard key={`related-${index}`} {...insight} />
            ))}
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
