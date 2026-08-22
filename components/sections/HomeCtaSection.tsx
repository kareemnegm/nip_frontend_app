import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { siteSectionLayoutClassName, siteSectionY } from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import { homeEditable } from "./home-editable";
import type { SectionCms } from "./section-cms";
import { toSectionHeadingEditable } from "./section-cms";
import { SectionHeading } from "./SectionHeading";

const defaultCms: SectionCms = {
  relUrl: homeEditable.relUrl,
  titleKey: homeEditable.homeCta.titleKey,
  descKey: homeEditable.homeCta.descKey,
};

export async function HomeCtaSection({
  cms = defaultCms,
  placeholderNamespace = "placeholders.home.cta",
}: {
  cms?: SectionCms;
  placeholderNamespace?: string;
} = {}) {
  const locale = await getRequestLocale();
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <section className={cn("bg-white", siteSectionY)}>
      <div className={siteSectionLayoutClassName}>
        <SectionHeading
          title={await getCmsPlaceholder(placeholderNamespace, "title", locale)}
          description={await getCmsPlaceholder(placeholderNamespace, "desc", locale)}
          descriptionMaxWidth="max-w-[520px]"
          descriptionClassName="text-body-sm sm:text-body-sm"
          editable={toSectionHeadingEditable(cms)}
        />
        {/* Figma 1525:28344 — gap:12px; each button: flex:1 0 0, align-self:stretch, px-6 py-[9px], gap-1, whitespace-nowrap */}
        {/* Figma 1525:28344: row w=356px, gap=12px → each button exactly (356-12)/2 = 172px */}
        <div className="flex w-full max-w-[400px] flex-row items-stretch gap-2 sm:max-w-[356px] sm:gap-3">
          <Button
            href="/contact"
            variant="primary"
            size="lg"
            className="min-w-0 flex-1 basis-0 justify-center gap-[3px]"
          >
            <span className="font-semibold">{tc("speakWith")}</span>
            <span className="font-[family-name:var(--font-logo)] font-medium">{tc("nip")}</span>
          </Button>
          <Button
            href="/concierge"
            variant="accent"
            size="lg"
            className="min-w-0 flex-1 basis-0 justify-center gap-1"
          >
            {tc("askConcierge")}
            <Icon name="arrowRight" className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </section>
  );
}
