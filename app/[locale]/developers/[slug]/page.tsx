import type { Metadata } from "next";
import { DeveloperDetailPage } from "@/components/catalog/DeveloperDetailPage";
import { getDeveloperBySlug } from "@/lib/api/developers";
import { resolveLocale } from "@/lib/i18n/helpers";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const developer = await getDeveloperBySlug(slug, locale);
  if (!developer) return { title: "Developer | NIP Reality" };
  return {
    title: `${developer.name} | Developers | NIP Reality`,
    description: developer.description?.slice(0, 160),
  };
}

export default async function DeveloperPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);

  return <DeveloperDetailPage locale={locale} slug={slug} />;
}
