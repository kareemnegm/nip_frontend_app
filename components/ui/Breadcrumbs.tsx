import { cn } from "@/lib/cn";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  tone?: "light" | "dark";
  className?: string;
};

export function Breadcrumbs({ items, tone = "light", className }: BreadcrumbsProps) {
  const base = tone === "dark" ? "text-white/60" : "text-ink-tertiary";
  const active = tone === "dark" ? "text-white" : "text-ink-secondary";

  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs", base, className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <a href={item.href} className="transition-colors hover:text-brand">
                  {item.label}
                </a>
              ) : (
                <span className={isLast ? active : undefined}>{item.label}</span>
              )}
              {!isLast ? <span aria-hidden>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
