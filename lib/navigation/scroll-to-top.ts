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

export function isMobileViewport() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

/**
 * Next.js and the browser can restore scroll position *after* our first
 * scrollTo (especially while loading.tsx swaps in, or for same-pathname
 * query changes). Retry briefly so the page always opens at the top unless
 * scroll was explicitly preserved.
 *
 * On mobile, stop retrying as soon as the user scrolls or touches — property
 * pages stream in slowly and a late scrollTo(0) yanks them back to the top.
 */
export function scrollPageToTopReliable() {
  let cancelled = false;

  const run = () => {
    if (cancelled) return;
    if (isMobileViewport() && window.scrollY > 16) {
      cancelled = true;
      return;
    }
    scrollPageToTop();
  };

  run();

  const cancel = () => {
    cancelled = true;
  };

  const onTouch = () => {
    if (isMobileViewport()) cancel();
  };

  const onScroll = () => {
    if (isMobileViewport() && window.scrollY > 16) cancel();
  };

  window.addEventListener("touchstart", onTouch, { passive: true });
  window.addEventListener("pointerdown", onTouch, { passive: true });
  window.addEventListener("wheel", onTouch, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  const frame = requestAnimationFrame(() => {
    run();
    requestAnimationFrame(run);
  });
  const delays = isMobileViewport() ? [0, 50] : [0, 50, 100, 200, 400, 800];
  const timers = delays.map((delay) => window.setTimeout(run, delay));

  return () => {
    cancel();
    cancelAnimationFrame(frame);
    timers.forEach((timer) => window.clearTimeout(timer));
    window.removeEventListener("touchstart", onTouch);
    window.removeEventListener("pointerdown", onTouch);
    window.removeEventListener("wheel", onTouch);
    window.removeEventListener("scroll", onScroll);
  };
}
