import { EditableText } from "@/components/EditableText";
import { ContactRequestForm } from "@/components/ui/LeadForms";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getRequestLocale } from "@/lib/i18n/server";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

const blocks = pageBlockKeys.contact;

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
              placeholderContent="NIP PRIVATE ADVISORY"
              placeholderTag="p"
              className="text-overline font-semibold leading-4 text-accent"
            />
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={blocks.hero.title}
              locale={locale}
              placeholderContent="Speak with NIP"
              placeholderTag="h1"
              className="font-[family-name:var(--font-display)] text-[44px] leading-[42px] tracking-[-0.02em] text-brand"
            />
          </div>
          <EditableText
            relUrl={blocks.relUrl}
            blockKey={blocks.hero.description}
            locale={locale}
            placeholderContent="A considered property decision begins with a conversation."
            placeholderTag="p"
            className="max-w-[680px] text-body-lg leading-[28px] text-ink-secondary"
          />
        </div>
      </div>
    </section>
  );
}

export async function ContactFormSection() {
  const locale = await getRequestLocale();

  return (
    <section className="bg-white pb-[72px] pt-10">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "grid gap-10 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-16",
          )}
        >
          <div className="max-w-[512px] lg:pt-4">
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={blocks.intro.overline}
              locale={locale}
              placeholderContent="PRIVATE ADVISORY | BY INVITATION"
              placeholderTag="p"
              className="text-overline font-semibold text-accent"
            />
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={blocks.intro.body}
              locale={locale}
              placeholderContent="Whether you are exploring Dubai for residence, investment, relocation, portfolio strategy, or a private acquisition, NIP can help you understand the market before you commit to a path."
              placeholderTag="p"
              className="mt-5 text-body-lg leading-[28px] text-ink-secondary"
            />
          </div>
          <ContactRequestForm />
        </div>
      </div>
    </section>
  );
}
