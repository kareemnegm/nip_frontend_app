import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  AvailableUnitsSection,
  MasterplanSection,
  OffPlanHeroImage,
  PaymentPlanSection,
  ProjectRegisterCta,
} from "@/components/sections/OffPlanStorySections";
import {
  Badge,
  Breadcrumbs,
  Button,
  FactsStrip,
  Icon,
  OffPlanCard,
} from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { projectFacts, sampleOffPlan } from "@/components/placeholders";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Armani Beach Residences | Off-Plan | NIP Reality",
  description:
    "Off-plan project story for Armani Beach Residences on Palm Jumeirah by Emaar.",
};

export default function ProjectStoryPage() {
  return (
    <SiteShell>
      <section className="bg-white pb-6 pt-10">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
              <div className="flex max-w-[429px] flex-col gap-5">
                <Breadcrumbs
                  format="property"
                  items={[
                    { label: "Off-Plan", href: "/off-plan" },
                    { label: "Featured Projects", href: "/off-plan" },
                    { label: "Palm Jumeirah" },
                  ]}
                />
                <div className="flex flex-wrap gap-2">
                  <Badge tone="property">Off-Plan</Badge>
                  <Badge tone="property">Q4 2026 Handover</Badge>
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
                  Armani Beach Residences
                </h1>
                <p className="flex items-center gap-1.5 text-body-sm text-ink-tertiary">
                  <Icon
                    name="mapPin"
                    className="h-3.5 w-3.5 shrink-0 text-brand"
                  />
                  Palm Jumeirah, Dubai | by Emaar
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 lg:items-end">
                <p className="text-[11px] font-medium leading-[14px] text-basalt-300 lg:text-right">
                  STARTING FROM
                </p>
                <p className="flex items-center gap-2 text-[30px] font-bold leading-[38px] text-brand">
                  <Icon name="currency" className="h-6 w-6 shrink-0" />
                  4,710,000
                </p>
                <Button href="/contact" className="w-full sm:w-auto">
                  Register Interest
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-8">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <OffPlanHeroImage />
          </div>
        </div>
      </section>

      <section className="bg-white pb-11">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <FactsStrip items={projectFacts} variant="property" />
          </div>
        </div>
      </section>

      <section className="bg-white pb-14">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={cn(sitePageInnerClassName, "space-y-14")}>
            <PaymentPlanSection />
            <AvailableUnitsSection />
            <MasterplanSection />
          </div>
        </div>
      </section>

      <ProjectRegisterCta />

      <section className="bg-surface-muted pb-20 pt-16">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={cn(sitePageInnerClassName, "space-y-7")}>
            <p className="text-center text-overline font-semibold leading-4 text-accent">
              MORE OFF-PLAN PROJECTS
            </p>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sampleOffPlan.slice(0, 3).map((project, index) => (
                <OffPlanCard key={`more-offplan-${index}`} {...project} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
