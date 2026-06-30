import Link from "next/link";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";
import { SpeakWithNipButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { getBlocksForPage } from "@/lib/api/blocks";
import { cn } from "@/lib/cn";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getRequestLocale } from "@/lib/i18n/server";

const aboutBlocks = pageBlockKeys.about;

const aboutHeadingClassName =
  "font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-1.2px] text-brand";

const aboutBodyClassName = "text-[17px] leading-[28px] text-ink-secondary";

const partnerLogoSlots = [
  {
    blockKey: aboutBlocks.partners.logo1,
    placeholderUrl: "/logos/about-partner-meraas.png",
    placeholderAlt: "Meraas",
    wrapperClassName: "flex h-[42px] w-[160px] items-center justify-center",
    width: 160,
    height: 42,
  },
  {
    blockKey: aboutBlocks.partners.logo2,
    placeholderUrl: "/logos/about-partner-hh.png",
    placeholderAlt: "H&H",
    wrapperClassName: "flex h-[52px] w-[96px] items-center justify-center",
    width: 96,
    height: 52,
  },
  {
    blockKey: aboutBlocks.partners.logo3,
    placeholderUrl: "/logos/about-partner-emaar.png",
    placeholderAlt: "Emaar",
    wrapperClassName: "flex h-[32px] w-[160px] items-center justify-center",
    width: 160,
    height: 32,
  },
  {
    blockKey: aboutBlocks.partners.logo4,
    placeholderUrl: "/logos/about-partner-aldar.png",
    placeholderAlt: "Aldar",
    wrapperClassName: "flex size-[72px] items-center justify-center",
    width: 72,
    height: 72,
  },
  {
    blockKey: aboutBlocks.partners.logo5,
    placeholderUrl: "/logos/about-partner-omniyat.png",
    placeholderAlt: "Omniyat",
    wrapperClassName: "flex h-[24px] w-[160px] items-center justify-center",
    width: 160,
    height: 24,
  },
] as const;

export function AboutCtaRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full max-w-[400px] gap-3", className)}>
      <SpeakWithNipButton href="/contact" className="flex-1 justify-center" />
      <Link
        href="/insights"
        className="inline-flex flex-1 items-center justify-center gap-1 rounded-[var(--radius-field)] bg-accent px-6 py-[9px] text-[13px] font-semibold leading-[18px] text-white transition-colors hover:bg-accent-hover active:bg-accent-pressed"
      >
        Read our Insights
        <Icon name="arrowRight" className="h-4 w-4 shrink-0" />
      </Link>
    </div>
  );
}

export async function AboutHeroSection() {
  const locale = await getRequestLocale();

  return (
    <section id="team" data-site-hero className="bg-white pt-[72px] pb-12">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <EditableText
              relUrl={aboutBlocks.relUrl}
              blockKey={aboutBlocks.hero.eyebrow}
              locale={locale}
              placeholderContent={await getCmsPlaceholder(
                "placeholders.about.hero",
                "eyebrow",
                locale,
              )}
              placeholderTag="p"
              className="text-overline font-semibold text-accent"
            />
            <EditableText
              relUrl={aboutBlocks.relUrl}
              blockKey={aboutBlocks.hero.title}
              locale={locale}
              placeholderContent={await getCmsPlaceholder(
                "placeholders.about.hero",
                "title",
                locale,
              )}
              placeholderTag="h1"
              className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.88px] text-brand"
            />
            <EditableText
              relUrl={aboutBlocks.relUrl}
              blockKey={aboutBlocks.hero.description}
              locale={locale}
              placeholderContent={await getCmsPlaceholder(
                "placeholders.about.hero",
                "description",
                locale,
              )}
              placeholderTag="p"
              className={cn("max-w-[680px]", aboutBodyClassName)}
            />
          </div>
          <AboutCtaRow />
        </div>
      </div>
    </section>
  );
}

export async function AboutMarketSection() {
  const locale = await getRequestLocale();

  return (
    <section className="bg-white py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex max-w-[726px] flex-col items-center gap-4 text-center">
          <EditableText
            relUrl={aboutBlocks.relUrl}
            blockKey={aboutBlocks.market.title}
            locale={locale}
            placeholderContent={await getCmsPlaceholder(
              "placeholders.about.market",
              "title",
              locale,
            )}
            placeholderTag="h2"
            className={aboutHeadingClassName}
          />
          <EditableText
            relUrl={aboutBlocks.relUrl}
            blockKey={aboutBlocks.market.body}
            locale={locale}
            placeholderContent={await getCmsPlaceholder(
              "placeholders.about.market",
              "body",
              locale,
            )}
            placeholderTag="p"
            className={aboutBodyClassName}
          />
        </div>
      </div>
    </section>
  );
}

