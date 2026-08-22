"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { scrollToTopOnNavigateClick } from "@/lib/navigation/scroll-to-top";

type AppLinkProps = React.ComponentProps<typeof Link>;

function subscribeMobile(onChange: () => void) {
  const media = window.matchMedia("(max-width: 1023px)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getMobileSnapshot() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

/**
 * Next.js Link that always opens the destination from the top of the page
 * (navbar), unless scroll={false} or the href is a same-page hash / contact link.
 *
 * On phones, Next's own scroll-to-top is turned off. Property pages finish
 * loading after the user has already started scrolling; a second scroll-to-top
 * then snaps the screen back to the header.
 */
export function AppLink({
  href,
  scroll = true,
  onClick,
  ...props
}: AppLinkProps) {
  const hrefString = typeof href === "string" ? href : href.pathname ?? "";
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, () => false);
  const allowNextScroll = scroll !== false && !isMobile;

  return (
    <Link
      href={href}
      scroll={allowNextScroll}
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
