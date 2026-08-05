import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import {
  AreaAboutSection,
  AreaCardSection,
  AreaExploreCta,
  AreaHero,
  AreaMapSection,
} from "@/components/sections/AreaStorySections";
import { FactsStrip, OffPlanCard, PropertyCard } from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { getAreaBySlug } from "@/lib/api/areas";
import { resolveMediaUrl } from "@/lib/api/media-url";
import { getProperties } from "@/lib/api/properties";
import {
  areaFactsFromApi,
  resolveAreaConnectivity,
  resolveAreaHighlights,
  type AreaDetailLabels,
} from "@/lib/area/detail";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { mapPropertyToCard, mapPropertyToOffPlanCard } from "@/lib/mappers/property";

type AreaDetailPageProps = {
  locale: Locale;
  slug: string;
};

export async function AreaDetailPage({ locale, slug }: AreaDetailPageProps) {
  const area = await getAreaBySlug(slug, locale);
  if (!area) notFound();

  // Every project the facts strip counts has to be reachable in the carousel
  // below it, so fetch the whole set rather than one grid row's worth. The cap
  // is a guard against an outlier area, not a display choice.
  const [offPlanListings, saleListings, tAreas, tCommon] = await Promise.all([
    getProperties({ area: slug, listing_type: "offplan", per_page: 24, locale }),
    getProperties({ area: slug, listing_type: "sale", per_page: 24, locale }),
    getTranslations({ locale, namespace: "pages.areas" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  const labels: AreaDetailLabels = {
    avgPriceSqftLabel: tAreas("avgPriceSqftLabel"),
    communitiesLabel: tAreas("communitiesLabel"),
    offPlanProjectsLabel: tAreas("offPlanProjectsLabel"),
    readyProjectsLabel: tAreas("readyProjectsLabel"),
    avgYieldLabel: tAreas("avgYieldLabel"),
    lifestyleLabel: tAreas("lifestyleLabel"),
    toDowntownLabel: tAreas("toDowntownLabel"),
    projectsCount: tAreas("projectsCount"),
    formatToDowntownMinutes: (minutes) => tAreas("toDowntownMinutes", { minutes }),
  };

  const facts = areaFactsFromApi(area, labels);
  const highlights = resolveAreaHighlights(area);
  const connectivity = resolveAreaConnectivity(area, (label, minutes) =>
    tAreas("connectivityPill", { label, minutes }),
  );
  const heroImageUrl = resolveMediaUrl(area.image_url ?? area.photo_url);
  const mapImageUrl = resolveMediaUrl(area.map_image_url);
  const description = area.description ?? tAreas("exploreFallback");
  // Two separate fields: the hero shows its own short intro (blank until an
  // admin writes one), the About section below shows the full description.
  const heroDescription = area.hero_description?.trim() ?? "";

  return (
    <SiteShell>
      <AreaHero
        eyebrow={tAreas("areaEyebrow")}
        title={area.name}
        description={heroDescription}
        imageUrl={heroImageUrl}
      />

      {facts.length > 0 ? (
        <section className="bg-white py-10">
          <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
            <div className={sitePageInnerClassName}>
              <FactsStrip items={facts} variant="area" />
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white pb-16">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <AreaAboutSection
            title={tAreas("aboutAreaTitle", { name: area.name })}
            body={description}
            highlights={highlights}
          />
        </div>
      </section>

      {offPlanListings.data.length > 0 ? (
        <AreaCardSection
          eyebrow={tAreas("offPlanInArea", { name: area.name.toUpperCase() })}
          title={tAreas("projectsInArea")}
          variant="wide"
          layout="carousel"
        >
          {offPlanListings.data.map((property) => {
            const card = mapPropertyToOffPlanCard(property, locale);
            return (
              <OffPlanCard
                key={property.id}
                className="min-h-[480px]"
                title={card.title}
                location={card.location}
                price={card.price}
                handover={card.handover ?? "On Request"}
                href={card.href}
                imageUrl={card.imageUrl}
              />
            );
          })}
        </AreaCardSection>
      ) : null}

      {saleListings.data.length > 0 ? (
        <AreaCardSection
          eyebrow={tAreas("forSaleInArea", { name: area.name.toUpperCase() })}
          title={tAreas("availableProperties")}
          variant="standard"
          layout="carousel"
        >
          {saleListings.data.map((property) => {
            const card = mapPropertyToCard(property, locale);
            return (
              <PropertyCard key={property.id} className="min-h-[480px]" {...card} />
            );
          })}
        </AreaCardSection>
      ) : null}

      <section className="bg-white py-16">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <AreaMapSection
            title={tAreas("connectivityTitle")}
            latitude={area.latitude}
            longitude={area.longitude}
            locationName={area.name}
            locale={locale}
            imageUrl={mapImageUrl}
            connectivity={connectivity}
          />
        </div>
      </section>

      <AreaExploreCta
        eyebrow={tAreas("exploreEyebrow")}
        title={tAreas("exploreTitle", { name: area.name })}
        contactHref={localizedHref(locale, "/contact")}
        speakWithLabel={tCommon("speakWith")}
        nipLabel={tCommon("nip")}
      />
    </SiteShell>
  );
}
