import { cn } from "@/lib/cn";
import {
  footerIconSvgs,
  type FooterIconName,
} from "./footer-icon-registry";

export type FooterIconProps = {
  name: FooterIconName;
  className?: string;
  title?: string;
};

export function FooterIcon({ name, className, title }: FooterIconProps) {
  const svgMarkup = footerIconSvgs[name];

  return (
    <span
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn(
        "inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}

export type FooterSocialIconName = "instagram" | "facebook" | "linkedin" | "youtube";

export function FooterSocialIcon({
  name,
  className,
  title,
}: {
  name: FooterSocialIconName;
  className?: string;
  title?: string;
}) {
  return (
    <FooterIcon
      name={name}
      title={title}
      className={cn("text-white", className)}
    />
  );
}

export type { FooterIconName };
