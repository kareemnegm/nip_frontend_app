import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

export type ImagePlaceholderProps = {
  icon?: IconName;
  label?: string;
  className?: string;
  rounded?: boolean;
};

export function ImagePlaceholder({
  icon = "home",
  label,
  className,
  rounded = true,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-sapphire-100 text-white",
        rounded && "rounded-[var(--radius-card)]",
        className,
      )}
    >
      <Icon name={icon} className="h-14 w-14" />
      {label ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}
