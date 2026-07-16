"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { preserveScrollOnNextNavigation } from "@/lib/navigation/scroll-preserve";
import { LabeledSelect } from "./LabeledSelect";

const KEYWORD_DEBOUNCE_MS = 400;

export type PropertyFilterValues = {
  keyword?: string;
  area?: string;
  type?: string;
  bedrooms?: string;
  min_price?: string;
};

type PropertyFilterBarProps = {
  basePath: string;
  values?: PropertyFilterValues;
};

function buildQueryString(
  values: PropertyFilterValues,
  preserve?: URLSearchParams,
) {
  const params = new URLSearchParams();
  if (values.keyword?.trim()) params.set("keyword", values.keyword.trim());
  if (values.area) params.set("area", values.area);
  if (values.type) params.set("type", values.type);
  if (values.bedrooms) params.set("bedrooms", values.bedrooms);
  if (values.min_price) params.set("min_price", values.min_price);

  if (preserve) {
    for (const key of ["view", "sort"] as const) {
      const value = preserve.get(key);
      if (value) params.set(key, value);
    }
  }

  return params.toString();
}

export function PropertyFilterBar({ basePath, values = {} }: PropertyFilterBarProps) {
  const t = useTranslations("catalog");
  const tc = useTranslations("common");
  const tf = useTranslations("footer");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [keyword, setKeyword] = useState(values.keyword ?? "");
  const [area, setArea] = useState(values.area ?? "");
  const [type, setType] = useState(values.type ?? "");
  const [bedrooms, setBedrooms] = useState(values.bedrooms ?? "");
  const [minPrice, setMinPrice] = useState(values.min_price ?? "");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipKeywordDebounceRef = useRef(false);

  useEffect(() => {
    queueMicrotask(() => {
      skipKeywordDebounceRef.current = true;
      setKeyword(values.keyword ?? "");
      setArea(values.area ?? "");
      setType(values.type ?? "");
      setBedrooms(values.bedrooms ?? "");
      setMinPrice(values.min_price ?? "");
    });
  }, [
    values.keyword,
    values.area,
    values.type,
    values.bedrooms,
    values.min_price,
  ]);

  const filterOptions = useMemo(
    () => [
      { label: t("location"), value: "" },
      { label: tf("palmJumeirah"), value: "palm-jumeirah" },
      { label: tf("dubaiMarina"), value: "dubai-marina" },
      { label: tf("downtown"), value: "downtown-dubai" },
      { label: "Dubai Hills", value: "dubai-hills" },
    ],
    [t, tf],
  );

  const typeOptions = useMemo(
    () => [
      { label: t("type"), value: "" },
      { label: t("apartment"), value: "apartment" },
      { label: t("villa"), value: "villa" },
      { label: t("townhouse"), value: "townhouse" },
      { label: t("penthouse"), value: "penthouse" },
    ],
    [t],
  );

  const priceOptions = useMemo(
    () => [
      { label: t("price"), value: "" },
      { label: t("price1m"), value: "1000000" },
      { label: t("price2m"), value: "2000000" },
      { label: t("price5m"), value: "5000000" },
      { label: t("price10m"), value: "10000000" },
    ],
    [t],
  );

  const bedsOptions = useMemo(
    () => [
      { label: t("bedsFilter"), value: "" },
      { label: t("bed1"), value: "1" },
      { label: t("bed2"), value: "2" },
      { label: t("bed3"), value: "3" },
      { label: t("bed4"), value: "4" },
    ],
    [t],
  );

  const navigate = useCallback(
    (next: PropertyFilterValues) => {
      const query = buildQueryString(next, searchParams);
      const href = query ? `${basePath}?${query}` : basePath;
      preserveScrollOnNextNavigation();
      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [basePath, router, searchParams],
  );

  const pushFilters = useCallback(
    (overrides: Partial<PropertyFilterValues> = {}) => {
      navigate({
        keyword: overrides.keyword ?? keyword,
        area: overrides.area ?? area,
        type: overrides.type ?? type,
        bedrooms: overrides.bedrooms ?? bedrooms,
        min_price: overrides.min_price ?? minPrice,
      });
    },
    [area, bedrooms, keyword, minPrice, navigate, type],
  );

  function onKeywordChange(value: string) {
    setKeyword(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (value === "") {
      skipKeywordDebounceRef.current = false;
      pushFilters({ keyword: "" });
      return;
    }

    if (skipKeywordDebounceRef.current) {
      skipKeywordDebounceRef.current = false;
      return;
    }

    debounceRef.current = setTimeout(() => {
      pushFilters({ keyword: value });
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
    pushFilters();
  }

  return (
    <form
      className="flex w-full flex-wrap items-center gap-2.5 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-3 shadow-[var(--shadow-card)] lg:flex-nowrap"
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
        className="min-w-0 w-full shrink-0 rounded-[var(--radius-field)] bg-sapphire-50 px-3.5 py-2.5 text-body-sm text-ink outline-none placeholder:text-text-inactive lg:w-[470px] lg:flex-none"
      />
      <LabeledSelect
        aria-label={t("location")}
        options={filterOptions}
        value={area}
        onChange={(value) => {
          setArea(value);
          pushFilters({ area: value });
        }}
      />
      <LabeledSelect
        aria-label={t("type")}
        options={typeOptions}
        value={type}
        onChange={(value) => {
          setType(value);
          pushFilters({ type: value });
        }}
      />
      <LabeledSelect
        aria-label={t("price")}
        options={priceOptions}
        value={minPrice}
        onChange={(value) => {
          setMinPrice(value);
          pushFilters({ min_price: value });
        }}
      />
      <LabeledSelect
        aria-label={t("bedsFilter")}
        options={bedsOptions}
        value={bedrooms}
        onChange={(value) => {
          setBedrooms(value);
          pushFilters({ bedrooms: value });
        }}
      />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full shrink-0 items-center justify-center rounded-[var(--radius-field)] bg-brand px-[22px] py-[9px] text-overline font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-60 sm:w-[96px] lg:flex-none"
      >
        {isPending ? tc("loading") : tc("search")}
      </button>
    </form>
  );
}
