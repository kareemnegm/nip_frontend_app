import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import type { PropertyCardProps } from "@/components/ui/Cards";
import { PropertyCard } from "@/components/ui/Cards";
import { CardCarousel } from "@/components/ui/CardCarousel";
import { Container } from "@/components/ui/Container";
import { CatalogEmptyState } from "@/components/ui/ApiPagination";
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

  return (
    <section className="bg-sapphire-50 py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          title={await getCmsPlaceholder("placeholders.home.curatedCollection", "title", locale)}
          description={await getCmsPlaceholder("placeholders.home.curatedCollection", "desc", locale)}
          editable={{
            relUrl: homeEditable.relUrl,
            titleKey: homeEditable.curatedCollection.titleKey,
            descKey: homeEditable.curatedCollection.descKey,
          }}
        />
        {properties.length === 0 ? (
          <CatalogEmptyState message={t("curated")} />
        ) : (
          <CardCarousel slideWidth={408} gap={24}>
            {properties.map((property, index) => (
              <PropertyCard key={property.href ?? `curated-${index}`} {...property} />
            ))}
          </CardCarousel>
        )}
        <div className="flex justify-center">
          <Button href="/properties" size="lg" className="h-9">
            {tc("exploreCollection")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
