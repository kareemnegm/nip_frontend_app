"use client";

import { AppLink as Link } from "@/components/AppLink";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { localizedHref, stripLocaleFromPathname } from "@/lib/i18n/helpers";
import { useLocale } from "@/lib/i18n/context";

type Category = { label: string; slug: string };

export function InsightCategoryFilters({
  categories = [],
  activeCategory,
  className,
}: {
  categories?: Category[];
  activeCategory?: string;
  className?: string;
}) {
  const locale = useLocale().locale;
  const pathname = usePathname();
  const basePath = localizedHref(locale, stripLocaleFromPathname(pathname));

  const items = [{ label: "All", slug: "" }, ...categories];

  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {items.map((filter) => {
        const href = filter.slug ? `${basePath}?category=${filter.slug}` : basePath;
        const isActive = filter.slug ? activeCategory === filter.slug : !activeCategory;

        return (
          <Link
            key={filter.label}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex items-center rounded-[var(--radius-field)] px-4 py-2 text-body-sm font-medium transition-colors",
              isActive
                ? "bg-brand text-white"
                : "border border-border-default bg-white text-ink-secondary hover:border-brand hover:text-brand",
            )}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
