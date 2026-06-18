import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import {
  DeveloperAdvisoryCta,
  DeveloperHero,
} from "@/components/sections/DeveloperStorySections";
import { CatalogEmptyState, OffPlanCard, PropertyCard } from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { getDeveloperBySlug } from "@/lib/api/developers";
import { getProperties } from "@/lib/api/properties";
import { cn } from "@/lib/cn";
import { resolveLocale } from "@/lib/i18n/helpers";
import {
  isOffPlanProperty,
  mapPropertyToCard,
  mapPropertyToOffPlanCard,
} from "@/lib/mappers/property";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const developer = await getDeveloperBySlug(slug, locale);
  if (!developer) return { title: "Developer | NIP Reality" };
  return {
    title: `${developer.name} | Developers | NIP Reality`,
    description: developer.description?.slice(0, 160),
  };
}

export default async function DeveloperPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const developer = await getDeveloperBySlug(slug, locale);
  if (!developer) notFound();

  const { data: properties } = await getProperties({ developer: slug, per_page: 9, locale });
  const t = await getTranslations({ locale, namespace: "pages.developers" });

  return (
    <SiteShell>
      <DeveloperHero
        title={developer.name}
        description={developer.description ?? t("portfolioFallback")}
      />

      <section className="bg-white py-16">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={cn(sitePageInnerClassName, "space-y-8")}>
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase text-brand">
              {t("portfolio")}
            </h2>
            {properties.length === 0 ? (
              <CatalogEmptyState message={t("noListings")} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => {
                  if (isOffPlanProperty(property)) {
                    const card = mapPropertyToOffPlanCard(property, locale);
                    return <OffPlanCard key={property.id} className="min-h-[480px]" {...card} />;
                  }
                  const card = mapPropertyToCard(property, locale);
                  return <PropertyCard key={property.id} className="min-h-[480px]" {...card} />;
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <DeveloperAdvisoryCta developerName={developer.name} />
    </SiteShell>
  );
}
