import { cn } from "@/lib/cn";

export type PropertyTagDisplay = {
  slug: string;
  label: string;
};

const tagToneClasses: Record<string, string> = {
  featured: "bg-brand text-white",
  upcoming: "bg-accent text-white",
  new_launch: "border border-accent/40 bg-sapphire-100 text-brand",
};

const defaultTagClass = "border border-line bg-sapphire-50 text-ink-secondary";

export function propertyTagToneClass(slug: string): string {
  return tagToneClasses[slug.toLowerCase()] ?? defaultTagClass;
}

export function PropertyTagBadge({
  label,
  slug,
  className,
}: PropertyTagDisplay & { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-[var(--radius-field)] px-2.5 py-1 text-overline font-semibold uppercase leading-4 tracking-wide",
        propertyTagToneClass(slug),
        className,
      )}
    >
      {label}
    </span>
  );
}

export function PropertyTagBadgeStack({
  tags,
  className,
}: {
  tags: PropertyTagDisplay[];
  className?: string;
}) {
  if (!tags.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => (
        <PropertyTagBadge key={`${tag.slug}-${tag.label}`} {...tag} />
      ))}
    </div>
  );
}
