import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { AreaExploreCta, AreaHero } from "@/components/sections/AreaStorySections";
import { CatalogEmptyState, PropertyCard } from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { getAreaBySlug } from "@/lib/api/areas";
import { getProperties } from "@/lib/api/properties";
import { cn } from "@/lib/cn";
import { resolveLocale } from "@/lib/i18n/helpers";
import { mapPropertyToCard, mapPropertyToOffPlanCard, isOffPlanProperty } from "@/lib/mappers/property";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);
  if (!area) return { title: "Area | NIP Reality" };
  return {
    title: `${area.name} | Areas | NIP Reality`,
    description: area.description?.slice(0, 160),
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const area = await getAreaBySlug(slug);
  if (!area) notFound();

  const { data: properties } = await getProperties({ area: slug, per_page: 6 });

  return (
    <SiteShell>
      <AreaHero title={area.name} description={area.description ?? "Explore this community across Dubai."} />

      <section className="bg-white py-16">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={cn(sitePageInnerClassName, "space-y-8")}>
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase text-brand">
              Available in {area.name}
            </h2>
            {properties.length === 0 ? (
              <CatalogEmptyState message="No published listings in this area yet." />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => {
                  const card = isOffPlanProperty(property)
                    ? mapPropertyToOffPlanCard(property, locale)
                    : mapPropertyToCard(property, locale);
                  return <PropertyCard key={property.id} className="min-h-[480px]" {...card} />;
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <AreaExploreCta areaName={area.name} />
    </SiteShell>
  );
}
