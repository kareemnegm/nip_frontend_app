import { cn } from "@/lib/cn";

export type BadgeProps = {
  children: React.ReactNode;
  tone?: "muted" | "brand" | "dark" | "outline";
  className?: string;
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  muted: "bg-sapphire-50 text-ink-secondary",
  brand: "bg-sapphire-100 text-brand",
  dark: "bg-white/15 text-white",
  outline: "border border-line text-ink-secondary",
};

export function Badge({ children, tone = "muted", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
