import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  ContactFormSection,
  ContactHeroSection,
} from "@/components/sections/ContactStorySections";
import { resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "contact");
}

export default function ContactPage() {
  return (
    <SiteShell>
      <ContactHeroSection />
      <ContactFormSection />
    </SiteShell>
  );
}
