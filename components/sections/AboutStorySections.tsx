import Link from "next/link";
import { EditableText } from "@/components/EditableText";
import { SpeakWithNipButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getRequestLocale } from "@/lib/i18n/server";

const partners = ["MERAAS", "H&H", "EMAAR", "ALDAR", "OMNIYAT"];

export function AboutCtaRow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full max-w-[400px] gap-3",
        className,
      )}
    >
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

const aboutBlocks = pageBlockKeys.about;

export async function AboutHeroSection() {
  const locale = await getRequestLocale();

  return (
    <section data-site-hero className="bg-white pt-[72px] pb-12">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <EditableText
              relUrl={aboutBlocks.relUrl}
              blockKey={aboutBlocks.hero.eyebrow}
              locale={locale}
              placeholderContent="ABOUT NIP"
              placeholderTag="p"
              className="text-overline font-semibold text-accent"
            />
            <EditableText
              relUrl={aboutBlocks.relUrl}
              blockKey={aboutBlocks.hero.title}
              locale={locale}
              placeholderContent="One Source. One System. One Standard."
              placeholderTag="h1"
              className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-brand"
            />
            <EditableText
              relUrl={aboutBlocks.relUrl}
              blockKey={aboutBlocks.hero.description}
              locale={locale}
              placeholderContent="NIP was created for clients who want more than access to property. They want context, judgment, and a single advisory standard across every step of the real estate journey."
              placeholderTag="p"
              className="max-w-[680px] text-body-lg text-ink-secondary"
            />
          </div>
          <AboutCtaRow />
        </div>
      </div>
    </section>
  );
}

export function AboutMarketSection() {
  return (
    <section className="bg-white py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex max-w-[726px] flex-col items-center gap-4 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
            Dubai&apos;s Property Market moves Quickly
          </h2>
          <p className="text-body-lg text-ink-secondary">
            New launches, private resales, waterfront residences, branded
            developments, and selected off-market opportunities appear every day.
            For private clients, the challenge is not finding options. The
            challenge is knowing which options deserve attention.
          </p>
        </div>
      </div>
    </section>
  );
}

export function AboutRoleSection() {
  return (
    <section className="bg-white pb-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-center gap-12 lg:flex-row lg:items-center",
          )}
        >
          <div className="flex h-[280px] w-full max-w-[520px] shrink-0 items-center justify-center rounded-[var(--radius-card)] bg-basalt-100 sm:h-[400px]">
            <Icon name="home" className="h-[70px] w-[70px] text-white" />
          </div>
          <div className="flex max-w-[512px] flex-col gap-4">
            <p className="text-overline font-semibold text-accent">OUR ROLE</p>
            <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
              We do not Begin with Inventory
            </h2>
            <p className="text-body-lg text-ink-secondary">
              We begin with the client&apos;s context: purpose, timing, risk,
              lifestyle, capital strategy, and long-term view. From there, we
              help identify the areas, developers, projects, and properties that
              align with the brief.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutPartnersStrip() {
  return (
    <section className="bg-sapphire-800 py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-wrap items-center justify-center gap-10">
            {partners.map((partner) => (
              <span
                key={partner}
                className="font-[family-name:var(--font-display)] text-xl uppercase tracking-[0.12em] text-white/90 sm:text-2xl"
              >
                {partner}
              </span>
            ))}
          </div>
          <div className="text-center text-body-xs text-basalt-200">
            <p>Trusted Partnership</p>
            <p>with Dubai&apos;s Leading Developers</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutStandardSection() {
  return (
    <section className="bg-white py-[72px]">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex max-w-[846px] flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-2">
            <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
              NIP is Built around a Simple Standard:
            </h2>
            <p className="text-[13px] font-semibold italic leading-[18px] text-ink-secondary">
              &ldquo;One source for insight. One system for decision-making. One
              standard for every client journey.&rdquo;
            </p>
          </div>
          <AboutCtaRow />
        </div>
      </div>
    </section>
  );
}
