import type { Metadata } from "next";
import { PropertyListingPage } from "@/components/catalog/PropertyListingPage";
import { ProjectRegisterCta } from "@/components/sections/OffPlanStorySections";
import { resolveLocale } from "@/lib/i18n/helpers";

export const metadata: Metadata = {
  title: "Off-Plan | NIP Reality",
  description:
    "Early access to off-plan launches and payment plans from Dubai's leading developers.",
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OffPlanPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const sp = await searchParams;

  return (
    <PropertyListingPage
      locale={locale}
      searchParams={sp}
      mode="offplan"
      catalogPage="offPlan"
      heroEyebrow="OFF-PLAN | NEW LAUNCHES"
      heroTitle="Off-Plan & New Launches"
      heroDescription="Early access to launches and payment plans from Dubai's leading developers, reviewed for quality and long-term value."
      afterContent={<ProjectRegisterCta />}
    />
  );
}
