"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export type PropertyResultsToolbarProps = {
  count?: number;
  location?: string;
  className?: string;
};

export function PropertyResultsToolbar({
  count = 128,
  location = "Dubai",
  className,
}: PropertyResultsToolbarProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      <p className="text-overline font-semibold leading-4 text-brand">
        {count} properties | {location}
      </p>

      <div className="flex items-center gap-4">
        <div className="relative">
          <select
            aria-label="Sort properties"
            defaultValue="newest"
            className="h-9 appearance-none rounded-[var(--radius-field)] border border-border-default bg-white pl-3.5 pr-8 text-body-sm font-medium text-ink-secondary outline-none"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Sort: Price (Low)</option>
            <option value="price-desc">Sort: Price (High)</option>
          </select>
          <Icon
            name="chevronDown"
            className="pointer-events-none absolute right-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 text-ink-secondary"
          />
        </div>

        <div className="flex overflow-hidden rounded-[var(--radius-field)] border border-[#b5c4d8]">
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
            className={cn(
              "inline-flex h-9 w-[52px] items-center justify-center px-3.5 py-1.5 transition-colors",
              view === "grid" ? "bg-brand text-white" : "bg-white text-ink-secondary",
            )}
          >
            <Icon name="grid" className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={cn(
              "inline-flex h-9 w-[52px] items-center justify-center px-3.5 py-1.5 transition-colors",
              view === "list" ? "bg-brand text-white" : "bg-white text-ink-secondary",
            )}
          >
            <Icon name="list" className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
