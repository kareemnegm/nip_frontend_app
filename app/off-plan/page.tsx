import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { ProjectRegisterCta } from "@/components/sections/OffPlanStorySections";
import { OffPlanCard } from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { sampleOffPlan } from "@/components/placeholders";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Off-Plan | NIP Reality",
  description:
    "Early access to off-plan launches and payment plans from Dubai's leading developers.",
};

export default function OffPlanPage() {
  return (
    <SiteShell>
      <section className="bg-surface-muted pt-16 pb-9">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={cn(sitePageInnerClassName, "space-y-2")}>
            <p className="text-overline font-semibold leading-4 text-accent">
              OFF-PLAN | NEW LAUNCHES
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-brand">
              Off-Plan &amp; New Launches
            </h1>
            <p className="max-w-[672px] text-body-sm text-ink">
              Early access to launches and payment plans from Dubai&apos;s leading
              developers, reviewed for quality and long-term value.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white pb-[72px] pt-10">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sampleOffPlan.map((project, index) => (
                <OffPlanCard key={`offplan-${index}`} {...project} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProjectRegisterCta />
    </SiteShell>
  );
}
