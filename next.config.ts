import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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
  images: {
    remotePatterns: apiImageHosts(),
    // Media is served from NEXT_PUBLIC_API_URL (see lib/api/media-url.ts).
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
};

export default withNextIntl(nextConfig);
