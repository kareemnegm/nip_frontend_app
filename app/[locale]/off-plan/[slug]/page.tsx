import type { Metadata } from "next";
import {
  PropertyDetailPage,
  buildPropertyMetadata,
} from "@/components/catalog/PropertyDetailPage";
import { getPropertyBySlug } from "@/lib/api/properties";
import { resolveLocale } from "@/lib/i18n/helpers";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Off-Plan | NIP Reality" };
  return buildPropertyMetadata(property);
}

export default async function OffPlanDetailPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);

  return <PropertyDetailPage locale={locale} slug={slug} detailBase="off-plan" />;
}
