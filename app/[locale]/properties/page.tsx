import type { Metadata } from "next";
import { PropertyListingPage } from "@/components/catalog/PropertyListingPage";
import { localizedMetadata } from "@/lib/i18n/metadata";
import { resolveLocale } from "@/lib/i18n/helpers";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "properties");
}

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
    />
  );
}
