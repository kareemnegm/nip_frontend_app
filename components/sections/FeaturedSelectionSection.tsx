import { getTranslations } from "next-intl/server";
import type { PropertyCardProps } from "@/components/ui/Cards";
import { PropertyCard } from "@/components/ui/Cards";
import { CardCarousel } from "@/components/ui/CardCarousel";
import { CatalogEmptyState } from "@/components/ui/ApiPagination";
import { siteCardSectionLayoutClassName, siteSectionY } from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

export async function FeaturedSelectionSection({
  properties = [],
}: {
  properties?: PropertyCardProps[];
}) {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "home.empty" });
  const tCatalog = await getTranslations({ locale, namespace: "catalog" });
  /* Figma 1525:28332 — Featured Selection CTA only (other property cards keep "Explore Property") */
  const featuredCtaLabel = tCatalog("readPropertyStory");

  return (
    <section className={cn("overflow-hidden bg-sapphire-50", siteSectionY)}>
      {/* 80px gutters → 1280px inner at 1440px → each card ≈ 410px (Figma: 408px) */}
      <div className={siteCardSectionLayoutClassName}>
        <SectionHeading
          title={await getCmsPlaceholder("placeholders.home.featuredSelection", "title", locale)}
          description={await getCmsPlaceholder("placeholders.home.featuredSelection", "desc", locale)}
          descriptionMaxWidth="max-w-[400px]"
          editable={{
            relUrl: homeEditable.relUrl,
            titleKey: homeEditable.featuredSelection.titleKey,
            descKey: homeEditable.featuredSelection.descKey,
          }}
        />
        {properties.length === 0 ? (
          <CatalogEmptyState message={t("featured")} />
        ) : properties.length <= 3 ? (
          /* Figma 1525:28336 — 1240px row: 3×408px cards + 2×8px gaps; no side peeks */
          <div className="grid w-full max-w-[1240px] grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-2">
            {properties.map((property, index) => (
              <PropertyCard
                key={property.href ?? `featured-${index}`}
                {...property}
                ctaLabel={featuredCtaLabel}
              />
            ))}
          </div>
        ) : (
          /* Clip viewport to exactly 3 cards (1240px) so adjacent slides never peek */
          <div className="w-full max-w-[1240px] overflow-hidden">
            <CardCarousel className="w-full" slideWidth={408} gap={8} trackHeight={480}>
              {properties.map((property, index) => (
                <PropertyCard
                  key={property.href ?? `featured-${index}`}
                  {...property}
                  ctaLabel={featuredCtaLabel}
                />
              ))}
            </CardCarousel>
          </div>
        )}
      </div>
    </section>
  );
}
