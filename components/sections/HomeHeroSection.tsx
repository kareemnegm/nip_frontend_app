import { getTranslations } from "next-intl/server";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";
import { HeroTitleRevealSlot } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteHeroGutterX, siteMaxWidth } from "@/components/ui/SiteChrome";
import { Icon } from "@/components/ui/Icon";
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
      className="relative overflow-hidden bg-[linear-gradient(158deg,#254672_0%,#081a33_72%)] py-24 text-white sm:py-32 lg:py-[200px]"
    >
      <div data-parallax className="absolute inset-0">
        <EditableImage
          relUrl={HOME_REL_URL}
          blockKey={heroBlocks.image}
          locale={locale}
          placeholderUrl=""
          placeholderAlt=""
          fill
          priority
          className="absolute inset-0 opacity-20"
          imageClassName="object-cover"
        />
      </div>
      <Container className={cn("relative text-start", siteMaxWidth, siteHeroGutterX)}>
        <div data-hero-eyebrow>
          <EditableText
            relUrl={HOME_REL_URL}
            blockKey={heroBlocks.eyebrow}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("placeholders.home.hero", "eyebrow", locale)}
            placeholderTag="p"
            className="text-xs font-semibold uppercase leading-4 text-sapphire-200"
          />
        </div>
        <HeroTitleRevealSlot>
          <EditableText
            relUrl={HOME_REL_URL}
            blockKey={heroBlocks.title}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("placeholders.home.hero", "title", locale)}
            placeholderTag="h1"
            className="mt-9 max-w-[620px] font-[family-name:var(--font-display)] text-5xl font-normal uppercase leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-[64px] lg:leading-[72px]"
          />
        </HeroTitleRevealSlot>
        <div data-hero-sub>
          <EditableText
            relUrl={HOME_REL_URL}
            blockKey={heroBlocks.body}
            locale={locale}
            placeholderContent={await getCmsPlaceholder("placeholders.home.hero", "body", locale)}
            placeholderTag="p"
            className="mt-9 max-w-[452px] text-[13px] leading-[18px] text-white"
          />
        </div>
        <div className="mt-9 flex max-w-[452px] flex-col items-stretch gap-3 sm:flex-row">
          <Button href="/insights" variant="accent" size="lg" className="w-full flex-1">
            {t("readInsights")}{" "}
            <Icon name="arrowRight" className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            href="/contact"
            variant="outlineInverse"
            size="lg"
            className="w-full flex-1 gap-[3px] border-platinum-400 text-[#d7dce3]"
          >
            <span className="font-semibold">{tc("speakWith")}</span>
            <span className="font-[family-name:var(--font-logo)] font-medium">{tc("nip")}</span>
          </Button>
        </div>
      </Container>
    </section>
  );
}
