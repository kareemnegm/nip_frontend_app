import type { Metadata } from "next";
import { AreaDetailPage } from "@/components/catalog/AreaDetailPage";
import { getAreaBySlug } from "@/lib/api/areas";
import { resolveLocale } from "@/lib/i18n/helpers";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const area = await getAreaBySlug(slug, locale);
  if (!area) return { title: "Area | NIP Reality" };
  return {
    title: `${area.name} | Areas | NIP Reality`,
    description: area.description?.slice(0, 160),
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);

  return <AreaDetailPage locale={locale} slug={slug} />;
}