export async function AboutRoleSection() {
  const locale = await getRequestLocale();
  const blocks = await getBlocksForPage(aboutBlocks.relUrl, locale);
  const hasRoleImage = Boolean(blocks[aboutBlocks.role.image]?.content?.trim());

  return (
    <section id="approach" className="bg-white pb-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-center gap-12 lg:flex-row lg:items-center",
          )}
        >
          <div className="relative h-[280px] w-full max-w-[520px] shrink-0 sm:h-[400px]">
            <EditableImage
              relUrl={aboutBlocks.relUrl}
              blockKey={aboutBlocks.role.image}
              locale={locale}
              placeholderUrl=""
              placeholderAlt="Our role"
              fill
              className="rounded-[var(--radius-card)] bg-basalt-100"
              imageClassName="object-cover"
            />
            {!hasRoleImage ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[var(--radius-card)]"
              >
                <Icon name="home" className="h-[70px] w-[70px] text-white/80" />
              </div>
            ) : null}
          </div>
          <div className="flex max-w-[512px] flex-col gap-4">
            <EditableText
              relUrl={aboutBlocks.relUrl}
              blockKey={aboutBlocks.role.eyebrow}
              locale={locale}
              placeholderContent={await getCmsPlaceholder(
                "placeholders.about.role",
                "eyebrow",
                locale,
              )}
              placeholderTag="p"
              className="text-overline font-semibold text-accent"
            />
            <EditableText
              relUrl={aboutBlocks.relUrl}
              blockKey={aboutBlocks.role.title}
              locale={locale}
              placeholderContent={await getCmsPlaceholder(
                "placeholders.about.role",
                "title",
                locale,
              )}
              placeholderTag="h2"
              className={aboutHeadingClassName}
            />
            <EditableText
              relUrl={aboutBlocks.relUrl}
              blockKey={aboutBlocks.role.body}
              locale={locale}
              placeholderContent={await getCmsPlaceholder(
                "placeholders.about.role",
                "body",
                locale,
              )}
              placeholderTag="p"
              className={aboutBodyClassName}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export async function AboutPartnersStrip() {
  const locale = await getRequestLocale();

  return (
    <section className="bg-sapphire-800 py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-wrap items-center justify-center gap-10">
            {partnerLogoSlots.map((slot) => (
              <div
                key={slot.blockKey}
                className="flex flex-col items-center justify-center p-1"
              >
                <div className={slot.wrapperClassName}>
                  <EditableImage
                    relUrl={aboutBlocks.relUrl}
                    blockKey={slot.blockKey}
                    locale={locale}
                    placeholderUrl={slot.placeholderUrl}
                    placeholderAlt={slot.placeholderAlt}
                    width={slot.width}
                    height={slot.height}
                    className="relative h-full w-full"
                    imageClassName="h-full w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
          <EditableText
            relUrl={aboutBlocks.relUrl}
            blockKey={aboutBlocks.partners.caption}
            locale={locale}
            placeholderContent={await getCmsPlaceholder(
              "placeholders.about.partners",
              "caption",
              locale,
            )}
            placeholderTag="p"
            className="whitespace-pre-line text-center text-body-xs leading-4 text-basalt-200"
          />
        </div>
      </div>
    </section>
  );
}

export async function AboutStandardSection() {
  const locale = await getRequestLocale();

  return (
    <section id="why-nip" className="bg-white py-[72px]">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex max-w-[846px] flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-2">
            <EditableText
              relUrl={aboutBlocks.relUrl}
              blockKey={aboutBlocks.standard.title}
              locale={locale}
              placeholderContent={await getCmsPlaceholder(
                "placeholders.about.standard",
                "title",
                locale,
              )}
              placeholderTag="h2"
              className={aboutHeadingClassName}
            />
            <EditableText
              relUrl={aboutBlocks.relUrl}
              blockKey={aboutBlocks.standard.quote}
              locale={locale}
              placeholderContent={await getCmsPlaceholder(
                "placeholders.about.standard",
                "quote",
                locale,
              )}
              placeholderTag="p"
              className="text-[13px] font-semibold italic leading-[18px] text-ink-secondary"
            />
          </div>
          <AboutCtaRow />
        </div>
      </div>
    </section>
  );
}
