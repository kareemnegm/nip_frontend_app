import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import {
  DeveloperAboutSection,
  DeveloperAdvisoryCta,
  DeveloperCommunitiesSection,
  DeveloperHero,
  DeveloperPortfolioSection,
} from "@/components/sections/DeveloperStorySections";
import {
  CatalogEmptyState,
  CommunityCard,
  FactsStrip,
  OffPlanCard,
  PropertyCard,
} from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { getAreaBySlug } from "@/lib/api/areas";
import { getDeveloperBySlug } from "@/lib/api/developers";
import { resolveMediaUrl } from "@/lib/api/media-url";
import { getProperties } from "@/lib/api/properties";
import { cn } from "@/lib/cn";
import {
  defaultDeveloperStrengths,
  developerFactsFromApi,
  type DeveloperDetailLabels,
  uniqueAreaSlugsFromProperties,
} from "@/lib/developer/detail";
import type { Locale } from "@/lib/i18n/config";
import { mapAreaToCommunityCard } from "@/lib/mappers/area";
import {
  isOffPlanProperty,
  mapPropertyToCard,
  mapPropertyToOffPlanCard,
} from "@/lib/mappers/property";

type DeveloperDetailPageProps = {
  locale: Locale;
  slug: string;
};

export async function DeveloperDetailPage({ locale, slug }: DeveloperDetailPageProps) {
  const developer = await getDeveloperBySlug(slug, locale);
  if (!developer) notFound();

  const [{ data: properties }, t] = await Promise.all([
    getProperties({ developer: slug, per_page: 9, locale }),
    getTranslations({ locale, namespace: "pages.developers" }),
  ]);

  const labels: DeveloperDetailLabels = {
    establishedLabel: t("establishedLabel"),
    deliveredLabel: t("deliveredLabel"),
    underDevLabel: t("underDevLabel"),
    communitiesFactLabel: t("communitiesFactLabel"),
    unitsLabel: t("unitsLabel"),
    presenceLabel: t("presenceLabel"),
    defaultEstablished: t("defaultEstablished"),
    defaultDelivered: t("defaultDelivered"),
    defaultUnderDev: t("defaultUnderDev"),
    defaultCommunities: t("defaultCommunities"),
    defaultUnits: t("defaultUnits"),
    defaultPresence: t("defaultPresence"),
    strength1: t("strength1"),
    strength2: t("strength2"),
    strength3: t("strength3"),
    strength4: t("strength4"),
    strength5: t("strength5"),
    strength6: t("strength6"),
  };

  const offPlanTotal = properties.filter(isOffPlanProperty).length;
  const facts = developerFactsFromApi(developer, offPlanTotal, labels);
  const strengths = defaultDeveloperStrengths(labels);
  const description = developer.description ?? t("portfolioFallback");
  const logoUrl = resolveMediaUrl(developer.logo_url ?? developer.photo_url);

  const areaSlugs = uniqueAreaSlugsFromProperties(properties).slice(0, 3);
  const resolvedAreas = (
    await Promise.all(areaSlugs.map((areaSlug) => getAreaBySlug(areaSlug, locale)))
  ).filter((area): area is NonNullable<typeof area> => area != null);
  const communityCards = resolvedAreas.map((area) => mapAreaToCommunityCard(area, locale));

  return (
    <SiteShell>
      <DeveloperHero
        eyebrow={t("masterDeveloperEyebrow")}
        title={developer.name}
        description={description}
        logoUrl={logoUrl}
      />

      <section className="bg-white py-10">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <FactsStrip items={facts} variant="property" />
          </div>
        </div>
      </section>

      <section className="bg-white pb-16">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <DeveloperAboutSection body={description} strengths={strengths} />
        </div>
      </section>

      <DeveloperPortfolioSection developerName={developer.name}>
        {properties.length === 0 ? (
          <div className="col-span-full">
            <CatalogEmptyState message={t("noListings")} />
          </div>
        ) : (
          properties.map((property) => {
            if (isOffPlanProperty(property)) {
              const card = mapPropertyToOffPlanCard(property, locale);
              return (
                <OffPlanCard key={property.id} className="min-h-[480px]" {...card} />
              );
            }
            const card = mapPropertyToCard(property, locale);
            return (
              <PropertyCard key={property.id} className="min-h-[480px]" {...card} />
            );
          })
        )}
      </DeveloperPortfolioSection>

      {communityCards.length > 0 ? (
        <DeveloperCommunitiesSection developerName={developer.name}>
          {communityCards.map((area) => (
            <CommunityCard key={area.href} className="min-h-[440px]" {...area} />
          ))}
        </DeveloperCommunitiesSection>
      ) : null}

      <DeveloperAdvisoryCta developerName={developer.name} />
    </SiteShell>
  );
}
