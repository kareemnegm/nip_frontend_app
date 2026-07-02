import type { Metadata } from "next";
import { DeveloperDetailPage } from "@/components/catalog/DeveloperDetailPage";
import { getDeveloperBySlug } from "@/lib/api/developers";
import { resolveMediaUrl } from "@/lib/api/media-url";
import { resolveLocale } from "@/lib/i18n/helpers";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const developer = await getDeveloperBySlug(slug, locale);
  if (!developer) return { title: "Developer | NIP Reality" };

  const title = `${developer.name} | Developers | NIP Reality`;
  const description = developer.description?.slice(0, 160);
  const keywords = `${developer.name}, Dubai developer, properties by ${developer.name}, NIP Reality`;
  const ogImageUrl = resolveMediaUrl(developer.photo_url ?? developer.logo_url);
  const ogImages = ogImageUrl
    ? [{ url: ogImageUrl, width: 1200, height: 630, alt: developer.name }]
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

export default async function DeveloperPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);

  return <DeveloperDetailPage locale={locale} slug={slug} />;
}
