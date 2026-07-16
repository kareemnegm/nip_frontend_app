/**
 * Opt out of scroll-to-top for exactly ONE upcoming navigation — used by
 * same-page filter/sort/view controls (PropertyFilterBar, PropertyResultsToolbar).
 *
 * Uses a one-shot flag (not a time window) so a filter click cannot accidentally
 * suppress scroll on a later footer link like "Exclusives" or "Lifestyle".
 */
const RESET_MS = 500;

let preserveNext = false;
let resetTimer: ReturnType<typeof setTimeout> | null = null;

export function preserveScrollOnNextNavigation() {
  preserveNext = true;

  if (resetTimer) {
    clearTimeout(resetTimer);
  }

  resetTimer = setTimeout(() => {
    preserveNext = false;
    resetTimer = null;
  }, RESET_MS);
}

/** Returns true once if the very next navigation should keep scroll position. */
export function consumePreserveScrollFlag(): boolean {
  if (!preserveNext) {
    return false;
  }

  preserveNext = false;
  if (resetTimer) {
    clearTimeout(resetTimer);
    resetTimer = null;
  }
  return true;
}
