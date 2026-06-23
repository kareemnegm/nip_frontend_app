import { getTranslations } from "next-intl/server";
import { MemberAdvisorMessageDialog } from "@/components/forms/MemberAdvisorMessageForm";
import { MemberSignOutButton } from "@/components/forms/MemberSignOutButton";
import { AdvisorCard, Icon, PropertyCard } from "@/components/ui";
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

/** Figma T08 · Private Office member — section title (node 1525:27684). */
function PrivateOfficeMemberSectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** Figma T08 — 3-up card row: 344px cards, 24px gap, 480px row height. */
const memberCardGridClassName =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6";

export async function PrivateOfficeMemberHero({
  user,
  locale = "en",
}: {
  user: ApiMemberUser;
  locale?: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "privateOffice" });
  const advisorName = user.advisor?.name ?? t("yourAdvisor");
  const displayName = user.displayName ?? user.name;

  return (
    <section
      data-site-hero
      className="bg-sapphire-800 pt-16 pb-9 text-white"
    >
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "flex flex-col gap-4")}>
          <p className="text-xs font-semibold leading-4 text-[#8fb0dc]">
            {t("title").toUpperCase()}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-white">
            {t("welcomeBack", { name: displayName })}
          </h1>
          <p className="text-[13px] leading-[18px] text-[#bbcadd]">
            {t("curatedBy", { advisor: advisorName })}
          </p>
          <MemberSignOutButton
            className="mt-2 w-fit border-transparent bg-transparent px-0 py-0 text-[13px] font-normal text-[#8fb0dc] hover:bg-transparent hover:text-white"
            redirectTo={localizedHref(locale, "/private-office")}
          />
        </div>
      </div>
    </section>
  );
}

export async function PrivateOfficeMemberCuratedSection({
  items = [],
  locale = "en",
}: {
  items?: Array<{
    id?: number;
    title: string;
    excerpt: string;
    href?: string;
    imageUrl?: string;
  }>;
  locale?: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "privateOffice" });

  return (
    <section className="bg-white py-14">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "flex flex-col gap-6")}>
          <PrivateOfficeMemberSectionTitle>{t("curatedForYou")}</PrivateOfficeMemberSectionTitle>
          {items.length === 0 ? (
            <CatalogEmptyState message={t("noCuratedReleased")} />
          ) : (
            <div className={memberCardGridClassName}>
              {items.map((item) => (
                <AdvisorCard
                  key={item.id ?? item.title}
                  title={item.title}
                  excerpt={item.excerpt}
                  href={item.href}
                  imageUrl={item.imageUrl}
                  className="min-h-[480px] w-full xl:max-w-[344px]"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export async function PrivateOfficeMemberSavedSection({
  properties = [],
  locale = "en",
}: {
  properties?: PropertyCardProps[];
  locale?: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "privateOffice" });

  return (
    <section className="bg-white pb-14 pt-6">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "flex flex-col gap-6")}>
          <PrivateOfficeMemberSectionTitle>{t("savedProperties")}</PrivateOfficeMemberSectionTitle>
          {properties.length === 0 ? (
            <CatalogEmptyState message={t("noSavedProperties")} />
          ) : (
            <div className={memberCardGridClassName}>
              {properties.map((property) => (
                <PropertyCard
                  key={property.href ?? property.title}
                  className="min-h-[480px] w-full xl:max-w-[344px]"
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

export async function PrivateOfficeMemberAdvisorBar({
  advisor,
  locale = "en",
}: {
  advisor?: ApiMemberAdvisor | null;
  locale?: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "privateOffice" });
  const name = advisor?.name ?? t("yourAdvisor");

  return (
    <section className="bg-sapphire-50">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-start justify-between gap-6 py-8 sm:flex-row sm:items-center",
          )}
        >
          <div className="flex items-center gap-3.5">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-white">
              <Icon name="user" className="h-6 w-6" />
            </span>
            <div className="flex flex-col gap-2">
              <p className="text-[15px] font-semibold leading-[22px] tracking-[-0.01em] text-brand">
                {t("yourAdvisor")} | {name}
              </p>
              <p className="text-[13px] leading-[18px] text-ink-tertiary">
                {advisor?.availability ?? t("availableMonFri")}
              </p>
            </div>
          </div>
          <MemberAdvisorMessageDialog advisorName={name} locale={locale} />
        </div>
      </div>
    </section>
  );
}
