import { EditableText } from "@/components/EditableText";
import { MemberAdvisorMessageDialog } from "@/components/forms/MemberAdvisorMessageForm";
import { MemberSignOutButton } from "@/components/forms/MemberSignOutButton";
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
import { getRequestLocale } from "@/lib/i18n/server";

function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

const curatedBlocks = pageBlockKeys.curated;

async function CuratedSectionHeading({
  eyebrow,
  title,
  description,
  eyebrowKey,
  titleKey,
  descriptionKey,
}: {
  eyebrow: string;
  title: string;
  description: string;
  eyebrowKey: string;
  titleKey: string;
  descriptionKey: string;
}) {
  const locale = await getRequestLocale();

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <EditableText
        relUrl={curatedBlocks.relUrl}
        blockKey={eyebrowKey}
        locale={locale}
        placeholderContent={eyebrow}
        placeholderTag="p"
        className="text-overline font-semibold text-accent"
      />
      <EditableText
        relUrl={curatedBlocks.relUrl}
        blockKey={titleKey}
        locale={locale}
        placeholderContent={title}
        placeholderTag="h2"
        className="font-[family-name:var(--font-display)] text-[36px] uppercase leading-[38px] tracking-[-0.02em] text-brand sm:text-[44px] sm:leading-[42px]"
      />
      <EditableText
        relUrl={curatedBlocks.relUrl}
        blockKey={descriptionKey}
        locale={locale}
        placeholderContent={description}
        placeholderTag="p"
        className="max-w-[464px] text-body-md leading-[22px] text-ink-secondary"
      />
    </div>
  );
}

export async function CuratedHeroSection({ user }: { user: ApiMemberUser }) {
  const locale = await getRequestLocale();
  const advisorName = user.advisor?.name ?? "Your Advisor";
  const hero = curatedBlocks.hero;

  return (
    <section
      data-site-hero
      className="bg-[linear-gradient(166.53deg,#254672_0%,#081a33_71.43%)] py-14 text-white sm:py-16 lg:py-20"
    >
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between",
          )}
        >
          <div className="flex max-w-[680px] flex-col gap-4">
            <div className="space-y-2">
              <EditableText
                relUrl={curatedBlocks.relUrl}
                blockKey={hero.eyebrow}
                locale={locale}
                placeholderContent="Private Office | Curated for You"
                placeholderTag="p"
                className="text-overline font-semibold text-gold"
              />
              <EditableText
                relUrl={curatedBlocks.relUrl}
                blockKey={hero.badge}
                locale={locale}
                placeholderContent="By Introduction Only"
                placeholderTag="p"
                className="text-overline font-semibold uppercase tracking-[0.18em] text-platinum-400"
              />
            </div>
            <EditableText
              relUrl={curatedBlocks.relUrl}
              blockKey={hero.title}
              locale={locale}
              placeholderContent="Selected for You, by Your Advisor"
              placeholderTag="h1"
              className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-white sm:text-[52px] sm:leading-[50px]"
            />
            <EditableText
              relUrl={curatedBlocks.relUrl}
              blockKey={hero.description}
              locale={locale}
              placeholderContent="A confidential selection of properties and projects aligned with your mandate. Curated, never catalogued. Released by your advisor as relevant."
              placeholderTag="p"
              className="text-body-lg leading-[28px] text-sapphire-100"
            />
          </div>
          <div className="shrink-0 lg:text-right">
            <p className="text-overline font-semibold text-platinum-400">Your Advisor</p>
            <p className="mt-2 text-lg font-bold text-white">{advisorName}</p>
            <p className="mt-1 text-body-xs text-sapphire-100">
              {user.advisor?.availability ?? "Responds within hours | Mon–Fri"}
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
  items?: Array<{ id?: number; title: string; excerpt: string }>;
}) {
  const selection = curatedBlocks.selection;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "space-y-10")}>
          <CuratedSectionHeading
            eyebrow="YOUR CURATED VIEW"
            title="A Considered Selection"
            description="Properties and projects released for your mandate — each with advisor context below."
            eyebrowKey={selection.eyebrow}
            titleKey={selection.title}
            descriptionKey={selection.description}
          />
          {items.length === 0 ? (
            <CatalogEmptyState message="No curated selections have been released yet." />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {items.map((item) => (
                <AdvisorCard key={item.id ?? item.title} title={item.title} excerpt={item.excerpt} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export async function CuratedNotesSection({ notes = [] }: { notes?: ApiAdvisorNote[] }) {
  const notesBlocks = curatedBlocks.notes;

  return (
    <section className="bg-sapphire-50 py-16 sm:py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "space-y-10")}>
          <CuratedSectionHeading
            eyebrow="ADVISOR NOTES"
            title="Context Behind the Selection"
            description="Private notes from your advisor explaining why each opportunity was included — or set aside."
            eyebrowKey={notesBlocks.eyebrow}
            titleKey={notesBlocks.title}
            descriptionKey={notesBlocks.description}
          />
          {notes.length === 0 ? (
            <CatalogEmptyState message="Advisor notes will appear here when your advisor adds context." />
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <article
                  key={note.id}
                  className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-body-md font-bold leading-[22px] text-brand">
                      {note.title}
                    </p>
                    <span className="shrink-0 text-body-xs leading-4 text-ink-tertiary">
                      {formatNoteDate(note.createdAt)}
                    </span>
                  </div>
                  <p className="mt-3 max-w-[760px] text-body-sm leading-[18px] text-ink-secondary">
                    {note.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function CuratedAdvisorBarSection({
  advisor,
  locale = "en",
}: {
  advisor?: ApiMemberAdvisor | null;
  locale?: Locale;
}) {
  const name = advisor?.name ?? "your advisor";

  return (
    <section className="border-t border-line bg-white">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-start justify-between gap-6 py-8 sm:flex-row sm:items-center",
          )}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
              <Icon name="user" className="h-5 w-5" />
            </span>
            <p className="max-w-[520px] text-body-sm leading-[18px] text-ink-secondary">
              <span className="font-bold text-brand">Have a question on this selection?</span>{" "}
              Message {name} directly — typically responds within hours.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <MemberAdvisorMessageDialog advisorName={name} locale={locale} />
            <MemberSignOutButton redirectTo={localizedHref(locale, "/private-office")} />
          </div>
        </div>
      </div>
    </section>
  );
}
