"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";
import { cn } from "@/lib/cn";

type LocalizedLinkProps = Omit<
  React.ComponentProps<typeof Link>,
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
    <Link href={localizedHref(locale, href)} className={cn(className)} {...props}>
      {children}
    </Link>
  );
}
