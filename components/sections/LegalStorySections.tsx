import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import type { Locale } from "@/lib/i18n/config";
import { Fragment } from "react";

export const legalSectionIds = [
  "overview",
  "information-we-collect",
  "how-we-use-it",
  "sharing-disclosure",
  "data-retention",
  "your-rights",
  "contact",
] as const;

export type LegalSectionId = (typeof legalSectionIds)[number];

const legalBlocks = pageBlockKeys.legal;

type LegalPageProps = {
  locale: Locale;
};

export async function LegalHeroSection({ locale }: LegalPageProps) {
  return (
    <section data-site-hero className="bg-surface-muted pt-16 pb-9">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "flex flex-col gap-[10px]")}>
          <div className="flex flex-col gap-2">
            <EditableText
              relUrl={legalBlocks.relUrl}
              blockKey={legalBlocks.hero.eyebrow}
              locale={locale}
              placeholderContent={await getCmsPlaceholder("pages.legal", "hero.eyebrow", locale)}
              placeholderTag="p"
              className="text-overline font-semibold text-accent"
            />
            <EditableText
              relUrl={legalBlocks.relUrl}
              blockKey={legalBlocks.hero.title}
              locale={locale}
              placeholderContent={await getCmsPlaceholder("pages.legal", "hero.title", locale)}
              placeholderTag="h1"
              className="font-display text-display-sm uppercase text-brand sm:text-display-lg"
            />
          </div>
          <EditableText
            relUrl={legalBlocks.relUrl}
            blockKey={legalBlocks.hero.lastUpdated}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("pages.legal", "hero.lastUpdated", locale)}
            placeholderTag="p"
            className="text-body-sm text-basalt-300"
          />
        </div>
      </div>
    </section>
  );
}

export async function LegalContentSection({ locale }: LegalPageProps) {
  const sectionPlaceholders = Object.fromEntries(
    await Promise.all(
      legalSectionIds.map(async (id) => [
        id,
        {
          title: await getCmsPlaceholder("pages.legal", `sections.${id}.title`, locale),
          body: await getCmsPlaceholder("pages.legal", `sections.${id}.body`, locale),
        },
      ]),
    ),
  ) as Record<LegalSectionId, { title: string; body: string }>;

  return (
    <section className="bg-white pb-20 pt-10">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col gap-10 lg:flex-row lg:justify-between",
          )}
        >
          <aside className="w-full shrink-0 lg:sticky lg:top-28 lg:w-[240px] lg:self-start">
            <EditableText
              relUrl={legalBlocks.relUrl}
              blockKey={legalBlocks.sidebar.title}
              locale={locale}
              placeholderContent={await getCmsPlaceholder("pages.legal", "sidebar.title", locale)}
              placeholderTag="p"
              className="text-overline font-semibold text-basalt-300"
            />
            <ul className="mt-3 flex flex-col gap-3">
              {legalSectionIds.map((id) => {
                const sectionKeys = legalBlocks.sections[id];
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="text-label font-medium text-accent transition-colors hover:text-accent-hover"
                    >
                      <EditableText
                        relUrl={legalBlocks.relUrl}
                        blockKey={sectionKeys.title}
                        locale={locale}
                        placeholderContent={sectionPlaceholders[id].title}
                        placeholderTag="span"
                        className="text-label font-medium text-accent"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="flex w-full max-w-[720px] flex-col gap-7">
            {legalSectionIds.map((id) => {
              const sectionKeys = legalBlocks.sections[id];
              const placeholders = sectionPlaceholders[id];
              return (
                <Fragment key={id}>
                  <div id={id} className="scroll-mt-28">
                    <EditableText
                      relUrl={legalBlocks.relUrl}
                      blockKey={sectionKeys.title}
                      locale={locale}
                      placeholderContent={placeholders.title}
                      placeholderTag="h2"
                      className="text-[20px] font-bold leading-[26px] text-brand"
                    />
                  </div>
                  <EditableText
                    relUrl={legalBlocks.relUrl}
                    blockKey={sectionKeys.body}
                    locale={locale}
                    placeholderContent={placeholders.body}
                    placeholderTag="p"
                    className="text-body-sm text-ink"
                  />
                  {id === "contact" ? (
                    <EditableImage
                      relUrl={legalBlocks.relUrl}
                      blockKey={legalBlocks.complianceImage}
                      locale={locale}
                      placeholderUrl=""
                      placeholderAlt="RERA compliance badge"
                      width={320}
                      height={120}
                      className="max-w-[320px]"
                      imageClassName="object-contain"
                    />
                  ) : null}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
