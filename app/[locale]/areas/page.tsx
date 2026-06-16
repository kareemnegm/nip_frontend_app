import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { CatalogHeroSection } from "@/components/sections/CatalogHeroSection";
import { CtaBand } from "@/components/sections";
import { ApiPagination, CatalogEmptyState, CommunityCard } from "@/components/ui";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui";
import { getAreas } from "@/lib/api/areas";
import { mapAreaToCommunityCard } from "@/lib/mappers/area";
import { localizedHref, resolveLocale } from "@/lib/i18n/helpers";

export const metadata: Metadata = {
  title: "Areas | NIP Reality",
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AreasPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const sp = await searchParams;
  const page = sp.page ? Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) : 1;
  const { data, meta } = await getAreas({ page, per_page: 9 });
  const areas = data.map((area) => mapAreaToCommunityCard(area, locale));

  return (
    <SiteShell>
      <CatalogHeroSection
        page="areas"
        locale={locale}
        placeholders={{
          eyebrow: "Areas | Communities",
          title: "Explore Dubai's Communities",
          description:
            "A considered guide to the neighbourhoods shaping long-term value across Dubai.",
        }}
      />

      <section className="w-full bg-surface">
        <Container className="py-12 sm:py-16">
          {areas.length === 0 ? (
            <CatalogEmptyState message="Communities will appear here once areas are published on the backend." />
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

      <CtaBand
        title="Considering a Move to Dubai?"
        actions={<Button href="/contact" variant="accent">Speak with NIP</Button>}
      />
    </SiteShell>
  );
}
