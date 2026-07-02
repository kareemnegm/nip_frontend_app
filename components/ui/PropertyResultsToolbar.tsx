"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export type PropertyResultsToolbarProps = {
  count?: number;
  location?: string;
  currentSort?: string;
  currentView?: "grid" | "list";
  className?: string;
};

export function PropertyResultsToolbar({
  count = 0,
  location,
  currentSort = "newest",
  currentView = "grid",
  className,
}: PropertyResultsToolbarProps) {
  const t = useTranslations("catalog");
  const tc = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const resolvedLocation = location ?? tc("dubai");

  const navigate = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset to page 1 when sort/view changes
      params.delete("page");
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [router, pathname, searchParams],
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      <p className="text-overline font-semibold leading-4 text-brand">
        {t("propertiesCount", { count, location: resolvedLocation })}
      </p>

      <div className="flex items-center gap-4">
        {/* Sort */}
        <div className="relative">
          <select
            aria-label={t("sortLabel")}
            value={currentSort}
            onChange={(e) => navigate({ sort: e.target.value })}
            className="h-9 appearance-none rounded-[var(--radius-field)] border border-border-default bg-white pl-3.5 pr-8 text-body-sm font-medium text-ink-secondary outline-none rtl:pl-8 rtl:pr-3.5"
          >
            <option value="newest">{t("sortNewest")}</option>
            <option value="price-asc">{t("sortPriceLow")}</option>
            <option value="price-desc">{t("sortPriceHigh")}</option>
          </select>
          <Icon
            name="chevronDown"
            className="pointer-events-none absolute right-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 text-ink-secondary rtl:right-auto rtl:left-3"
          />
        </div>

        {/* View toggle */}
        <div className="flex overflow-hidden rounded-[var(--radius-field)] border border-[#b5c4d8]">
          <button
            type="button"
            aria-label={t("gridView")}
            aria-pressed={currentView === "grid"}
            onClick={() => navigate({ view: "grid" })}
            className={cn(
              "inline-flex h-9 w-[52px] items-center justify-center px-3.5 py-1.5 transition-colors",
              currentView === "grid" ? "bg-brand text-white" : "bg-white text-ink-secondary",
            )}
          >
            <Icon name="grid" className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label={t("listView")}
            aria-pressed={currentView === "list"}
            onClick={() => navigate({ view: "list" })}
            className={cn(
              "inline-flex h-9 w-[52px] items-center justify-center px-3.5 py-1.5 transition-colors",
              currentView === "list" ? "bg-brand text-white" : "bg-white text-ink-secondary",
            )}
          >
            <Icon name="list" className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
