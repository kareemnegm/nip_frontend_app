import { cn } from "@/lib/cn";

export type BadgeProps = {
  children: React.ReactNode;
  tone?: "muted" | "brand" | "dark" | "outline" | "property";
  className?: string;
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  muted: "bg-sapphire-50 text-ink-secondary",
  brand: "bg-sapphire-100 text-brand",
  dark: "bg-white/15 text-white",
  outline: "border border-line text-ink-secondary",
  property:
    "rounded-[var(--radius-field)] bg-basalt-50 px-3 py-[7px] text-[11px] font-medium normal-case leading-[14px] tracking-normal text-ink-secondary",
};

export function Badge({ children, tone = "muted", className }: BadgeProps) {
  return (
    <span
      className={cn(
        tone === "property"
          ? toneClasses.property
          : "inline-flex items-center rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
        tone !== "property" && toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
