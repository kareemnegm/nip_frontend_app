/** True when navigating to this href should open the destination from the top. */
export function shouldScrollToTopForHref(href: string | undefined | null): boolean {
  if (!href) return false;
  if (href.startsWith("#")) return false;
  if (href.includes("#")) return false;
  if (
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith("sms:") ||
    href.startsWith("javascript:")
  ) {
    return false;
  }
  return true;
}

/** Call from link/button onClick so the next page opens from the navbar. */
export function scrollToTopOnNavigateClick(href: string | undefined | null) {
  if (shouldScrollToTopForHref(href)) {
    scrollPageToTop();
  }
}

/** Instant scroll to document top — used after route changes and link clicks. */
export function scrollPageToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/**
 * Next.js and the browser can restore scroll position *after* our first
 * scrollTo (especially while loading.tsx swaps in, or for same-pathname
 * query changes). Retry briefly so the page always opens at the top unless
 * scroll was explicitly preserved.
 */
export function scrollPageToTopReliable() {
  scrollPageToTop();

  const frame = requestAnimationFrame(() => {
    scrollPageToTop();
    requestAnimationFrame(scrollPageToTop);
  });
  const timers = [0, 50, 100, 200, 400, 800].map((delay) =>
    window.setTimeout(scrollPageToTop, delay),
  );

  return () => {
    cancelAnimationFrame(frame);
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}
