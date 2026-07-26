import Script from "next/script";

/**
 * Google Tag Manager container — shared with the standalone /arancia campaign
 * site (see public/arancia/index.html). Container IDs are public by design, so
 * this is committed rather than kept in .env.production on the server.
 *
 * Set NEXT_PUBLIC_GTM_ID to point a given environment at a different container.
 */
const DEFAULT_GTM_ID = "GTM-P898N9X4";

/**
 * Resolves to the default container in production builds only, so `npm run dev`
 * traffic never reaches the live analytics stream. An explicit
 * NEXT_PUBLIC_GTM_ID overrides in every environment.
 */
export function resolveGtmId() {
  const override = process.env.NEXT_PUBLIC_GTM_ID?.trim();

  if (override) {
    return override;
  }

  return process.env.NODE_ENV === "production" ? DEFAULT_GTM_ID : "";
}

/**
 * The <head> snippet is injected with `afterInteractive` (Next's recommended
 * strategy for tag managers); the <noscript> iframe mirrors Google's fallback.
 */
export function GoogleTagManager() {
  const gtmId = resolveGtmId();

  if (!gtmId) {
    return null;
  }

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
    </Script>
  );
}

export function GoogleTagManagerNoScript() {
  const gtmId = resolveGtmId();

  if (!gtmId) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
