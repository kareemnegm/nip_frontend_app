import type { Metadata } from "next";
import { buildPropertyMetadata } from "@/components/catalog/PropertyDetailPage";
import { RentalDetailPage } from "@/components/catalog/RentalDetailPage";
import { getPropertyBySlug } from "@/lib/api/properties";
import { resolveLocale } from "@/lib/i18n/helpers";


type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const property = await getPropertyBySlug(slug, locale);
  if (!property) return { title: "Rental - Novel Insight Property" };
  return buildPropertyMetadata(property);
}

export default async function RentalPropertyPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);

  return <RentalDetailPage locale={locale} slug={slug} />;
}
