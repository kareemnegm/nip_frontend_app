"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";
import { scrollPageToTop } from "@/lib/navigation/scroll-to-top";

type HomeSearchFormProps = {
  label: string;
  ariaLabel: string;
  placeholder: string;
  submitLabel: string;
  initialQuery?: string;
  showLabel?: boolean;
};

export function HomeSearchForm({
  label,
  ariaLabel,
  placeholder,
  submitLabel,
  initialQuery = "",
  showLabel = true,
}: HomeSearchFormProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const [keyword, setKeyword] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isTyping = isFocused || keyword.length > 0;

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = keyword.trim();
    const path = trimmed
      ? `/search?q=${encodeURIComponent(trimmed)}`
      : "/search";
    startTransition(() => {
      scrollPageToTop();
      router.push(localizedHref(locale, path), { scroll: true });
    });
  }

  return (
    <form className="mx-auto flex max-w-[640px] flex-col gap-3" onSubmit={onSubmit}>
      {showLabel ? (
        <p className="text-overline text-center font-semibold uppercase text-ink-tertiary">
          {label}
        </p>
      ) : null}
      <div
        className={cn(
          "motion-search-bar flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-white p-1.5 sm:flex-row sm:items-center sm:py-1.5 sm:pl-[18px] sm:pr-1.5",
          isTyping && "is-typing",
        )}
      >
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
