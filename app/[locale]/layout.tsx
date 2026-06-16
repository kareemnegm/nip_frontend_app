import { notFound } from "next/navigation";
import { CmsLayoutProviders } from "@/components/cms/CmsLayoutProviders";
import { LocaleProvider } from "@/lib/i18n/context";
import { isLocale, locales } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/helpers";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = resolveLocale(rawLocale);

  return (
    <LocaleProvider locale={locale}>
      <CmsLayoutProviders>{children}</CmsLayoutProviders>
    </LocaleProvider>
  );
}
