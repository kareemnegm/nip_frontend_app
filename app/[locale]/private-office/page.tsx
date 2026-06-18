import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { PrivateOfficeLoginCard } from "@/components/sections/PrivateOfficeLoginCard";
import { Container } from "@/components/ui";
import { resolveLocale } from "@/lib/i18n/helpers";
import { localizedMetadata } from "@/lib/i18n/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "privateOffice");
}

export default async function PrivateOfficePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);

  return (
    <SiteShell>
      <section className="w-full bg-sapphire-50">
        <Container className="flex min-h-[70vh] items-center justify-center py-16">
          <PrivateOfficeLoginCard locale={locale} />
        </Container>
      </section>
    </SiteShell>
  );
}
