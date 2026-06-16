import { SiteShell } from "@/components/SiteShell";
import { NotFoundSection } from "@/components/sections/NotFoundStorySections";
import { LocaleProvider } from "@/lib/i18n/context";
import { defaultLocale } from "@/lib/i18n/config";

export default function NotFound() {
  return (
    <LocaleProvider locale={defaultLocale}>
      <SiteShell>
        <NotFoundSection />
      </SiteShell>
    </LocaleProvider>
  );
}
