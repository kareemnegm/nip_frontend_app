import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { PrivateOfficeLoginCard } from "@/components/sections/PrivateOfficeLoginCard";
import { Container } from "@/components/ui";
import { resolveLocale } from "@/lib/i18n/helpers";

export const metadata: Metadata = {
  title: "Private Office | NIP Reality",
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

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
