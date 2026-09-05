import { cn } from "@/lib/cn";

export type PropertyTagDisplay = {
  slug: string;
  label: string;
};

/** Figma Frame 3670:12105 — 10×4 padding, 22px row, Archivo 11/14 bold -0.22px. */
export const propertyTagClassName = "property-tag-chip";

/** @deprecated All image tags share one Figma style — kept for callers that imported it. */
export function propertyTagToneClass(_slug: string): string {
  return propertyTagClassName;
}

export function PropertyTagBadge({
  label,
  className,
}: PropertyTagDisplay & { className?: string }) {
  return <span className={cn(propertyTagClassName, className)}>{label}</span>;
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
    <div className={cn("property-tag-stack", className)}>
      {tags.map((tag) => (
        <PropertyTagBadge key={`${tag.slug}-${tag.label}`} {...tag} />
      ))}
    </div>
  );
}
