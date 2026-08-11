import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Gated or per-session pages carry no search value and can leak
        // member/staff surface area into the index.
        disallow: [
          "/api/",
          "/en/admin",
          "/ar/admin",
          "/en/private-office",
          "/ar/private-office",
          "/en/curated",
          "/ar/curated",
          "/en/thank-you",
          "/ar/thank-you",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
