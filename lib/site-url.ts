/**
 * Public origin used for canonical links, og:url, og:image and the sitemap.
 *
 * Production runs behind the internal host `frontend.niprealty.com`, so when
 * NEXT_PUBLIC_SITE_URL points there every absolute URL Next emits (including
 * og:image) resolves to a host social scrapers cannot fetch — WhatsApp and
 * Facebook then render a bare link with no preview card. Internal hosts are
 * mapped back to the public domain so previews work regardless of server env.
 */
const PUBLIC_SITE_URL = "https://niprealty.com";

const INTERNAL_HOSTS = new Set(["frontend.niprealty.com"]);

function isLocalHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".test") ||
    hostname.endsWith(".local")
  );
}

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return PUBLIC_SITE_URL;

  try {
    const url = new URL(raw);
    // Local dev origins stay as-is so previews point at the running dev server.
    if (isLocalHost(url.hostname)) return url.origin;
    return INTERNAL_HOSTS.has(url.hostname) ? PUBLIC_SITE_URL : url.origin;
  } catch {
    return PUBLIC_SITE_URL;
  }
}

export { PUBLIC_SITE_URL };
