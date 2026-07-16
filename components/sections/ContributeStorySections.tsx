import { EditableText } from "@/components/EditableText";
import { ContributeInsightForm } from "@/components/ui/LeadForms";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
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
              placeholderContent={await getCmsPlaceholder("placeholders.contribute.hero", "eyebrow", locale)}
              placeholderTag="p"
              className="text-overline font-semibold text-accent"
            />
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={blocks.hero.title}
              locale={locale}
              placeholderContent={await getCmsPlaceholder("placeholders.contribute.hero", "title", locale)}
              placeholderTag="h1"
              className="font-display text-display-sm uppercase text-brand sm:text-display-lg"
            />
          </div>
          <EditableText
            relUrl={blocks.relUrl}
            blockKey={blocks.hero.description}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("placeholders.contribute.hero", "description", locale)}
            placeholderTag="p"
            className="max-w-[640px] text-body-sm text-ink-secondary sm:text-body-lg"
          />
        </div>
      </div>
    </section>
  );
}

export async function ContributeFormSection() {
  const locale = await getRequestLocale();

  return (
    <section className="bg-white pt-10 pb-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-start gap-10 lg:flex-row lg:justify-between",
          )}
        >
          {/* Figma 1525:27349 — title + points share the same left edge (no ul indent) */}
          <div className="flex w-full flex-col items-start gap-6 lg:max-w-[380px]">
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={blocks.sidebar.title}
              locale={locale}
              placeholderContent={await getCmsPlaceholder("placeholders.contribute.sidebar", "title", locale)}
              placeholderTag="h2"
              className="text-h3 font-bold text-brand"
            />
            <ul className="m-0 flex w-full list-none flex-col gap-6 p-0">
              {contributePublishPoints.map((point) => (
                <li key={point.title} className="flex w-full flex-col items-start gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden />
                    <p className="text-label-semibold font-semibold text-brand">
                      {point.title}
                    </p>
                  </div>
                  {/* Body flush with bullet (x=0), not indented under the title */}
                  <p className="w-full max-w-[360px] text-start text-body-sm text-ink-tertiary">
                    {point.body}
                  </p>
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
