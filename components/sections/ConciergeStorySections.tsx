import { getTranslations } from "next-intl/server";
import { ConciergeChat } from "@/components/concierge/ConciergeChat";
import { EditableText } from "@/components/EditableText";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Icon } from "@/components/ui";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import { siteMaxWidth, sitePageGutterX } from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

const conciergeBlocks = pageBlockKeys.concierge;

export async function ConciergePageSection() {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "pages.concierge" });

  return (
    <section
      data-site-hero
      className="bg-surface-muted pb-20 pt-16"
    >
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[860px] flex-col items-center gap-7">
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <EditableText
              relUrl={conciergeBlocks.relUrl}
              blockKey={conciergeBlocks.hero.eyebrow}
              locale={locale}
              placeholderContent={await getCmsPlaceholder(
                "placeholders.concierge.hero",
                "eyebrow",
                locale,
              )}
              placeholderTag="p"
              className="text-overline font-semibold text-accent"
            />
            <EditableText
              relUrl={conciergeBlocks.relUrl}
              blockKey={conciergeBlocks.hero.title}
              locale={locale}
              placeholderContent={await getCmsPlaceholder(
                "placeholders.concierge.hero",
                "title",
                locale,
              )}
              placeholderTag="h1"
              className="font-[family-name:var(--font-display)] text-[44px] leading-[42px] tracking-[-0.02em] text-brand"
            />
            <EditableText
              relUrl={conciergeBlocks.relUrl}
              blockKey={conciergeBlocks.hero.description}
              locale={locale}
              placeholderContent={await getCmsPlaceholder(
                "placeholders.concierge.hero",
                "description",
                locale,
              )}
              placeholderTag="p"
              className="max-w-[620px] text-body-sm leading-[18px] text-ink-secondary"
            />
          </div>

          <ConciergeChat variant="page" autoStartSession className="w-full" />

          <p className="text-center text-body-sm leading-[18px] text-brand">
            {t("preferPerson")}{" "}
            <LocalizedLink
              href="/contact"
              className="inline-flex items-center gap-1 font-semibold text-accent transition-colors hover:text-brand-hover"
            >
              {t("speakWithPrivateAdvisor")}
              <Icon name="arrowRight" className="h-4 w-4 rtl:rotate-180" />
            </LocalizedLink>
          </p>
        </div>
      </div>
    </section>
  );
}
