import { cn } from "@/lib/cn";
import {
  propertyFactIconSvgs,
  type PropertyFactIconName,
} from "./property-fact-icons";

export type PropertyFactIconProps = {
  name: PropertyFactIconName;
  className?: string;
  title?: string;
};

export function PropertyFactIcon({ name, className, title }: PropertyFactIconProps) {
  const svgMarkup = propertyFactIconSvgs[name];

  return (
    <span
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center text-sapphire-600 [&>svg]:h-full [&>svg]:w-full",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}

export function isPropertyFactIconName(
  icon: string,
): icon is PropertyFactIconName {
  return icon in propertyFactIconSvgs;
}
