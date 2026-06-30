import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import type { PropertyCardProps } from "@/components/ui/Cards";
import { PropertyCard } from "@/components/ui/Cards";
import { CatalogEmptyState } from "@/components/ui/ApiPagination";
import { siteCardSectionLayoutClassName, siteSectionY } from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

export async function CuratedCollectionSection({
  properties = [],
}: {
  properties?: PropertyCardProps[];
}) {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "home.empty" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const curatedCards = properties.slice(0, 3);

  return (
    <section className={cn("bg-sapphire-50", siteSectionY)}>
      {/* 80px gutters → 1280px inner at 1440px → each card ≈ 410px (Figma: 408px) */}
      <div className={siteCardSectionLayoutClassName}>
        <SectionHeading
          title={await getCmsPlaceholder("placeholders.home.curatedCollection", "title", locale)}
          description={await getCmsPlaceholder("placeholders.home.curatedCollection", "desc", locale)}
          editable={{
            relUrl: homeEditable.relUrl,
            titleKey: homeEditable.curatedCollection.titleKey,
            descKey: homeEditable.curatedCollection.descKey,
          }}
        />
        {curatedCards.length === 0 ? (
          <CatalogEmptyState message={t("curated")} />
        ) : (
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {curatedCards.map((property, index) => (
              <PropertyCard key={property.href ?? `curated-${index}`} {...property} />
            ))}
          </div>
        )}
        <Button href="/properties" size="lg" className="h-9">
          {tc("exploreCollection")}
        </Button>
      </div>
    </section>
  );
}
