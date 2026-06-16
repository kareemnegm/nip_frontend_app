"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type EditableBlockEditButtonProps = {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

export function EditableBlockEditButton({
  label,
  onClick,
  className,
}: EditableBlockEditButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "absolute end-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full",
        "border border-line/80 bg-white/95 text-brand shadow-sm backdrop-blur-[1px]",
        "opacity-90 transition hover:scale-105 hover:border-brand/30 hover:bg-white hover:opacity-100 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        className,
      )}
      onClick={onClick}
    >
      <Icon name="pencil" className="h-3 w-3" />
    </button>
  );
}
