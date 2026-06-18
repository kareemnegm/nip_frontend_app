import type { Metadata } from "next";
import {
  MemberDashboardView,
  requireMemberDashboard,
} from "@/components/catalog/MemberDashboard";
import { resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "privateOfficeMember");
}

export default async function PrivateOfficeMemberPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const data = await requireMemberDashboard(locale);

  return <MemberDashboardView data={data} locale={locale} />;
}
