import { LocalizedLink } from "@/components/LocalizedLink";
import { EditableText } from "@/components/EditableText";
import { getTranslations } from "next-intl/server";
import { siteMarketPulseLayoutClassName, siteSectionY } from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import { marketPulseKeysFromTitle } from "@/lib/market-pulse/stat-value";
import { homeEditable } from "./home-editable";
import { MarketPulseStatValue } from "./MarketPulseStatValue";
import type { SectionCms } from "./section-cms";
import { toSectionHeadingEditable } from "./section-cms";
import { SectionHeading } from "./SectionHeading";

const defaultCms: SectionCms = {
  relUrl: homeEditable.relUrl,
  titleKey: homeEditable.marketPulse.titleKey,
  descKey: homeEditable.marketPulse.descKey,
};

/**
 * Figma 1525:28295/28300/28301 — 1056px inner (192px gutters), 4 stat cards
 * fixed at 252×137px each at desktop, gap-16 (16px), px-28 py-24 padding.
 */
const cardBg = ["bg-sapphire-400", "bg-sapphire-500", "bg-sapphire-600", "bg-sapphire-700"] as const;
const cardContext = ["text-sapphire-100", "text-sapphire-200", "text-sapphire-200", "text-sapphire-200"] as const;

const statPlaceholderKeys = [
  { context: "stat1Context", value: "stat1Value", label: "stat1Label" },
  { context: "stat2Context", value: "stat2Value", label: "stat2Label" },
  { context: "stat3Context", value: "stat3Value", label: "stat3Label" },
  { context: "stat4Context", value: "stat4Value", label: "stat4Label" },
] as const;

export async function MarketPulseSection({
  cms = defaultCms,
  placeholderNamespace = "placeholders.home.marketPulse",
}: {
  cms?: SectionCms;
  placeholderNamespace?: string;
} = {}) {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  const pulseKeys = marketPulseKeysFromTitle(cms.titleKey);

  const statCards = await Promise.all(
    statPlaceholderKeys.map(async (keys, index) => ({
      index,
      keys: pulseKeys.stats[index]!,
      placeholders: {
        context: await getCmsPlaceholder(placeholderNamespace, keys.context, locale),
        value: await getCmsPlaceholder(placeholderNamespace, keys.value, locale),
        label: await getCmsPlaceholder(placeholderNamespace, keys.label, locale),
      },
    })),
  );

  const ctaPlaceholder =
    (await getCmsPlaceholder(placeholderNamespace, "cta", locale)) ||
    t("marketPulse.viewPerspective");

  return (
    <section className={cn("bg-white", siteSectionY)}>
      <div className={siteMarketPulseLayoutClassName}>
        <SectionHeading
          title={await getCmsPlaceholder(placeholderNamespace, "title", locale)}
          description={await getCmsPlaceholder(placeholderNamespace, "desc", locale)}
          descriptionMaxWidth="max-w-[464px]"
          editable={toSectionHeadingEditable(cms)}
        />

        <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map(({ index, keys, placeholders }) => (
            <div
              key={keys.label}
              data-reveal
              data-reveal-delay={index > 0 ? String(Math.min(index, 3)) : undefined}
              className={[
                "flex flex-col justify-center gap-4 overflow-hidden rounded-[var(--radius-card)] px-4 py-4 text-white sm:h-[137px] sm:px-7 sm:py-6",
                "items-center text-center sm:items-start sm:text-start",
                cardBg[index],
              ].join(" ")}
            >
              <EditableText
                relUrl={cms.relUrl}
                blockKey={keys.context}
                locale={locale}
                placeholderContent={placeholders.context}
                placeholderTag="p"
                className={cn("sm:whitespace-nowrap text-body-xs font-normal", cardContext[index])}
              />

              <MarketPulseStatValue
                relUrl={cms.relUrl}
                blockKey={keys.value}
                locale={locale}
                placeholderContent={placeholders.value}
                showCurrencyIcon={index === 0}
              />

              <EditableText
                relUrl={cms.relUrl}
                blockKey={keys.label}
                locale={locale}
                placeholderContent={placeholders.label}
                placeholderTag="p"
                className="text-overline font-semibold text-white sm:whitespace-nowrap"
              />
            </div>
          ))}
        </div>

        <p className="text-center">
          <LocalizedLink
            href="/insights"
            className="inline-flex h-9 items-center justify-center rounded-[var(--radius-field)] border border-sapphire-300 px-6 text-body-sm font-semibold text-brand hover:bg-sapphire-50"
          >
            <EditableText
              relUrl={cms.relUrl}
              blockKey={pulseKeys.cta}
              locale={locale}
              placeholderContent={ctaPlaceholder}
              placeholderTag="span"
              className="relative"
            />
          </LocalizedLink>
        </p>
      </div>
    </section>
  );
}
