import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { NO_STORE_CACHE_CONTROL } from "./lib/no-cache";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

function apiImageHosts(): { protocol: "http" | "https"; hostname: string }[] {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    "http://127.0.0.1:8000";

  try {
    const url = new URL(raw);
    const protocol = url.protocol === "https:" ? "https" : "http";
    return [
      { protocol, hostname: url.hostname },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "nip_reality_backend.test" },
    ];
  } catch {
    return [
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "http", hostname: "localhost" },
    ];
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    const noStore = [
      { key: "Cache-Control", value: NO_STORE_CACHE_CONTROL },
      { key: "Pragma", value: "no-cache" },
      { key: "Expires", value: "0" },
    ];

    return [
      // Hashed build assets — safe to cache forever; new deploys get new filenames.
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Everything else (HTML, API routes, public images) — never cache.
      {
        source: "/:path*",
        headers: noStore,
      },
    ];
  },
  async redirects() {
    return [
      // Browsers request /favicon.ico — send them to the real PNG (never serve PNG bytes at .ico).
      {
        source: "/favicon.ico",
        destination: "/brand/logo-small.png",
        permanent: true,
      },
      // Pre-relaunch WordPress URLs that Google still has indexed. Without these
      // they fall through to the locale redirect and 404 (/about-us -> /en/about-us).
      { source: "/about-us", destination: "/en/about", permanent: true },
      { source: "/contact-us", destination: "/en/contact", permanent: true },
      { source: "/faqs", destination: "/en/faq", permanent: true },
      { source: "/careers", destination: "/en/about", permanent: true },
      { source: "/blog", destination: "/en/insights", permanent: true },
      {
        source: "/blog/:slug",
        destination: "/en/insights/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: apiImageHosts(),
    // Media is served from NEXT_PUBLIC_API_URL (see lib/api/media-url.ts).
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    // Developer/area logos are often uploaded as SVG. next/image blocks SVG
    // optimization by default (XSS risk from embedded scripts), so it must be
    // allowed explicitly — paired with a strict CSP so an untrusted SVG still
    // can't execute a script when served through the optimizer.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);
