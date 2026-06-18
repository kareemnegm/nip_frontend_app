"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "./Icon";

const filterSelectClassName =
  "h-[38px] w-full min-w-0 appearance-none rounded-[var(--radius-field)] border border-line bg-white bg-[length:10px] bg-[right_12px_center] bg-no-repeat pl-3.5 pr-8 text-body-sm font-medium text-ink-secondary outline-none lg:w-[110px] lg:shrink-0";

export type PropertyFilterValues = {
  keyword?: string;
  location?: string;
  type?: string;
  bedrooms?: string;
  min_price?: string;
};

type PropertyFilterBarProps = {
  basePath: string;
  values?: PropertyFilterValues;
};

function FilterSelect({
  "aria-label": ariaLabel,
  options,
  value,
  onChange,
}: {
  "aria-label": string;
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative lg:w-[110px] lg:shrink-0">
      <select
        aria-label={ariaLabel}
        className={filterSelectClassName}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevronDown"
        className="pointer-events-none absolute right-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 text-ink-secondary rtl:right-auto rtl:left-3"
      />
    </div>
  );
}

export function PropertyFilterBar({ basePath, values = {} }: PropertyFilterBarProps) {
  const t = useTranslations("catalog");
  const tc = useTranslations("common");
  const tf = useTranslations("footer");
  const router = useRouter();
  const [keyword, setKeyword] = useState(values.keyword ?? "");
  const [location, setLocation] = useState(values.location ?? "");
  const [type, setType] = useState(values.type ?? "");
  const [bedrooms, setBedrooms] = useState(values.bedrooms ?? "");
  const [minPrice, setMinPrice] = useState(values.min_price ?? "");

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

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (minPrice) params.set("min_price", minPrice);
    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  }

  return (
    <form
      className="flex flex-wrap items-center gap-2.5 rounded-[var(--radius-card)] border border-line bg-white p-3 shadow-[var(--shadow-card)] lg:flex-nowrap"
      onSubmit={onSubmit}
    >
      <input
        type="search"
        aria-label={t("searchAria")}
        placeholder={t("searchPlaceholder")}
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        className="h-[38px] w-full min-w-[200px] rounded-[var(--radius-field)] bg-sapphire-50 px-3.5 text-body-sm text-ink outline-none placeholder:text-text-inactive lg:w-[470px] lg:shrink-0"
      />
      <FilterSelect
        aria-label={t("location")}
        options={filterOptions}
        value={location}
        onChange={setLocation}
      />
      <FilterSelect aria-label={t("type")} options={typeOptions} value={type} onChange={setType} />
      <FilterSelect
        aria-label={t("price")}
        options={priceOptions}
        value={minPrice}
        onChange={setMinPrice}
      />
      <FilterSelect
        aria-label={t("bedsFilter")}
        options={bedsOptions}
        value={bedrooms}
        onChange={setBedrooms}
      />
      <button
        type="submit"
        className="inline-flex h-[38px] w-full shrink-0 items-center justify-center rounded-[var(--radius-field)] bg-brand px-[22px] text-overline font-semibold text-white transition-colors hover:bg-brand-hover lg:w-[96px]"
      >
        {tc("search")}
      </button>
    </form>
  );
}
