import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { CmsLoginCard } from "@/components/forms/CmsLoginForm";
import { Container } from "@/components/ui";
import { resolveLocale } from "@/lib/i18n/helpers";

export const metadata: Metadata = {
  title: "Staff Login | NIP Reality",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CmsLoginPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);

  return (
    <SiteShell>
      <section className="w-full bg-sapphire-50">
        <Container className="flex min-h-[70vh] items-center justify-center py-16">
          <CmsLoginCard locale={locale} />
        </Container>
      </section>
    </SiteShell>
  );
}
