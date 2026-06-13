import { cn } from "@/lib/cn";

export type LogoProps = {
  inverted?: boolean;
  className?: string;
};

export function Logo({ inverted = false, className }: LogoProps) {
  return (
    <div
      className={cn(
        "flex w-[112px] items-center gap-2",
        inverted ? "text-white" : "text-brand",
        className,
      )}
      aria-label="Novel Insight Property"
    >
      <span className="font-[family-name:var(--font-logo)] text-[24px] font-medium leading-[1] tracking-[-0.06em]">
        NIP
      </span>
      <span className="h-6 w-px shrink-0 bg-current opacity-70" />
      <span className="text-[10px] font-semibold uppercase leading-[8px] tracking-[-0.04em]">
        Novel
        <br />
        Insight
        <br />
        Property
      </span>
    </div>
  );
}
