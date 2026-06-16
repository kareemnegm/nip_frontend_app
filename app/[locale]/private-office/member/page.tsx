import type { Metadata } from "next";
import {
  MemberDashboardView,
  requireMemberDashboard,
} from "@/components/catalog/MemberDashboard";
import { resolveLocale } from "@/lib/i18n/helpers";

export const metadata: Metadata = {
  title: "Private Office | NIP Reality",
  description:
    "Your private NIP workspace — curated selections, saved properties, and direct access to your advisor.",
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PrivateOfficeMemberPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const data = await requireMemberDashboard(locale);

  return <MemberDashboardView data={data} locale={locale} />;
}
