import { cn } from "@/lib/cn";

export type LogoProps = {
  inverted?: boolean;
  className?: string;
};

export function Logo({ inverted = false, className }: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-serif font-bold tracking-tight",
        inverted ? "text-white" : "text-brand",
        className,
      )}
      aria-label="Novel Insight Property"
    >
      <span className="text-4xl leading-none">NIP</span>
      <span className="h-8 w-px bg-current opacity-50" />
      <span className="max-w-16 text-[9px] uppercase leading-tight tracking-wide">
        Novel Insight Property
      </span>
    </div>
  );
}
