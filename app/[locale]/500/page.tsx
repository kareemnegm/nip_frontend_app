import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { ServerErrorSection } from "@/components/sections/ServerErrorStorySections";
import { resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "serverError");
}

export default async function ServerErrorPage({ params }: PageProps) {
  await params;

  return (
    <SiteShell>
      <ServerErrorSection />
    </SiteShell>
  );
}
