import { PrivateOfficeLoginForm } from "@/components/forms/PrivateOfficeLoginForm";
import { PrivateOfficeLoginIntro } from "@/components/sections/PrivateOfficeLoginIntro";
import { Logo } from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";

/** Figma "Frame" — Private Office login card (node 1525:27708). */
export function PrivateOfficeLoginCard({ locale }: { locale: Locale }) {
  return (
    <div className="flex w-full max-w-[460px] flex-col items-center gap-4 rounded-[var(--radius-card-lg)] border border-basalt-100 bg-white p-8 shadow-[0px_2px_8px_rgba(18,51,94,0.06)] sm:p-11">
      <div className="flex w-full items-center justify-between">
        <Logo />
        <span className="text-right text-tagline-micro font-medium text-brand">
          For Those Who
          <br />
          Expect More
        </span>
      </div>

      <PrivateOfficeLoginIntro />

      <PrivateOfficeLoginForm locale={locale} />
    </div>
  );
}
