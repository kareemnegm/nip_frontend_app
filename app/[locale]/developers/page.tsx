import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import { CatalogHeroSection } from "@/components/sections/CatalogHeroSection";
import { CtaBand } from "@/components/sections";
import { ApiPagination, CatalogEmptyState, Button, Container, Icon } from "@/components/ui";
import { getDevelopers } from "@/lib/api/developers";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { localizedHref, resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "developers");
}

export default async function DevelopersPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const sp = await searchParams;
  const page = sp.page ? Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) : 1;
  const { data, meta } = await getDevelopers({ page, per_page: 9, locale });
  const t = await getTranslations({ locale, namespace: "pages.developers" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <SiteShell>
      <CatalogHeroSection
        page="developers"
        locale={locale}
        placeholders={{
          eyebrow: await getCmsPlaceholder("placeholders.developers.hero", "eyebrow", locale),
          title: await getCmsPlaceholder("placeholders.developers.hero", "title", locale),
          description: await getCmsPlaceholder("placeholders.developers.hero", "description", locale),
        }}
      />

      <section className="w-full bg-surface">
        <Container className="py-12 sm:py-16">
          {data.length === 0 ? (
            <CatalogEmptyState message={t("empty")} />
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
                      {tc("projects", { count: developer.properties_count })}
                    </span>
                  ) : null}
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    {tc("viewMaker")}{" "}
                    <Icon name="arrowRight" className="h-4 w-4 rtl:rotate-180" />
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
        title={t("ctaTitle")}
        actions={
          <Button href="/contact" variant="accent">
            {tc("speakWith")} {tc("nip")}
          </Button>
        }
      />
    </SiteShell>
  );
}
