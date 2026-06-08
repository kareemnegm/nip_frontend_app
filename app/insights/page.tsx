import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/sections";
import {
  Container,
  Icon,
  ImagePlaceholder,
  InsightCard,
  Pagination,
} from "@/components/ui";
import { sampleInsights } from "@/components/placeholders";

export const metadata: Metadata = {
  title: "Insights | NIP Reality",
};

const filters = [
  "All",
  "Market Intelligence",
  "Investment Guides",
  "Golden Visa",
  "Journal",
];

export default function InsightsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Insights | Market Perspective"
        title="Insight & Intelligence"
        description="Considered perspective on the communities, projects and policy shaping long-term value across Dubai."
        actions={filters.map((filter, index) => (
          <span
            key={filter}
            className={
              index === 0
                ? "inline-flex items-center rounded-[var(--radius-field)] bg-brand px-4 py-2 text-xs font-semibold text-white"
                : "inline-flex items-center rounded-[var(--radius-field)] border border-line bg-white px-4 py-2 text-xs font-semibold text-ink-secondary"
            }
          >
            {filter}
          </span>
        ))}
      />

      <section className="w-full bg-surface">
        <Container className="py-12 sm:py-16">
          <Link
            href="/insights/featured"
            className="grid gap-6 overflow-hidden rounded-[var(--radius-card)] border border-line bg-sapphire-50 lg:grid-cols-2"
          >
            <ImagePlaceholder rounded={false} className="aspect-[16/10] lg:aspect-auto" />
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
                Featured | Market Intelligence
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
                Where Dubai Investment Meets Elevated Living
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-ink-secondary">
                {
                  "A measured read on the neighbourhoods defining enduring value — and how disciplined advisory turns market noise into long-term position."
                }
              </p>
              <p className="mt-6 flex items-center gap-2 text-xs text-ink-tertiary">
                8 min read | NIP Advisory
                <Icon name="arrowRight" className="h-4 w-4 text-brand" />
              </p>
            </div>
          </Link>

          <p className="mt-14 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
            Latest
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sampleInsights.map((insight, index) => (
              <InsightCard key={`insight-${index}`} {...insight} />
            ))}
          </div>

          <Pagination className="mt-12" pages={[1, 2, 3]} total={9} />
        </Container>
      </section>
    </SiteShell>
  );
}
