"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const filters = [
  "All",
  "Market Intelligence",
  "Investment Guides",
  "Golden Visa",
  "Journal",
] as const;

export function InsightCategoryFilters({ className }: { className?: string }) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          aria-pressed={active === filter}
          onClick={() => setActive(filter)}
          className={cn(
            "inline-flex items-center rounded-[var(--radius-field)] px-4 py-2 text-xs font-semibold transition-colors",
            active === filter
              ? "bg-brand text-white"
              : "border border-line bg-white text-ink-secondary hover:border-brand hover:text-brand",
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
