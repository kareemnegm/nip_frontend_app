import Link from "next/link";
import {
  Icon,
  ImagePlaceholder,
  InsightCard,
  Pagination,
} from "@/components/ui";
import { InsightCategoryFilters } from "@/components/ui/InsightCategoryFilters";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { sampleInsights } from "@/components/placeholders";
import { cn } from "@/lib/cn";

export function InsightsHubHero() {
  return (
    <section data-site-hero className="bg-surface-muted pt-16 pb-9">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "space-y-6")}>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-overline font-semibold leading-4 text-accent">
                INSIGHTS | MARKET PERSPECTIVE
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-brand">
                Insight &amp; Intelligence
              </h1>
            </div>
            <p className="max-w-[680px] text-body-lg leading-[28px] text-ink-secondary">
              Considered perspective on the communities, projects and policy shaping
              long-term value across Dubai.
            </p>
          </div>
          <InsightCategoryFilters />
        </div>
      </div>
    </section>
  );
}

export function InsightsHubMainSection() {
  return (
    <section className="bg-white pb-[72px] pt-10">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "space-y-14")}>
          <Link
            href="/insights/featured"
            className="grid gap-6 overflow-hidden rounded-[var(--radius-card)] border border-line bg-sapphire-50 shadow-[var(--shadow-card)] lg:grid-cols-2"
          >
            <ImagePlaceholder
              rounded={false}
              className="aspect-[16/10] min-h-[280px] bg-basalt-100 lg:aspect-auto lg:min-h-[360px]"
              icon="home"
            />
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
                Featured | Market Intelligence
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
                Where Dubai Investment Meets Elevated Living
              </h2>
              <p className="mt-4 max-w-xl text-body-md leading-[22px] text-ink-secondary">
                A measured read on the neighbourhoods defining enduring value — and
                how disciplined advisory turns market noise into long-term position.
              </p>
              <p className="mt-6 flex items-center gap-2 text-body-xs text-ink-tertiary">
                8 min read | NIP Advisory
                <Icon name="arrowRight" className="h-4 w-4 text-brand" />
              </p>
            </div>
          </Link>

          <div className="space-y-8">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
              Latest
            </p>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sampleInsights.map((insight, index) => (
                <InsightCard
                  key={`insight-${index}`}
                  className="min-h-[440px]"
                  href={`/insights/sample-${index + 1}`}
                  {...insight}
                />
              ))}
            </div>

            <Pagination className="mt-4" pages={[1, 2, 3]} total={9} />
          </div>
        </div>
      </div>
    </section>
  );
}
