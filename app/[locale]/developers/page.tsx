import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import { CatalogHeroSection } from "@/components/sections/CatalogHeroSection";
import { EditableCtaBand } from "@/components/sections/EditableCtaBand";
import { ApiPagination, CatalogEmptyState, Container, Icon } from "@/components/ui";
import { getDevelopers } from "@/lib/api/developers";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { localizedHref, resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";

const UPPERCASE_DEVELOPER_WORDS = new Set(["pjsc", "llc", "ltd", "plc", "dmcc", "uae"]);

function titleCaseDeveloperWord(word: string): string {
  const lower = word.toLowerCase();
  if (UPPERCASE_DEVELOPER_WORDS.has(lower)) {
    return lower.toUpperCase();
  }
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/** Listing only: title-case ALL-CAPS API names (e.g. EMAAR PROPERTIES). Keeps mixed-case brands (DarGlobal). */
function formatDeveloperListingName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;

  const letters = trimmed.replace(/[^A-Za-z]/g, "");
  if (letters.length === 0 || letters !== letters.toUpperCase()) {
    return trimmed;
  }

  return trimmed
    .split(/\s+/)
    .map((word) =>
      word
        .split(/(-)/)
        .map((part) => (part === "-" ? part : titleCaseDeveloperWord(part)))
        .join(""),
    )
    .join(" ");
}

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
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {data.map((developer) => (
                <Link
                  key={developer.id}
                  href={localizedHref(locale, `/developers/${developer.slug}`)}
                  className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-white p-8 transition-shadow hover:shadow-[var(--shadow-card)]"
                >
                  <span className="font-display text-h3 font-bold text-brand">
                    {formatDeveloperListingName(developer.name)}
                  </span>
                  {developer.properties_count != null ? (
                    <span className="text-body-sm text-ink-secondary">
                      {tc("projects", { count: developer.properties_count })}
                    </span>
                  ) : null}
                  <span className="mt-2 inline-flex items-center gap-1 text-label-semibold font-semibold text-accent">
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
