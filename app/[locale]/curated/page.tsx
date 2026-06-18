import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  CuratedAdvisorBarSection,
  CuratedHeroSection,
  CuratedNotesSection,
  CuratedSelectionSection,
} from "@/components/sections/CuratedStorySections";
import { curatedToAdvisorCards } from "@/components/catalog/MemberDashboard";
import { getMemberCurated, getMemberNotes, getMemberProfile } from "@/lib/api/member";
import { getMemberToken } from "@/lib/member/auth.server";
import { localizedHref, resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "curated");
}

export default async function CuratedPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const token = await getMemberToken();
  if (!token) redirect(localizedHref(locale, "/private-office"));

  const [user, curatedResponse, notesResponse] = await Promise.all([
    getMemberProfile(token, locale),
    getMemberCurated(token, { limit: 20, locale }),
    getMemberNotes(token, { limit: 20, locale }),
  ]);

  return (
    <SiteShell>
      <CuratedHeroSection user={user} />
      <CuratedSelectionSection items={curatedToAdvisorCards(curatedResponse.items)} />
      <CuratedNotesSection notes={notesResponse.items} />
      <CuratedAdvisorBarSection advisor={user.advisor} locale={locale} />
    </SiteShell>
  );
}
