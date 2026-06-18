import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import { CatalogHeroSection } from "@/components/sections/CatalogHeroSection";
import { EditableCtaBand } from "@/components/sections/EditableCtaBand";
import { ApiPagination, CatalogEmptyState, CommunityCard } from "@/components/ui";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui";
import { getAreas } from "@/lib/api/areas";
import { mapAreaToCommunityCard } from "@/lib/mappers/area";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { localizedHref, resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "areas");
}

export default async function AreasPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const sp = await searchParams;
  const page = sp.page ? Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) : 1;
  const { data, meta } = await getAreas({ page, per_page: 9, locale });
  const areas = data.map((area) => mapAreaToCommunityCard(area, locale));
  const t = await getTranslations({ locale, namespace: "pages.areas" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const areaBlocks = pageBlockKeys.areas;

  return (
    <SiteShell>
      <CatalogHeroSection
        page="areas"
        locale={locale}
        placeholders={{
          eyebrow: await getCmsPlaceholder("placeholders.areas.hero", "eyebrow", locale),
          title: await getCmsPlaceholder("placeholders.areas.hero", "title", locale),
          description: await getCmsPlaceholder("placeholders.areas.hero", "description", locale),
        }}
      />

      <section className="w-full bg-surface">
        <Container className="py-12 sm:py-16">
          {areas.length === 0 ? (
            <CatalogEmptyState message={t("empty")} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {areas.map((area) => (
                <CommunityCard key={area.href} {...area} />
              ))}
            </div>
          )}
          <ApiPagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            basePath={localizedHref(locale, "/areas")}
          />
        </Container>
      </section>

      <EditableCtaBand
        relUrl={areaBlocks.relUrl}
        blockKey={areaBlocks.cta.title}
        locale={locale}
        placeholderContent={await getCmsPlaceholder("pages.areas", "ctaTitle", locale)}
        actions={
          <Button href="/contact" variant="accent">
            {tc("speakWith")} {tc("nip")}
          </Button>
        }
      />
    </SiteShell>
  );
}
