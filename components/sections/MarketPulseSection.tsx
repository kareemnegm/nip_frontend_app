import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CommunityCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { CatalogEmptyState } from "@/components/ui/ApiPagination";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";
import type { CommunityCardModel } from "@/lib/mappers/area";

export async function MarketPulseSection({
  areas = [],
}: {
  areas?: CommunityCardModel[];
}) {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  const te = await getTranslations({ locale, namespace: "home.empty" });

  const marketPulseStats = [
    { context: t("marketPulse.stat1Context"), label: t("marketPulse.stat1Label"), value: "2,400", icon: true },
    { context: t("marketPulse.stat2Context"), label: t("marketPulse.stat2Label"), value: "12" },
    { context: t("marketPulse.stat3Context"), label: t("marketPulse.stat3Label"), value: "6.2%" },
    { context: t("marketPulse.stat4Context"), label: t("marketPulse.stat4Label"), value: "28" },
  ];

  return (
    <>
      <section className="bg-white py-16 sm:py-20">
        <Container className="max-w-[1056px] space-y-10 px-6">
          <SectionHeading
            title={await getCmsPlaceholder("placeholders.home.marketPulse", "title", locale)}
            description={await getCmsPlaceholder("placeholders.home.marketPulse", "desc", locale)}
            editable={{
              relUrl: homeEditable.relUrl,
              titleKey: homeEditable.marketPulse.titleKey,
              descKey: homeEditable.marketPulse.descKey,
            }}
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {marketPulseStats.map((stat, index) => (
              <div
                key={stat.label}
                className={[
                  "rounded-[var(--radius-card)] px-7 py-6 text-white",
                  ["bg-sapphire-400", "bg-sapphire-500", "bg-sapphire-600", "bg-sapphire-700"][index],
                ].join(" ")}
              >
                <p className="text-xs leading-4 text-sapphire-100">{stat.context}</p>
                <p className="mt-4 flex items-center gap-1.5 text-4xl font-bold leading-[42px]">
                  {stat.icon ? <span className="text-2xl">AED</span> : null}
                  {stat.value}
                </p>
                <p className="mt-4 text-xs font-semibold leading-4 text-white">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center">
            <Link
              href="/insights"
              className="inline-flex h-9 items-center justify-center rounded-[var(--radius-field)] border border-sapphire-300 px-6 text-[13px] font-semibold leading-[18px] text-brand hover:bg-sapphire-50"
            >
              {t("marketPulse.viewPerspective")}
            </Link>
          </p>
        </Container>
      </section>

      {areas.length > 0 ? (
        <section className="bg-sapphire-50 py-16 sm:py-20">
          <Container className="space-y-10">
            <SectionHeading
              title={t("featuredAreas.title")}
              description={t("featuredAreas.description")}
            />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {areas.slice(0, 3).map((area) => (
                <CommunityCard key={area.href} {...area} />
              ))}
            </div>
          </Container>
        </section>
      ) : (
        <section className="bg-sapphire-50 py-16 sm:py-20">
          <Container>
            <CatalogEmptyState message={te("areas")} />
          </Container>
        </section>
      )}
    </>
  );
}
