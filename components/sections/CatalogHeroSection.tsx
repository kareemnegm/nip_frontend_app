import { EditableText } from "@/components/EditableText";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import type { Locale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

type CatalogPage = "properties" | "offPlan" | "areas" | "developers" | "insights";

type CatalogHeroSectionProps = {
  page: CatalogPage;
  locale?: Locale;
  placeholders: {
    eyebrow: string;
    title: string;
    description?: string;
  };
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
};

export async function CatalogHeroSection({
  page,
  locale: localeProp,
  placeholders,
  children,
  className,
  innerClassName,
}: CatalogHeroSectionProps) {
  const locale = localeProp ?? (await getRequestLocale());
  const blocks = pageBlockKeys[page];
  const hero = blocks.hero;

  return (
    <section data-site-hero className={cn("bg-surface-muted pt-16 pb-9", className)}>
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "space-y-6", innerClassName)}>
          <div className="space-y-2">
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={hero.eyebrow}
              locale={locale}
              placeholderContent={placeholders.eyebrow}
              placeholderTag="p"
              className="text-overline font-semibold leading-4 text-accent"
            />
            <EditableText
              relUrl={blocks.relUrl}
              blockKey={hero.title}
              locale={locale}
              placeholderContent={placeholders.title}
              placeholderTag="h1"
              className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-brand"
            />
            {placeholders.description ? (
              <EditableText
                relUrl={blocks.relUrl}
                blockKey={hero.description}
                locale={locale}
                placeholderContent={placeholders.description}
                placeholderTag="p"
                className="max-w-[672px] text-body-sm text-ink"
              />
            ) : null}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

export type { CatalogPage };
