import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  LegalContentSection,
  LegalHeroSection,
} from "@/components/sections/LegalStorySections";
import { resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "legal");
}

export default async function LegalPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);

  return (
    <SiteShell>
      <LegalHeroSection locale={locale} />
      <LegalContentSection locale={locale} />
    </SiteShell>
  );
}
