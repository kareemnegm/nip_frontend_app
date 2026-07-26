import Script from "next/script";

/**
 * Direct GA4 (gtag.js) tag.
 *
 * Only needed when GA4 is NOT already configured inside the GTM container.
 * Set NEXT_PUBLIC_GA_ID to enable; leave it empty to avoid double-counting
 * pageviews when GTM fires the GA4 configuration tag.
 *
 * `send_page_view: false` is off here because gtag handles the initial view;
 * SPA navigations are reported by AnalyticsRouteTracker.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) {
    return null;
  }

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: true });`}
      </Script>
    </>
  );
}
