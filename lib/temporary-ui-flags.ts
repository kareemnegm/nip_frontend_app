/**
 * Short-term UI toggles — set to `false` (or remove) when re-enabling.
 */
export const TEMP_HIDE_MAIN_NAV_CONCIERGE = true;
export const TEMP_HIDE_AR_LANGUAGE_SWITCH = true;

export function isLanguageSwitcherVisible(): boolean {
  return !TEMP_HIDE_AR_LANGUAGE_SWITCH;
}
