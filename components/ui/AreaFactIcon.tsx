import { cn } from "@/lib/cn";
import { areaFactIconSvgs, type AreaFactIconName } from "./area-fact-icon-registry";

export type AreaFactIconProps = {
  name: AreaFactIconName;
  className?: string;
  title?: string;
};

/** Area detail facts strip icons — 36×36 stroke matched to crane / communities. */
export function AreaFactIcon({ name, className, title }: AreaFactIconProps) {
  return (
    <span
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center text-sapphire-600 [&>svg]:h-full [&>svg]:w-full",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: areaFactIconSvgs[name] }}
    />
  );
}

export function isAreaFactIconName(value: string): value is AreaFactIconName {
  return value in areaFactIconSvgs;
}
