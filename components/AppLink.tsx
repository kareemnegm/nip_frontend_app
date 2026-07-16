"use client";

import Link from "next/link";
import { scrollToTopOnNavigateClick } from "@/lib/navigation/scroll-to-top";

type AppLinkProps = React.ComponentProps<typeof Link>;

/**
 * Next.js Link that always opens the destination from the top of the page
 * (navbar), unless scroll={false} or the href is a same-page hash / contact link.
 */
export function AppLink({
  href,
  scroll = true,
  onClick,
  ...props
}: AppLinkProps) {
  const hrefString = typeof href === "string" ? href : href.pathname ?? "";

  return (
    <Link
      href={href}
      scroll={scroll}
      {...props}
      onClick={(event) => {
        if (scroll !== false) {
          scrollToTopOnNavigateClick(hrefString);
        }
        onClick?.(event);
      }}
    />
  );
}
