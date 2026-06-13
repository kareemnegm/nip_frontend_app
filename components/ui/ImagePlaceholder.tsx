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
        "flex items-center justify-center bg-basalt-100 text-white",
        rounded && "rounded-[var(--radius-card)]",
        className,
      )}
    >
      <Icon name={icon} className="h-[70px] w-[70px]" />
      {label ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}
