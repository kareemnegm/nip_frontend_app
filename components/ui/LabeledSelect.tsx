import { cn } from "@/lib/cn";

/** Figma filter/sort chevron — 10×10, stroke ink-secondary */
function SelectChevron({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className={cn("size-2.5 shrink-0 aspect-square text-ink-secondary", className)}
      aria-hidden
    >
      <path
        d="M8.33317 3.33332L4.99984 6.66666L1.6665 3.33332"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type LabeledSelectOption = {
  label: string;
  value: string;
};

export type LabeledSelectProps = {
  "aria-label": string;
  options: LabeledSelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Figma filter width = 110px; sort uses auto width */
  widthClassName?: string;
  heightClassName?: string;
  borderClassName?: string;
};

/**
 * Figma "04 Label/Default" select — pl 14px, gap 6px, icon 10px, pr 12px.
 * Native select is invisible; visible label + arrow hug content (arrow not far right).
 */
export function LabeledSelect({
  "aria-label": ariaLabel,
  options,
  value,
  onChange,
  className,
  widthClassName = "w-full min-w-0 flex-1 sm:max-w-[140px] lg:w-[110px] lg:max-w-[110px] lg:flex-none",
  /** Figma filter py 6px; sort toolbar passes h-9 */
  heightClassName = "py-1.5",
  borderClassName = "border-line",
}: LabeledSelectProps) {
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];
  const displayLabel = selectedOption?.label ?? "";

  return (
    <div className={cn("relative", widthClassName, className)}>
      <div
        className={cn(
          "pointer-events-none flex w-full items-center gap-1.5 rounded-[var(--radius-field)] border bg-white pl-3.5 pr-3",
          heightClassName,
          borderClassName,
        )}
      >
        <span className="shrink-0 text-label font-medium text-ink-secondary">
          {displayLabel}
        </span>
        <SelectChevron />
      </div>
      <select
        aria-label={ariaLabel}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
