/**
 * Lets same-page controls (filter/sort/view toggles that change only the
 * query string) opt out of the global "scroll to top on navigation" behavior
 * in MotionRoot, without MotionRoot having to guess intent from the URL
 * alone. A short expiry window guards against a stale flag suppressing an
 * unrelated later navigation if no scroll effect happens to consume it.
 */
const PRESERVE_WINDOW_MS = 2000;

let preserveUntil = 0;

export function preserveScrollOnNextNavigation() {
  preserveUntil = Date.now() + PRESERVE_WINDOW_MS;
}

/** Returns true once if a preserve request is still active, then clears it. */
export function consumePreserveScrollFlag(): boolean {
  if (preserveUntil !== 0 && Date.now() <= preserveUntil) {
    preserveUntil = 0;
    return true;
  }
  preserveUntil = 0;
  return false;
}
