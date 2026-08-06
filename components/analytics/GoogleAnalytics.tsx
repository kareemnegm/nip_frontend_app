/**
 * Direct GA4 (gtag.js) tag. Measurement IDs are public by design, so the live
 * property is committed here rather than kept in .env.production — same as the
 * GTM container in GoogleTagManager.tsx.
 *
 * If this same property is ALSO configured as a GA4 tag inside the GTM
 * container, pageviews are counted twice — remove it from one place or the
 * other. Set NEXT_PUBLIC_GA_ID to point an environment at a different property.
 */
const DEFAULT_GA_ID = "G-7GP8DQNSRN";

/**
 * Resolves to the live property in production builds only, so `npm run dev`
 * traffic never reaches the real analytics stream. An explicit
 * NEXT_PUBLIC_GA_ID overrides in every environment.
 */
export function resolveGaId() {
  const override = process.env.NEXT_PUBLIC_GA_ID?.trim();

  if (override) {
    return override;
  }

  return process.env.NODE_ENV === "production" ? DEFAULT_GA_ID : "";
}

/**
 * Google's gtag.js snippet, rendered inline so it is present in the HTML the
 * server sends — the same reason the GTM snippet is inline (see
 * GoogleTagManager.tsx). `next/script` with `afterInteractive` is injected by
 * the client runtime after hydration, so the tag never appeared in <head>.
 *
 * The loader is `async`, so this does not block rendering.
 *
 * `send_page_view: true` covers the initial view; SPA navigations are reported
 * by AnalyticsRouteTracker.
 */
export function GoogleAnalytics() {
  const gaId = resolveGaId();

  if (!gaId) {
    return null;
  }

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <script
        id="ga4-init"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: true });`,
        }}
      />
    </>
  );
}
