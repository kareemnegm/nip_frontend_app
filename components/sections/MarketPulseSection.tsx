import { AppLink as Link } from "@/components/AppLink";
import { getTranslations } from "next-intl/server";
import { CurrencyIcon } from "@/components/ui/CurrencyIcon";
import { siteMarketPulseLayoutClassName, siteSectionY } from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

/**
 * Figma 1525:28295/28300/28301 — 1056px inner (192px gutters), 4 stat cards
 * fixed at 252×137px each at desktop, gap-16 (16px), px-28 py-24 padding.
 * Card backgrounds: sapphire-400, 500, 600, 700
 * Context color: sapphire-100 on card-1 (lighter bg), sapphire-200 on cards 2-4
 * Stat value: Archivo Bold 36px, Figma trims the line-box to the digit
 * cap-height (25px row) — reproduced here with leading-[25px] so the
 * 3 stacked rows (16 + 25 + 16) + 2×16 gaps + 24px padding = 137px exactly.
 * Label: Archivo SemiBold 12/16 white → text-overline font-semibold
 */
const cardBg = ["bg-sapphire-400", "bg-sapphire-500", "bg-sapphire-600", "bg-sapphire-700"] as const;
const cardContext = ["text-sapphire-100", "text-sapphire-200", "text-sapphire-200", "text-sapphire-200"] as const;

export async function MarketPulseSection() {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "home" });

  const marketPulseStats = [
    { context: t("marketPulse.stat1Context"), label: t("marketPulse.stat1Label"), count: "2400", prefix: "", suffix: "", decimals: 0, icon: true },
    { context: t("marketPulse.stat2Context"), label: t("marketPulse.stat2Label"), count: "12", prefix: "", suffix: "", decimals: 0 },
    { context: t("marketPulse.stat3Context"), label: t("marketPulse.stat3Label"), count: "6.2", prefix: "", suffix: "%", decimals: 1 },
    { context: t("marketPulse.stat4Context"), label: t("marketPulse.stat4Label"), count: "28", prefix: "", suffix: "", decimals: 0 },
  ];

  return (
    <section className={cn("bg-white", siteSectionY)}>
      <div className={siteMarketPulseLayoutClassName}>
        <SectionHeading
          title={await getCmsPlaceholder("placeholders.home.marketPulse", "title", locale)}
          description={await getCmsPlaceholder("placeholders.home.marketPulse", "desc", locale)}
          descriptionMaxWidth="max-w-[464px]"
          editable={{
            relUrl: homeEditable.relUrl,
            titleKey: homeEditable.marketPulse.titleKey,
            descKey: homeEditable.marketPulse.descKey,
          }}
        />

        <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
          {marketPulseStats.map((stat, index) => (
            <div
              key={stat.label}
              data-reveal
              data-reveal-delay={index > 0 ? String(Math.min(index, 3)) : undefined}
              className={[
                "flex flex-col justify-center gap-4 overflow-hidden rounded-[var(--radius-card)] px-4 py-4 text-white sm:h-[137px] sm:px-7 sm:py-6",
                "items-center text-center sm:items-start sm:text-start",
                cardBg[index],
              ].join(" ")}
            >
              <p
                className={[
                  "sm:whitespace-nowrap text-body-xs font-normal",
                  cardContext[index],
                ].join(" ")}
              >
                {stat.context}
              </p>

              <p className="flex items-center gap-1 text-stat-value-sm font-bold sm:gap-1.5 sm:text-stat-value sm:leading-[25px]">
                {stat.icon ? (
                  <CurrencyIcon currency="AED" className="h-5 w-5 shrink-0 sm:h-7 sm:w-7" />
                ) : null}
                <span
                  data-count={stat.count}
                  data-count-prefix={stat.prefix}
                  data-count-suffix={stat.suffix}
                  data-count-decimals={String(stat.decimals)}
                >
                  {stat.decimals > 0 ? stat.count : Number(stat.count).toLocaleString()}
                  {stat.suffix}
                </span>
              </p>

              <p className="text-overline font-semibold text-white sm:whitespace-nowrap">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center">
          <Link
            href="/insights"
            className="inline-flex h-9 items-center justify-center rounded-[var(--radius-field)] border border-sapphire-300 px-6 text-body-sm font-semibold text-brand hover:bg-sapphire-50"
          >
            {t("marketPulse.viewPerspective")}
          </Link>
        </p>
      </div>
    </section>
  );
}
