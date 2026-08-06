/**
 * Google Tag Manager container for the main site. Container IDs are public by
 * design, so this is committed rather than kept in .env.production on the server.
 *
 * The standalone /arancia campaign pages (public/arancia/*.html) still hardcode
 * the older GTM-P898N9X4 container — they are plain HTML and are not affected by
 * this component.
 *
 * Set NEXT_PUBLIC_GTM_ID to point a given environment at a different container.
 */
const DEFAULT_GTM_ID = "GTM-PF5RZBCH";

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
 * Google's container snippet, rendered inline so it is present in the HTML the
 * server sends — Google's install instructions put it "as high in the <head> as
 * possible", and tag verification tools read the initial document.
 *
 * A `next/script` with `afterInteractive` was used here before, but that is
 * injected by the client runtime after hydration: the tag worked, yet it never
 * appeared in <head>, so it fired late and verifiers could not see it.
 *
 * The snippet itself is not blocking — it only appends an `async` script tag.
 * The <noscript> iframe below mirrors Google's fallback.
 */
export function GoogleTagManager() {
  const gtmId = resolveGtmId();

  if (!gtmId) {
    return null;
  }

  return (
    // The rule suggests next/script; that is precisely what this replaces —
    // next/script keeps the snippet out of the server HTML, which defeats the
    // point of installing it in <head>.
    // eslint-disable-next-line @next/next/next-script-for-ga
    <script
      id="gtm-init"
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
      }}
    />
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
