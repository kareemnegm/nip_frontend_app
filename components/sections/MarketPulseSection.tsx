import { AppLink as Link } from "@/components/AppLink";
import { getTranslations } from "next-intl/server";
import { CurrencyIcon } from "@/components/ui/CurrencyIcon";
import { Container } from "@/components/ui/Container";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

/**
 * Figma 1525:28300 — 4 stat cards, gap-16, px-28 py-24
 * Card backgrounds: sapphire-400, 500, 600, 700
 * Context color: sapphire-100 on card-1 (lighter bg), sapphire-200 on cards 2-4
 * Stat value: Archivo Bold 36/42 white → text-stat-value font-bold
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
    <section className="bg-white py-16 sm:py-20">
      <Container className="max-w-[1056px] space-y-10 px-6">
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {marketPulseStats.map((stat, index) => (
            <div
              key={stat.label}
              data-reveal
              data-reveal-delay={index > 0 ? String(Math.min(index, 3)) : undefined}
              className={[
                "flex flex-col gap-2 rounded-[var(--radius-card)] px-4 py-4 text-white sm:gap-4 sm:px-7 sm:py-6",
                "items-center text-center sm:items-start sm:text-start",
                cardBg[index],
              ].join(" ")}
            >
              <p className={["text-body-xs font-normal", cardContext[index]].join(" ")}>
                {stat.context}
              </p>

              <p className="flex items-center gap-1 text-stat-value-sm font-bold sm:gap-1.5 sm:text-stat-value">
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

              <p className="text-overline font-semibold text-white">{stat.label}</p>
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
      </Container>
    </section>
  );
}
