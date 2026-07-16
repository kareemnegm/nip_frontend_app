import { EditableText } from "@/components/EditableText";
import { ContactRequestForm } from "@/components/ui/LeadForms";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

const blocks = pageBlockKeys.contact;

/**
 * Figma "T14 · Speak with NIP" (`1525:27463`).
 * Hero frame `1525:27465`: bg sapphire-50, pt-64/pb-36, eyebrow accent,
 * title Didot 44/42 uppercase brand, description body-lg ink.
 */
export async function ContactHeroSection() {
  const locale = await getRequestLocale();

  return (
    <section data-site-hero className="bg-surface-muted pt-16 pb-9">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "space-y-4")}>
          <div className="space-y-2">
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={blocks.hero.eyebrow}
              locale={locale}
              placeholderContent={await getCmsPlaceholder("placeholders.contact.hero", "eyebrow", locale)}
              placeholderTag="p"
              className="text-overline font-semibold text-accent"
            />
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={blocks.hero.title}
              locale={locale}
              placeholderContent={await getCmsPlaceholder("placeholders.contact.hero", "title", locale)}
              placeholderTag="h1"
              className="font-display text-display-sm uppercase text-brand sm:text-display-lg"
            />
          </div>
          <EditableText
            relUrl={blocks.relUrl}
            blockKey={blocks.hero.description}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("placeholders.contact.hero", "description", locale)}
            placeholderTag="p"
            className="max-w-[640px] text-body-sm text-ink sm:text-body-lg"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Form frame `1525:27470`: pt-40/pb-80, 1080px inner split into a 440px
 * intro column and a 540px "Form / Lead" card (`1525:27475`).
 */
export async function ContactFormSection() {
  const locale = await getRequestLocale();

  return (
    <section className="bg-white pt-10 pb-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-start gap-10 lg:flex-row lg:justify-between",
          )}
        >
          <div className="flex w-full flex-col gap-6 lg:max-w-[440px]">
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={blocks.intro.overline}
              locale={locale}
              placeholderContent={await getCmsPlaceholder("placeholders.contact.intro", "overline", locale)}
              placeholderTag="p"
              className="text-overline font-semibold text-brand"
            />
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={blocks.intro.body}
              locale={locale}
              placeholderContent={await getCmsPlaceholder("placeholders.contact.intro", "body", locale)}
              placeholderTag="p"
              className="max-w-[420px] text-body-lg text-ink"
            />
          </div>
          <ContactRequestForm />
        </div>
      </div>
    </section>
  );
}
