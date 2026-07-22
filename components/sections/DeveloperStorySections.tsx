import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SpeakWithNipButton } from "@/components/ui/Button";
import type { IconName } from "@/components/ui/Icon";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { getRequestLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/cn";
import { AppLink as Link } from "@/components/AppLink";
import { AreaAboutSection, AreaSectionHeading } from "./AreaStorySections";

const developerSectionTitleClassName =
  "text-[32px] leading-8 tracking-[-0.02em]";

export type DeveloperHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  logoUrl?: string;
  logoText?: string;
};

export function DeveloperHero({
  eyebrow = "MASTER DEVELOPER | DUBAI",
  title,
  description,
  logoUrl,
  logoText,
}: DeveloperHeroProps) {
  const fallbackLogoText = logoText ?? title.split(" ")[0]?.toUpperCase() ?? title;

  return (
    <section data-site-hero className="bg-surface-muted pt-[64px] pb-9">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center",
          )}
        >
          <div className="flex max-w-[558px] flex-col gap-2">
            <p className="font-sans text-overline font-semibold uppercase text-accent">
              {eyebrow}
            </p>
            <h1 className="font-display font-normal text-display-sm uppercase text-brand sm:text-display-lg">
              {title}
            </h1>
            <p className="font-sans font-normal text-body-sm text-ink-tertiary">
              {description}
            </p>
          </div>

          {/* Mobile: logo + CTA side by side. Desktop: stacked (logo above button). */}
          <div className="flex w-full shrink-0 flex-row items-center justify-between gap-4 lg:w-auto lg:flex-col lg:justify-center lg:gap-0">
            <div className="flex min-w-0 flex-1 items-center justify-center lg:w-full lg:flex-none lg:pb-10">
              {logoUrl ? (
                <div className="flex w-full max-w-[130px] items-center justify-center sm:max-w-[150px] lg:w-[134px] lg:max-w-[134px]">
                  <Image
                    src={logoUrl}
                    alt={`${title} logo`}
                    width={134}
                    height={40}
                    className="h-auto max-h-[28px] w-auto max-w-full object-contain sm:max-h-[30px] lg:max-h-[32px]"
                  />
                </div>
              ) : (
                <p
                  aria-hidden
                  className="text-center font-[family-name:var(--font-display)] text-[28px] uppercase leading-none tracking-[0.12em] text-brand lg:text-[40px]"
                >
                  {fallbackLogoText}
                </p>
              )}
              {!logoUrl ? (
                <span className="sr-only">{fallbackLogoText} logo</span>
              ) : null}
            </div>
            <SpeakWithNipButton href="/contact" className="shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

export async function DeveloperAboutSection({
  body,
  strengths,
}: {
  body: string;
  strengths: Array<{ label: string; icon: IconName }>;
}) {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "pages.developers" });

  return (
    <AreaAboutSection
      title={t("aboutDeveloper")}
      body={body}
      highlights={strengths}
    />
  );
}

export async function DeveloperPortfolioSection({
  developerName,
  children,
}: {
  developerName: string;
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "pages.developers" });

  return (
    <section className="bg-surface-muted pt-16 pb-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={sitePageInnerClassName}>
          <AreaSectionHeading
            eyebrow={t("portfolio")}
            title={t("listingsFor", { name: developerName })}
            titleClassName={developerSectionTitleClassName}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export async function DeveloperCommunitiesSection({
  developerName,
  children,
}: {
  developerName: string;
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "pages.developers" });

  return (
    <section className="bg-white pt-16 pb-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={sitePageInnerClassName}>
          <AreaSectionHeading
            eyebrow={t("communities")}
            title={t("whereBuilds", { name: developerName })}
            titleClassName={developerSectionTitleClassName}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export async function DeveloperAdvisoryCta({ developerName }: { developerName: string }) {
  const locale = await getRequestLocale();
  const tDev = await getTranslations({ locale, namespace: "pages.developers" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="bg-brand py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-center gap-10 text-center",
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <p className="text-overline font-semibold text-accent-on-dark">
              {tDev("advisory")}
            </p>
            <h2 className="font-display text-display-sm uppercase text-white sm:text-display-lg">
              {tDev("interestedInAddress", { name: developerName })}
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-[3px] rounded-[var(--radius-field)] bg-white px-6 py-[9px] text-xs leading-4 text-brand transition-colors hover:bg-sapphire-50"
          >
            <span className="font-semibold">{tCommon("speakWith")}</span>
            <span className="font-[family-name:var(--font-logo)] font-medium">
              {tCommon("nip")}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
