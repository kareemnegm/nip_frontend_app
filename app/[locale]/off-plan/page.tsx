import type { Metadata } from "next";
import { PropertyListingPage } from "@/components/catalog/PropertyListingPage";
import { ProjectRegisterCta } from "@/components/sections/OffPlanStorySections";
import { localizedMetadata } from "@/lib/i18n/metadata";
import { resolveLocale } from "@/lib/i18n/helpers";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "offPlan");
}

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
      afterContent={<ProjectRegisterCta locale={locale} />}
    />
  );
}
