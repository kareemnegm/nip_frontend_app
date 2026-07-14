import { cn } from "@/lib/cn";

type ConciergeTypingIndicatorProps = {
  label: string;
  className?: string;
};

/** Animated three-dot “typing…” bubble content for streaming assistant turns. */
export function ConciergeTypingIndicator({
  label,
  className,
}: ConciergeTypingIndicatorProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("inline-flex h-[18px] items-center gap-1.5", className)}
    >
      <span className="concierge-typing-dot h-1.5 w-1.5 rounded-full bg-ink-tertiary" />
      <span className="concierge-typing-dot concierge-typing-dot--delay-1 h-1.5 w-1.5 rounded-full bg-ink-tertiary" />
      <span className="concierge-typing-dot concierge-typing-dot--delay-2 h-1.5 w-1.5 rounded-full bg-ink-tertiary" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
