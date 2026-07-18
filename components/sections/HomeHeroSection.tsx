import { getTranslations } from "next-intl/server";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";
import { HeroTitleRevealSlot } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { siteHeroLayoutClassName } from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getRequestLocale } from "@/lib/i18n/server";
import { HOME_REL_URL } from "./home-editable";

const heroBlocks = pageBlockKeys.home.hero;

export async function HomeHeroSection() {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <section
      data-site-hero
      className="relative self-stretch overflow-hidden bg-sapphire-800 text-white"
    >
      {/* Figma: background 50% / cover no-repeat.
          Oversize the parallax layer (±40px) so MotionRoot's translate
          never reveals the sapphire fallback as a strip under the header. */}
      <div data-parallax className="absolute -inset-10 bg-sapphire-800">
        <EditableImage
          relUrl={HOME_REL_URL}
          blockKey={heroBlocks.image}
          locale={locale}
          placeholderUrl="/images/hero-bg.jpg"
          placeholderAlt="Dubai aerial view"
          fill
          priority
          className="absolute inset-0"
          imageClassName="object-cover object-center"
        />
      </div>

      {/* Figma 1525:28266 — display:flex; flex-direction:column; align-items:flex-start; gap:36px; padding:200px 180px */}
      <div className={siteHeroLayoutClassName}>
        <div data-hero-eyebrow>
          <EditableText
            relUrl={HOME_REL_URL}
            blockKey={heroBlocks.eyebrow}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("placeholders.home.hero", "eyebrow", locale)}
            placeholderTag="p"
            className="text-overline font-semibold uppercase text-sapphire-200"
          />
        </div>

        <HeroTitleRevealSlot>
          <EditableText
            relUrl={HOME_REL_URL}
            blockKey={heroBlocks.title}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("placeholders.home.hero", "title", locale)}
            placeholderTag="h1"
            className={cn(
              "whitespace-pre-line font-display font-normal uppercase text-white",
              "max-w-[620px]",
              "text-display-sm",
              "sm:text-display-hero-sm sm:leading-[4rem]",
              "lg:text-display-hero lg:leading-[4.5rem] lg:tracking-[-0.04em]",
            )}
          />
        </HeroTitleRevealSlot>

        <div data-hero-sub>
          <EditableText
            relUrl={HOME_REL_URL}
            blockKey={heroBlocks.body}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("placeholders.home.hero", "body", locale)}
            placeholderTag="p"
            className="max-w-[452px] text-body-sm font-normal text-white"
          />
        </div>

        <div className="flex w-full max-w-[452px] flex-row items-stretch gap-2 sm:gap-3">
          <Button
            href="/insights"
            variant="accent"
            size="lg"
            className="min-w-0 flex-1 basis-0 justify-center gap-1"
          >
            {t("readInsights")}{" "}
            <Icon name="arrowRight" className="h-4 w-4 shrink-0 rtl:rotate-180" />
          </Button>
          <Button
            href="/contact"
            variant="outlineInverse"
            size="lg"
            className="min-w-0 flex-1 basis-0 justify-center gap-[3px]"
          >
            <span className="font-semibold">{tc("speakWith")}</span>
            <span className="font-[family-name:var(--font-logo)] font-medium">{tc("nip")}</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
