"use client";

import { AppLink } from "@/components/AppLink";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";
import { cn } from "@/lib/cn";

type LocalizedLinkProps = Omit<
  React.ComponentProps<typeof AppLink>,
  "href"
> & {
  href: string;
};

export function LocalizedLink({
  href,
  className,
  children,
  ...props
}: LocalizedLinkProps) {
  const { locale } = useLocale();

  return (
    <AppLink href={localizedHref(locale, href)} className={cn(className)} {...props}>
      {children}
    </AppLink>
  );
}
