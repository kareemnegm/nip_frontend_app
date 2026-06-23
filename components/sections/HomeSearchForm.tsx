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
      router.push(localizedHref(locale, path));
    });
  }

  return (
    <form className="mx-auto max-w-[640px]" onSubmit={onSubmit}>
      <p className="mb-3 text-center text-xs font-semibold uppercase leading-4 text-ink-tertiary">
        {label}
      </p>
      <div className="flex flex-col gap-3 rounded-[8px] border border-line bg-white py-1.5 pl-[18px] pr-1.5 sm:flex-row sm:items-center">
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          aria-label={ariaLabel}
          placeholder={placeholder}
          className="min-h-9 flex-1 text-[13px] leading-[18px] text-ink placeholder:text-text-inactive outline-none"
        />
        <Button type="submit" size="md" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? "…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
