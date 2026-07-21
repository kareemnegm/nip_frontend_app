import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { CuratedAdvisorCta } from "@/components/forms/CuratedAdvisorCta";
import { EditableText } from "@/components/EditableText";
import { AdvisorCard, Icon } from "@/components/ui";
import { CatalogEmptyState } from "@/components/ui/ApiPagination";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import type { ApiAdvisorNote, ApiMemberAdvisor, ApiMemberUser } from "@/types/api";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { cn } from "@/lib/cn";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";

function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

const curatedBlocks = pageBlockKeys.curated;

type CuratedSection = "selection" | "notes";

async function CuratedSectionHeading({
  section,
  showDescription = false,
}: {
  section: CuratedSection;
  showDescription?: boolean;
}) {
  const locale = await getRequestLocale();
  const ns = `placeholders.curated.${section}` as const;
  const blocks = curatedBlocks[section];

  return (
    <div className="flex max-w-3xl flex-col gap-1.5">
      <EditableText
        relUrl={curatedBlocks.relUrl}
        blockKey={blocks.eyebrow}
        locale={locale}
        placeholderContent={await getCmsPlaceholder(ns, "eyebrow", locale)}
        placeholderTag="p"
        className="text-overline font-semibold text-brand"
      />
      <EditableText
        relUrl={curatedBlocks.relUrl}
        blockKey={blocks.title}
        locale={locale}
        placeholderContent={await getCmsPlaceholder(ns, "title", locale)}
        placeholderTag="h2"
        className="font-display text-heading-h1 uppercase text-ink"
      />
      {showDescription ? (
        <EditableText
          relUrl={curatedBlocks.relUrl}
          blockKey={blocks.description}
          locale={locale}
          placeholderContent={await getCmsPlaceholder(ns, "description", locale)}
          placeholderTag="p"
          className="max-w-[464px] text-body-sm text-ink-secondary"
        />
      ) : null}
    </div>
  );
}

export async function CuratedHeroSection({ user }: { user: ApiMemberUser }) {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "privateOffice" });
  const advisorName = user.advisor?.name ?? t("yourAdvisor");
  const hero = curatedBlocks.hero;
  const memberHref = localizedHref(locale, "/private-office/member");

  return (
    <section data-site-hero className="bg-sapphire-800 pb-10 pt-14 text-white">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between",
          )}
        >
          <div className="flex max-w-[611px] flex-col gap-4">
            <p className="text-body-xs text-platinum-200">
              <Link href={memberHref} className="hover:text-white">
                {t("title")}
              </Link>
              {" › "}
              <EditableText
                relUrl={curatedBlocks.relUrl}
                blockKey={hero.eyebrow}
                locale={locale}
                placeholderContent={await getCmsPlaceholder(
                  "placeholders.curated.hero",
                  "eyebrow",
                  locale,
                )}
                placeholderTag="span"
                className="inline text-body-xs text-platinum-200"
              />
            </p>
            <div className="flex items-center gap-1.5">
              <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden />
              <EditableText
                relUrl={curatedBlocks.relUrl}
                blockKey={hero.badge}
                locale={locale}
                placeholderContent={await getCmsPlaceholder("placeholders.curated.hero", "badge", locale)}
                placeholderTag="p"
                className="text-overline font-semibold uppercase text-accent-on-dark"
              />
            </div>
            <EditableText
              relUrl={curatedBlocks.relUrl}
              blockKey={hero.title}
              locale={locale}
              placeholderContent={await getCmsPlaceholder("placeholders.curated.hero", "title", locale)}
              placeholderTag="h1"
              className="font-display text-heading-h1 uppercase text-white"
            />
            <EditableText
              relUrl={curatedBlocks.relUrl}
              blockKey={hero.description}
              locale={locale}
              placeholderContent={await getCmsPlaceholder("placeholders.curated.hero", "description", locale)}
              placeholderTag="p"
              className="text-body-sm text-text-inactive"
            />
          </div>
          <div className="shrink-0 lg:text-right">
            <p className="text-label-muted font-medium uppercase text-platinum-200">
              {t("yourAdvisor").toUpperCase()}
            </p>
            <p className="mt-2 text-h4 font-semibold text-white">{advisorName}</p>
            <p className="mt-2 text-body-xs text-accent-on-dark">
              {user.advisor?.availability ?? t("respondsWithinHours")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function CuratedSelectionSection({
  items = [],
}: {
  items?: Array<{
    id?: number;
    title: string;
    excerpt: string;
    href?: string;
    imageUrl?: string;
  }>;
}) {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "pages.curated" });

  return (
    <section className="bg-white py-14">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "flex flex-col gap-6")}>
          <CuratedSectionHeading section="selection" />
          {items.length === 0 ? (
            <CatalogEmptyState message={t("noCurated")} />
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {items.map((item) => (
                <AdvisorCard
                  key={item.id ?? item.title}
                  title={item.title}
                  excerpt={item.excerpt}
                  href={item.href}
                  imageUrl={item.imageUrl}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export async function CuratedNotesSection({ notes = [] }: { notes?: ApiAdvisorNote[] }) {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "pages.curated" });

  return (
    <section className="bg-sapphire-50 py-14">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "flex flex-col gap-6")}>
          <CuratedSectionHeading section="notes" />
          {notes.length === 0 ? (
            <CatalogEmptyState message={t("noNotes")} />
          ) : (
            <div className="flex max-w-[820px] flex-col gap-4">
              {notes.map((note) => (
                <article
                  key={note.id}
                  className="rounded-[var(--radius-card)] border border-line bg-white px-6 py-5"
                >
                  <div className="flex flex-wrap items-center gap-2 text-body-xs leading-4">
                    <p className="font-semibold text-ink">{note.title}</p>
                    <span className="text-ink-tertiary">{formatNoteDate(note.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-body-sm text-ink-secondary">{note.content}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export async function CuratedAdvisorBarSection({
  advisor,
  locale = "en",
}: {
  advisor?: ApiMemberAdvisor | null;
  locale?: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "privateOffice" });
  const name = advisor?.name ?? t("yourAdvisor");
  const contactHref = localizedHref(locale, "/contact");

  return (
    <section className="bg-white">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-start justify-between gap-6 py-8 sm:flex-row sm:items-center",
          )}
        >
          <div className="flex items-center gap-3.5">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-white">
              <Icon name="user" className="h-6 w-6" />
            </span>
            <div className="flex flex-col gap-2">
              <p className="text-h4 font-semibold text-ink">{t("haveQuestion")}</p>
              <p className="text-body-sm text-ink-tertiary">{t("messageDirectly", { name })}</p>
            </div>
          </div>
          <CuratedAdvisorCta advisorName={name} locale={locale} contactHref={contactHref} />
        </div>
      </div>
    </section>
  );
}
