import { redirect } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import {
  PrivateOfficeMemberAdvisorBar,
  PrivateOfficeMemberCuratedSection,
  PrivateOfficeMemberHero,
  PrivateOfficeMemberSavedSection,
} from "@/components/sections/PrivateOfficeMemberSections";
import {
  getMemberCurated,
  getMemberProfile,
  getMemberSaved,
} from "@/lib/api/member";
import { resolveMediaUrl } from "@/lib/api/media-url";
import { getMemberToken } from "@/lib/member/auth.server";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { mapMemberPropertyToCard } from "@/lib/mappers/member-property";
import type { PropertyCardModel } from "@/lib/mappers/property";
import type { ApiCuratedItem, ApiMemberUser } from "@/types/api";

export type MemberDashboardData = {
  user: ApiMemberUser;
  curated: ApiCuratedItem[];
  saved: PropertyCardModel[];
};

export async function loadMemberDashboard(
  locale: Locale,
  token: string,
): Promise<MemberDashboardData> {
  const [user, curatedResponse, savedResponse] = await Promise.all([
    getMemberProfile(token, locale),
    getMemberCurated(token, { limit: 3, locale }),
    getMemberSaved(token, { limit: 12, locale }),
  ]);

  return {
    user,
    curated: curatedResponse.items,
    saved: savedResponse.items.map((item) =>
      mapMemberPropertyToCard(item.property, locale),
    ),
  };
}

export async function requireMemberDashboard(locale: Locale) {
  const token = await getMemberToken();
  if (!token) {
    redirect(localizedHref(locale, "/private-office"));
  }
  return loadMemberDashboard(locale, token);
}

export function MemberDashboardView({
  data,
  locale,
}: {
  data: MemberDashboardData;
  locale: Locale;
}) {
  const curatedCards = curatedToAdvisorCards(data.curated, locale);

  return (
    <SiteShell>
      <PrivateOfficeMemberHero user={data.user} locale={locale} />
      <PrivateOfficeMemberCuratedSection items={curatedCards} locale={locale} />
      <PrivateOfficeMemberSavedSection properties={data.saved} locale={locale} />
      <PrivateOfficeMemberAdvisorBar advisor={data.user.advisor} locale={locale} />
    </SiteShell>
  );
}

export function curatedToAdvisorCards(items: ApiCuratedItem[], locale: Locale = "en") {
  return items.map((item) => {
    const listingTitle =
      item.type === "project" ? item.project?.name : item.property?.title;
    const slug =
      item.type === "project" ? item.project?.slug : item.property?.slug;
    const imageUrl =
      item.type === "project"
        ? item.project?.primaryImage
        : item.property?.primaryImage;

    return {
      id: item.id,
      title: item.title,
      excerpt: item.note ?? listingTitle ?? "",
      imageUrl: resolveMediaUrl(imageUrl),
      href: slug
        ? localizedHref(
            locale,
            item.type === "project" ? `/off-plan/${slug}` : `/properties/${slug}`,
          )
        : undefined,
      isAvailable:
        item.type === "project"
          ? item.project?.isAvailable
          : item.property?.isAvailable,
    };
  });
}
