"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { preserveScrollOnNextNavigation } from "@/lib/navigation/scroll-preserve";

const KEYWORD_DEBOUNCE_MS = 400;

export type AreaSearchValues = {
  keyword?: string;
};

type AreaSearchBarProps = {
  basePath: string;
  values?: AreaSearchValues;
};

function buildQueryString(values: AreaSearchValues) {
  const params = new URLSearchParams();
  if (values.keyword?.trim()) params.set("keyword", values.keyword.trim());
  return params.toString();
}

export function AreaSearchBar({ basePath, values = {} }: AreaSearchBarProps) {
  const t = useTranslations("pages.areas");
  const tc = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [keyword, setKeyword] = useState(values.keyword ?? "");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipKeywordDebounceRef = useRef(false);

  useEffect(() => {
    queueMicrotask(() => {
      skipKeywordDebounceRef.current = true;
      setKeyword(values.keyword ?? "");
    });
  }, [values.keyword]);

  const navigate = useCallback(
    (next: AreaSearchValues) => {
      const query = buildQueryString(next);
      const href = query ? `${basePath}?${query}` : basePath;
      preserveScrollOnNextNavigation();
      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [basePath, router],
  );

  const pushSearch = useCallback(
    (overrides: Partial<AreaSearchValues> = {}) => {
      navigate({ keyword: overrides.keyword ?? keyword });
    },
    [keyword, navigate],
  );

  function onKeywordChange(value: string) {
    setKeyword(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (value === "") {
      skipKeywordDebounceRef.current = false;
      pushSearch({ keyword: "" });
      return;
    }

    if (skipKeywordDebounceRef.current) {
      skipKeywordDebounceRef.current = false;
      return;
    }

    debounceRef.current = setTimeout(() => {
      pushSearch({ keyword: value });
    }, KEYWORD_DEBOUNCE_MS);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    pushSearch();
  }

  return (
    <form
      className="flex w-full flex-col gap-2.5 rounded-[var(--radius-card)] border border-line bg-surface p-3 shadow-[var(--shadow-card)] min-[1440px]:flex-row min-[1440px]:flex-nowrap min-[1440px]:items-center"
      onSubmit={onSubmit}
    >
      <input
        type="search"
        aria-label={t("searchAria")}
        placeholder={t("searchPlaceholder")}
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && keyword !== "") {
            onKeywordChange("");
          }
        }}
        ref={(el) => {
          if (!el) return;
          const handler = () => onKeywordChange("");
          el.addEventListener("search", handler);
          return () => el.removeEventListener("search", handler);
        }}
        className="w-full min-w-0 shrink-0 rounded-[var(--radius-field)] bg-sapphire-50 px-3.5 py-2.5 text-body-sm text-ink outline-none placeholder:text-text-inactive min-[1440px]:flex-1"
      />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-full min-h-9 shrink-0 items-center justify-center rounded-[var(--radius-field)] bg-brand px-3.5 py-[9px] text-overline font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-60 sm:px-[22px] min-[1440px]:w-[96px] min-[1440px]:flex-none"
      >
        {isPending ? tc("loading") : tc("search")}
      </button>
    </form>
  );
}
