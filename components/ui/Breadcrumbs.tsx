import { AppLink } from "@/components/AppLink";
import { cn } from "@/lib/cn";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  tone?: "light" | "dark";
  format?: "default" | "property";
  className?: string;
};

export function Breadcrumbs({
  items,
  tone = "light",
  format = "default",
  className,
}: BreadcrumbsProps) {
  if (format === "property") {
    return (
      <nav
        aria-label="Breadcrumb"
        className={cn("text-xs leading-4 text-basalt-300", className)}
      >
        <ol className="flex flex-wrap items-center">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li
                key={`${item.label}-${index}`}
                className="flex items-center"
              >
                {index > 0 ? (
                  <span aria-hidden className="mx-2">
                    ›
                  </span>
                ) : null}
                {item.href && !isLast ? (
                  <AppLink
                    href={item.href}
                    className="transition-colors hover:text-brand"
                  >
                    {item.label}
                  </AppLink>
                ) : (
                  <span className={isLast ? "text-basalt-300" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

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
                <AppLink href={item.href} className="transition-colors hover:text-brand">
                  {item.label}
                </AppLink>
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
