/** Tells browsers and CDNs never to reuse HTML, JSON, or API responses. */
export const NO_STORE_CACHE_CONTROL =
  "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";

export function applyNoStoreHeaders(headers: Headers): void {
  headers.set("Cache-Control", NO_STORE_CACHE_CONTROL);
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
}
