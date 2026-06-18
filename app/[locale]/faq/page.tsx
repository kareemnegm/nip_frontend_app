import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  FaqAccordionSection,
  FaqCtaSection,
  FaqHeroSection,
} from "@/components/sections/FaqStorySections";
import { resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "faq");
}

export default async function FaqPage() {
  return (
    <SiteShell>
      <FaqHeroSection />
      <FaqAccordionSection />
      <FaqCtaSection />
    </SiteShell>
  );
}
