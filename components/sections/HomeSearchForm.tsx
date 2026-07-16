"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";

type HomeSearchFormProps = {
  label: string;
  ariaLabel: string;
  placeholder: string;
  submitLabel: string;
};

export function HomeSearchForm({
  label,
  ariaLabel,
  placeholder,
  submitLabel,
}: HomeSearchFormProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const [keyword, setKeyword] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = keyword.trim();
    const path = trimmed
      ? `/properties?keyword=${encodeURIComponent(trimmed)}`
      : "/properties";
    startTransition(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      router.push(localizedHref(locale, path), { scroll: true });
    });
  }

  return (
    <form className="mx-auto flex max-w-[640px] flex-col gap-3" onSubmit={onSubmit}>
      <p className="text-overline text-center font-semibold uppercase text-ink-tertiary">
        {label}
      </p>
      <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-white p-1.5 sm:flex-row sm:items-center sm:py-1.5 sm:pl-[18px] sm:pr-1.5">
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          aria-label={ariaLabel}
          placeholder={placeholder}
          className="min-h-9 flex-1 text-[13px] leading-[18px] text-ink placeholder:text-text-inactive outline-none"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full sm:w-auto"
          disabled={isPending}
        >
          {isPending ? "…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
