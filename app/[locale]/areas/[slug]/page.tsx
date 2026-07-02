import type { Metadata } from "next";
import { AreaDetailPage } from "@/components/catalog/AreaDetailPage";
import { getAreaBySlug } from "@/lib/api/areas";
import { resolveMediaUrl } from "@/lib/api/media-url";
import { resolveLocale } from "@/lib/i18n/helpers";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const area = await getAreaBySlug(slug, locale);
  if (!area) return { title: "Area | NIP Reality" };

  const title = `${area.name} | Areas | NIP Reality`;
  const description = area.description?.slice(0, 160);
  const keywords = `${area.name}, Dubai area, property in ${area.name}, NIP Reality`;
  const ogImageUrl = resolveMediaUrl(area.image_url ?? area.photo_url);
  const ogImages = ogImageUrl
    ? [{ url: ogImageUrl, width: 1200, height: 630, alt: area.name }]
    : undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      ...(ogImages && { images: ogImages }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);

  return <AreaDetailPage locale={locale} slug={slug} />;
}
