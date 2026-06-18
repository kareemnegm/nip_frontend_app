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
import Link from "next/link";
import { AreaAboutSection, AreaSectionHeading } from "./AreaStorySections";

export type DeveloperHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  logoText?: string;
};

export function DeveloperHero({
  eyebrow = "MASTER DEVELOPER | DUBAI",
  title,
  description,
  logoText = "EMAAR",
}: DeveloperHeroProps) {
  return (
    <section
      data-site-hero
      className="bg-surface-muted pt-16 pb-9"
    >
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center",
          )}
        >
          <div className="flex max-w-[558px] flex-col gap-2">
            <p className="text-overline font-semibold text-accent">{eyebrow}</p>
            <h1 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-brand">
              {title}
            </h1>
            <p className="text-body-sm text-ink-tertiary">{description}</p>
          </div>

          <div className="flex flex-col items-start lg:items-end">
            <div className="pb-10">
              <p
                aria-hidden
                className="font-[family-name:var(--font-display)] text-[27px] uppercase leading-none tracking-[0.12em] text-brand"
              >
                {logoText}
              </p>
              <span className="sr-only">{logoText} logo</span>
            </div>
            <SpeakWithNipButton href="/contact" />
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

export function DeveloperPortfolioSection({
  developerName,
  children,
}: {
  developerName: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white py-16">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={sitePageInnerClassName}>
          <AreaSectionHeading
            eyebrow="PORTFOLIO"
            title={`Projects by ${developerName}`}
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
    <section className="bg-white py-16">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={sitePageInnerClassName}>
          <AreaSectionHeading
            eyebrow={t("communities")}
            title={`Where ${developerName} builds`}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DeveloperAdvisoryCta({ developerName }: { developerName: string }) {
  return (
    <section className="bg-brand py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-center gap-10 text-center",
          )}
        >
          <div className="space-y-4">
            <p className="text-overline font-semibold text-accent-on-dark">
              ADVISORY
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-white">
              Interested in an {developerName} Address?
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-[3px] rounded-[var(--radius-field)] bg-white px-6 py-[9px] text-xs leading-4 text-brand transition-colors hover:bg-sapphire-50"
          >
            <span className="font-semibold">Speak with</span>
            <span className="font-[family-name:var(--font-logo)] font-medium">
              NIP
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
