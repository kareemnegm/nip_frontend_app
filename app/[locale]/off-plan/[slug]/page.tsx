import type { Metadata } from "next";
import { buildPropertyMetadata } from "@/components/catalog/PropertyDetailPage";
import { OffPlanDetailPage } from "@/components/catalog/OffPlanDetailPage";
import { getPropertyBySlug } from "@/lib/api/properties";
import { resolveLocale } from "@/lib/i18n/helpers";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const property = await getPropertyBySlug(slug, locale);
  if (!property) return { title: "Off-Plan | NIP Reality" };
  return buildPropertyMetadata(property);
}

export default async function OffPlanProjectPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);

  return <OffPlanDetailPage locale={locale} slug={slug} />;
}
