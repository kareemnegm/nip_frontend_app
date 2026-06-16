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
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Curated for You | NIP Reality",
  description:
    "A confidential selection of properties and projects aligned with your mandate.",
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CuratedPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const token = await getMemberToken();
  if (!token) redirect(localizedHref(locale, "/private-office"));

  const [user, curatedResponse, notesResponse] = await Promise.all([
    getMemberProfile(token),
    getMemberCurated(token, { limit: 20 }),
    getMemberNotes(token, { limit: 20 }),
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
