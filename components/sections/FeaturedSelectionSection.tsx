import { getTranslations } from "next-intl/server";
import type { PropertyCardProps } from "@/components/ui/Cards";
import { PropertyCard } from "@/components/ui/Cards";
import { CardCarousel } from "@/components/ui/CardCarousel";
import { Container } from "@/components/ui/Container";
import { CatalogEmptyState } from "@/components/ui/ApiPagination";
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

  return (
    <section className="bg-sapphire-50 py-16 sm:py-20">
      <Container className="space-y-10 xl:px-[100px]">
        <SectionHeading
          title={await getCmsPlaceholder("placeholders.home.featuredSelection", "title", locale)}
          description={await getCmsPlaceholder("placeholders.home.featuredSelection", "desc", locale)}
          editable={{
            relUrl: homeEditable.relUrl,
            titleKey: homeEditable.featuredSelection.titleKey,
            descKey: homeEditable.featuredSelection.descKey,
          }}
        />
        {properties.length === 0 ? (
          <CatalogEmptyState message={t("featured")} />
        ) : (
          <CardCarousel slideWidth={408} gap={8}>
            {properties.map((property, index) => (
              <PropertyCard key={property.href ?? `featured-${index}`} {...property} />
            ))}
          </CardCarousel>
        )}
      </Container>
    </section>
  );
}
