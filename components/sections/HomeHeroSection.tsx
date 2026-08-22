import { getTranslations } from "next-intl/server";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";
import { HeroTitleRevealSlot } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { siteHeroLayoutClassName } from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getRequestLocale } from "@/lib/i18n/server";
import { HomeHeroVideo } from "./HomeHeroVideo";
import { HOME_REL_URL } from "./home-editable";
import type { SectionCms } from "./section-cms";

const heroBlocks = pageBlockKeys.home.hero;

const defaultCms: SectionCms = {
  relUrl: HOME_REL_URL,
  eyebrowKey: heroBlocks.eyebrow,
  titleKey: heroBlocks.title,
  bodyKey: heroBlocks.body,
  imageKey: heroBlocks.image,
};

export async function HomeHeroSection({
  cms = defaultCms,
  placeholderNamespace = "placeholders.home.hero",
}: {
  cms?: SectionCms;
  placeholderNamespace?: string;
} = {}) {
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
          never reveals the sapphire fallback as a strip under the header.
          The still sits under the video as the fallback for browsers that
          refuse autoplay, so it is no longer the priority image. */}
      <div data-parallax className="absolute -inset-10 bg-sapphire-800">
        <EditableImage
          relUrl={cms.relUrl}
          blockKey={cms.imageKey ?? heroBlocks.image}
          locale={locale}
          placeholderUrl="/images/hero-bg.jpg"
          placeholderAlt="Dubai aerial view"
          fill
          className="absolute inset-0"
          imageClassName="object-cover object-center"
        />
        <HomeHeroVideo />
      </div>

      {/* Figma 1525:28266 — display:flex; flex-direction:column; align-items:flex-start; gap:36px; padding:120px 180px 260px */}
      <div className={siteHeroLayoutClassName}>
        <div data-hero-eyebrow>
          {/* Figma 1525:28267 — "04 Label/Small" Archivo Medium 11/14, sapphire-200 */}
          <EditableText
            relUrl={cms.relUrl}
            blockKey={cms.eyebrowKey ?? heroBlocks.eyebrow}
            locale={locale}
            placeholderContent={await getCmsPlaceholder(placeholderNamespace, "eyebrow", locale)}
            placeholderTag="p"
            className="text-label-muted font-medium uppercase text-sapphire-200"
          />
        </div>

        <HeroTitleRevealSlot>
          <EditableText
            relUrl={cms.relUrl}
            blockKey={cms.titleKey}
            locale={locale}
            placeholderContent={await getCmsPlaceholder(placeholderNamespace, "title", locale)}
            placeholderTag="h1"
            className={cn(
              // Figma 1525:28268 — "01 Display/Large" Didot 44/42, -0.02em, uppercase
              "whitespace-pre-line font-display font-normal uppercase text-white",
              // Figma reports the two-line box as 74px, not the 84px two 42px
              // lines produce, because it trims the half-leading down to the cap
              // height. Without this the whole hero runs 10px tall. Browsers
              // without text-box support simply keep the untrimmed box.
              "[text-box:trim-both_cap_alphabetic]",
              // Figma breaks after "For Those Who" and its text box is 387px wide.
              // The break survives three ways because the copy is CMS-editable and
              // the display face differs per platform (real Didot on macOS, Bodoni
              // Moda elsewhere): the newline in the default copy, a cap narrow
              // enough that "FOR THOSE WHO EXPECT" cannot fit on one line, and
              // balancing so any other wording still splits into even lines.
              "max-w-[480px] text-balance",
              "text-display-sm sm:text-display-lg",
            )}
          />
        </HeroTitleRevealSlot>

        <div data-hero-sub>
          {/* Figma 1525:28269 — "03 Body/X-Small" Archivo 12/16, white, 410px column */}
          <EditableText
            relUrl={cms.relUrl}
            blockKey={cms.bodyKey ?? heroBlocks.body}
            locale={locale}
            placeholderContent={await getCmsPlaceholder(placeholderNamespace, "body", locale)}
            placeholderTag="p"
            className="max-w-[410px] text-body-xs font-normal text-white"
          />
        </div>

        {/* Figma 1525:28270 "Hero CTA Row" — 406px wide, 12px gap, equal-width buttons */}
        <div className="flex w-full max-w-[406px] flex-row items-stretch gap-2 sm:gap-3">
          <Button
            href="/insights"
            variant="accent"
            size="lg"
            className="min-w-0 flex-1 basis-0 justify-center sm:px-4"
          >
            {t("readInsights")}
          </Button>
          <Button
            href="/contact"
            variant="white"
            size="md"
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
