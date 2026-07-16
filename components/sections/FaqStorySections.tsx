import { getTranslations } from "next-intl/server";
import { LocalizedLink } from "@/components/LocalizedLink";
import { EditableText } from "@/components/EditableText";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { SpeakWithNipButton } from "@/components/ui/Button";
import { getFaqs } from "@/lib/api/faqs";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";
import {
  siteMaxWidth,
  sitePageGutterX,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

export const faqItemIds = [
  "advisory",
  "fees",
  "goldenVisa",
  "offPlanReady",
  "responseTime",
] as const;

export type FaqItemId = (typeof faqItemIds)[number];

const faqBlocks = pageBlockKeys.faq;

async function localizedFaqFallback(locale: Locale): Promise<FaqItem[]> {
  const t = await getTranslations({ locale, namespace: "pages.faq" });
  return faqItemIds.map((id) => ({
    id,
    question: t(`items.${id}.question`),
    answer: t(`items.${id}.answer`),
  }));
}

export async function FaqHeroSection() {
  const locale = await getRequestLocale();

  return (
    <section data-site-hero className="bg-white pb-10 pt-[72px]">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[820px] flex-col items-center gap-6 text-center">
          <EditableText
            relUrl={faqBlocks.relUrl}
            blockKey={faqBlocks.hero.eyebrow}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("placeholders.faq.hero", "eyebrow", locale)}
            placeholderTag="p"
            className="text-overline font-semibold text-accent"
          />
          <EditableText
            relUrl={faqBlocks.relUrl}
            blockKey={faqBlocks.hero.title}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("placeholders.faq.hero", "title", locale)}
            placeholderTag="h1"
            className="font-display text-display-sm uppercase text-brand sm:text-display-lg"
          />
          <EditableText
            relUrl={faqBlocks.relUrl}
            blockKey={faqBlocks.hero.description}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("placeholders.faq.hero", "description", locale)}
            placeholderTag="p"
            className="max-w-[640px] text-body-sm text-ink-secondary sm:text-body-lg"
          />
        </div>
      </div>
    </section>
  );
}

export async function FaqAccordionSection() {
  const locale = await getRequestLocale();
  const apiFaqs = await getFaqs(locale).catch(() => []);
  const faqItems: FaqItem[] =
    apiFaqs.length > 0
      ? apiFaqs.map((item) => ({
          question: item.question,
          answer: item.answer,
        }))
      : await localizedFaqFallback(locale);

  return (
    <section className="bg-white pb-14">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto w-full max-w-[820px]">
          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </section>
  );
}

export async function FaqCtaSection() {
  const locale = await getRequestLocale();
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="bg-surface-muted pb-[72px] pt-14">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[820px] flex-col items-center gap-6 text-center">
          <EditableText
            relUrl={faqBlocks.relUrl}
            blockKey={faqBlocks.cta.title}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("placeholders.faq.cta", "title", locale)}
            placeholderTag="h2"
            className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand"
          />
          <EditableText
            relUrl={faqBlocks.relUrl}
            blockKey={faqBlocks.cta.description}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("placeholders.faq.cta", "description", locale)}
            placeholderTag="p"
            className="max-w-[520px] text-body-sm leading-[18px] text-ink-tertiary"
          />
          {/* Figma 1525:27566 — gap:12px; each button flex:1 0 0 + whitespace-nowrap (labels never wrap) */}
          <div className="flex w-full max-w-[400px] flex-row items-stretch justify-center gap-2 sm:gap-3">
            <LocalizedLink
              href="/concierge"
              className="inline-flex min-w-0 flex-1 basis-0 items-center justify-center whitespace-nowrap rounded-[var(--radius-field)] bg-accent px-3 py-[9px] text-xs font-semibold leading-4 text-white transition-colors hover:bg-accent-hover active:bg-accent-pressed sm:px-6"
            >
              {tc("askConcierge")}
            </LocalizedLink>
            <SpeakWithNipButton
              href="/contact"
              className="min-w-0 flex-1 basis-0 justify-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
