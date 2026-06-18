import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  AboutHeroSection,
  AboutMarketSection,
  AboutPartnersStrip,
  AboutRoleSection,
  AboutStandardSection,
} from "@/components/sections/AboutStorySections";
import { resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "about");
}

export default function AboutPage() {
  return (
    <SiteShell>
      <AboutHeroSection />
      <AboutMarketSection />
      <AboutRoleSection />
      <AboutPartnersStrip />
      <AboutStandardSection />
    </SiteShell>
  );
}
