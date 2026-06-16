import { EditableText } from "@/components/EditableText";
import { ContributeInsightForm } from "@/components/ui/LeadForms";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getRequestLocale } from "@/lib/i18n/server";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

const blocks = pageBlockKeys.contribute;

export const contributePublishPoints = [
  {
    title: "Original Perspective",
    body: "Market analysis, community guides or investment thinking — your own work.",
  },
  {
    title: "Considered Tone",
    body: "Measured, useful and free of promotional language.",
  },
  {
    title: "Editorial Review",
    body: "Our team reviews every submission and may suggest edits before publishing.",
  },
];

export async function ContributeHeroSection() {
  const locale = await getRequestLocale();

  return (
    <section data-site-hero className="bg-surface-muted pt-16 pb-9">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "space-y-4")}>
          <div className="space-y-2">
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={blocks.hero.eyebrow}
              locale={locale}
              placeholderContent="CONTRIBUTE"
              placeholderTag="p"
              className="text-overline font-semibold leading-4 text-accent"
            />
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={blocks.hero.title}
              locale={locale}
              placeholderContent="Contribute an Insight"
              placeholderTag="h1"
              className="font-[family-name:var(--font-display)] text-[44px] leading-[42px] tracking-[-0.02em] text-brand"
            />
          </div>
          <EditableText
            relUrl={blocks.relUrl}
            blockKey={blocks.hero.description}
            locale={locale}
            placeholderContent="Share market perspective with the NIP audience. Submissions are reviewed by our editorial team before publication."
            placeholderTag="p"
            className="max-w-[680px] text-body-lg leading-[28px] text-ink-secondary"
          />
        </div>
      </div>
    </section>
  );
}

export async function ContributeFormSection() {
  const locale = await getRequestLocale();

  return (
    <section className="bg-white pb-[72px] pt-10">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "grid gap-10 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-16",
          )}
        >
          <div className="max-w-[512px] lg:pt-4">
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={blocks.sidebar.title}
              locale={locale}
              placeholderContent="What We Publish"
              placeholderTag="h2"
              className="text-xl font-bold leading-[26px] text-brand"
            />
            <ul className="mt-6 space-y-6">
              {contributePublishPoints.map((point) => (
                <li key={point.title} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <div>
                    <p className="text-body-md font-bold leading-[22px] text-ink">
                      {point.title}
                    </p>
                    <p className="mt-1 text-body-sm leading-[18px] text-ink-secondary">
                      {point.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <ContributeInsightForm />
        </div>
      </div>
    </section>
  );
}
