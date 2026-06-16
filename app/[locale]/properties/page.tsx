import type { Metadata } from "next";
import { PropertyListingPage } from "@/components/catalog/PropertyListingPage";
import { resolveLocale } from "@/lib/i18n/helpers";

export const metadata: Metadata = {
  title: "Properties | NIP Reality",
  description:
    "Search and discover curated properties across Dubai with NIP Reality.",
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PropertiesPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const sp = await searchParams;

  return (
    <PropertyListingPage
      locale={locale}
      searchParams={sp}
      mode="sale"
      catalogPage="properties"
      heroEyebrow="PROPERTIES | DISCOVERY"
      heroTitle="Find your Place in Dubai"
    />
  );
}
