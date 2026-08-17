import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { ThankYouSection } from "@/components/sections/ThankYouStorySections";
import { resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "thankYou");
}

export default async function ThankYouPage({ searchParams }: PageProps) {
  // `?ref=` carries the insight-submission reference so a contributor has
  // something to quote — nothing else sets it, and other forms land here bare.
  const { ref } = await searchParams;

  return (
    <SiteShell>
      <ThankYouSection reference={ref} />
    </SiteShell>
  );
}
