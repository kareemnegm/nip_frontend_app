/** Instant scroll to document top — used after route changes. */
export function scrollPageToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

/**
 * Next.js and the browser can restore scroll position *after* our first
 * scrollTo (especially for same-pathname query changes like footer
 * "Exclusives" or "Lifestyle"). Retry briefly so the page always opens at
 * the top unless scroll was explicitly preserved.
 */
export function scrollPageToTopReliable() {
  scrollPageToTop();

  const frame = requestAnimationFrame(scrollPageToTop);
  const timers = [0, 50, 150, 300].map((delay) =>
    window.setTimeout(scrollPageToTop, delay),
  );

  return () => {
    cancelAnimationFrame(frame);
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}
