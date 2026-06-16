import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { CatalogHeroSection } from "@/components/sections/CatalogHeroSection";
import { CtaBand } from "@/components/sections";
import { ApiPagination, CatalogEmptyState, Button, Container, Icon } from "@/components/ui";
import { getDevelopers } from "@/lib/api/developers";
import { localizedHref, resolveLocale } from "@/lib/i18n/helpers";

export const metadata: Metadata = {
  title: "Developers | NIP Reality",
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DevelopersPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const sp = await searchParams;
  const page = sp.page ? Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) : 1;
  const { data, meta } = await getDevelopers({ page, per_page: 9 });

  return (
    <SiteShell>
      <CatalogHeroSection
        page="developers"
        locale={locale}
        placeholders={{
          eyebrow: "Developers | Makers",
          title: "Dubai's Leading Developers",
          description:
            "The master developers behind Dubai's most recognised communities, assessed for build quality, liquidity and handover record.",
        }}
      />

      <section className="w-full bg-surface">
        <Container className="py-12 sm:py-16">
          {data.length === 0 ? (
            <CatalogEmptyState message="Developers will appear here once published on the backend." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {data.map((developer) => (
                <Link
                  key={developer.id}
                  href={localizedHref(locale, `/developers/${developer.slug}`)}
                  className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-white p-8 transition-shadow hover:shadow-[var(--shadow-card)]"
                >
                  <span className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-brand">
                    {developer.name}
                  </span>
                  {developer.properties_count != null ? (
                    <span className="text-sm text-ink-secondary">
                      {developer.properties_count} Projects
                    </span>
                  ) : null}
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    View Maker <Icon name="arrowRight" className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}
          <ApiPagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            basePath={localizedHref(locale, "/developers")}
          />
        </Container>
      </section>

      <CtaBand
        title="Looking for the Right Developer?"
        actions={<Button href="/contact" variant="accent">Speak with NIP</Button>}
      />
    </SiteShell>
  );
}
