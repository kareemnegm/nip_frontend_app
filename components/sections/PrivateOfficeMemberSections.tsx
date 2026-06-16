import { MemberAdvisorMessageDialog } from "@/components/forms/MemberAdvisorMessageForm";
import { MemberSignOutButton } from "@/components/forms/MemberSignOutButton";
import Link from "next/link";
import { AdvisorCard, Button, Icon, PropertyCard } from "@/components/ui";
import type { PropertyCardProps } from "@/components/ui/Cards";
import { CatalogEmptyState } from "@/components/ui/ApiPagination";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import type { ApiMemberAdvisor, ApiMemberUser } from "@/types/api";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { cn } from "@/lib/cn";

export function PrivateOfficeSectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-3xl flex-col gap-4", className)}>
      <p className="text-overline font-semibold text-accent">{eyebrow}</p>
      <h2 className="font-[family-name:var(--font-display)] text-[36px] uppercase leading-[38px] tracking-[-0.02em] text-brand sm:text-[44px] sm:leading-[42px]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-[464px] text-body-md leading-[22px] text-ink-secondary">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function PrivateOfficeMemberHero({
  user,
  locale = "en",
}: {
  user: ApiMemberUser;
  locale?: Locale;
}) {
  const advisorName = user.advisor?.name ?? "Your Advisor";

  return (
    <section
      data-site-hero
      className="bg-[linear-gradient(166.53deg,#254672_0%,#081a33_71.43%)] py-14 text-white sm:py-16 lg:py-20"
    >
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between",
          )}
        >
          <div className="flex max-w-[620px] flex-col gap-4">
            <p className="text-overline font-semibold text-gold">Private Office</p>
            <h1 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-white sm:text-[52px] sm:leading-[50px]">
              Welcome Back, {user.displayName ?? user.name}
            </h1>
            <p className="text-body-sm text-sapphire-100">
              Curated by {advisorName} | NIP Private Advisory
            </p>
            <MemberSignOutButton
              className="mt-4 border-white/30 text-white hover:bg-white/10"
              redirectTo={localizedHref(locale, "/private-office")}
            />
          </div>
          <div className="shrink-0 lg:text-right">
            <p className="text-overline font-semibold text-platinum-400">Your Advisor</p>
            <p className="mt-2 text-lg font-bold text-white">{advisorName}</p>
            <p className="mt-1 text-body-xs text-sapphire-100">
              {user.advisor?.availability ?? "Responds within hours | Mon–Fri"}
            </p>
            <Link
              href={localizedHref(locale, "/curated")}
              className="mt-4 inline-flex items-center gap-1 text-body-sm font-semibold text-accent-on-dark hover:text-white"
            >
              View curated selection
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PrivateOfficeMemberCuratedSection({
  items = [],
}: {
  items?: Array<{ id?: number; title: string; excerpt: string }>;
}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "space-y-10")}>
          <PrivateOfficeSectionHeading
            eyebrow="YOUR CURATED VIEW"
            title="Curated for You"
            description="A confidential selection of properties and projects aligned with your mandate. Released by your advisor as relevant."
          />
          {items.length === 0 ? (
            <CatalogEmptyState message="Your advisor has not released curated selections yet." />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <AdvisorCard key={item.id ?? item.title} title={item.title} excerpt={item.excerpt} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function PrivateOfficeMemberSavedSection({
  properties = [],
}: {
  properties?: PropertyCardProps[];
}) {
  return (
    <section className="bg-sapphire-50 py-16 sm:py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "space-y-10")}>
          <PrivateOfficeSectionHeading
            eyebrow="SAVED"
            title="Saved Properties"
            description="Properties you have marked for follow-up. Your advisor can add context or arrange a private viewing."
          />
          {properties.length === 0 ? (
            <CatalogEmptyState message="You have not saved any properties yet." />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard
                  key={property.href ?? property.title}
                  className="min-h-[480px]"
                  {...property}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function PrivateOfficeMemberAdvisorBar({
  advisor,
  locale = "en",
}: {
  advisor?: ApiMemberAdvisor | null;
  locale?: Locale;
}) {
  const name = advisor?.name ?? "Your Advisor";

  return (
    <section className="border-t border-line bg-sapphire-50">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-start justify-between gap-6 py-8 sm:flex-row sm:items-center",
          )}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
              <Icon name="user" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-body-sm font-bold text-brand">Your Advisor | {name}</p>
              <p className="text-body-xs text-ink-tertiary">
                {advisor?.availability ?? "Available Mon–Fri | Responds within hours"}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <MemberAdvisorMessageDialog advisorName={name} locale={locale} />
            <Button href="/contact" variant="accent" className="justify-center">
              Request a private viewing
              <Icon name="arrowRight" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
