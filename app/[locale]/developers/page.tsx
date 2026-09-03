import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import { CatalogHeroSection } from "@/components/sections/CatalogHeroSection";
import { EditableCtaBand } from "@/components/sections/EditableCtaBand";
import { ApiPagination, CatalogEmptyState, CenteredCardGrid, DeveloperCard } from "@/components/ui";
import { Container } from "@/components/ui/Container";
import { getDevelopers } from "@/lib/api/developers";
import { getDeveloperPropertyCount } from "@/lib/mappers/developer";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { localizedHref, resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";

export const dynamic = "force-dynamic";

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
  const { data, meta } = await getDevelopers({ page, per_page: 9, locale, globalOrder: true });
  const t = await getTranslations({ locale, namespace: "pages.developers" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const developerBlocks = pageBlockKeys.developers;

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
            <CenteredCardGrid gap="section" data-reveal-stagger>
              {data.map((developer) => {
                const propertyCount = getDeveloperPropertyCount(developer);

                return (
                  <DeveloperCard
                    key={developer.id}
                    href={localizedHref(locale, `/developers/${developer.slug}`)}
                    name={developer.name}
                    viewMakerLabel={tc("viewMaker")}
                    projectsLabel={
                      propertyCount != null
                        ? tc("projects", { count: propertyCount })
                        : undefined
                    }
                  />
                );
              })}
            </CenteredCardGrid>
          )}
          <ApiPagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            basePath={localizedHref(locale, "/developers")}
          />
        </Container>
      </section>

      <EditableCtaBand
        relUrl={developerBlocks.relUrl}
        blockKey={developerBlocks.cta.title}
        locale={locale}
        placeholderContent={await getCmsPlaceholder("pages.developers", "ctaTitle", locale)}
        eyebrow={t("advisory")}
        actions={
          <Link
            href={localizedHref(locale, "/contact")}
            className="inline-flex items-center justify-center gap-[3px] rounded-[var(--radius-field)] bg-white px-6 py-[9px] text-overline text-brand transition-colors hover:bg-sapphire-50"
          >
            <span className="font-semibold">{tc("speakWith")}</span>
            <span className="font-[family-name:var(--font-logo)] font-medium">
              {tc("nip")}
            </span>
          </Link>
        }
      />
    </SiteShell>
  );
}
