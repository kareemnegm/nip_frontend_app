import { PrivateOfficeLoginForm } from "@/components/forms/PrivateOfficeLoginForm";
import { PrivateOfficeLoginIntro } from "@/components/sections/PrivateOfficeLoginIntro";
import { Logo } from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";

export function PrivateOfficeLoginCard({ locale }: { locale: Locale }) {
  return (
    <div className="w-full max-w-md rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-card)] sm:p-10">
      <div className="flex items-start justify-between">
        <Logo />
        <span className="text-right text-[10px] font-semibold uppercase leading-tight tracking-wide text-ink-tertiary">
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
