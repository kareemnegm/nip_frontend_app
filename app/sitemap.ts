import type { MetadataRoute } from "next";
import { API_V1_ROOT } from "@/lib/api/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const response = await fetch(`${API_V1_ROOT}/sitemap`, {
      next: { revalidate: 3600 },
    });
    if (response.ok) {
      const xml = await response.text();
      const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
      if (locs.length > 0) {
        return locs.map((url) => ({
          url,
          lastModified: new Date(),
        }));
      }
    }
  } catch {
    /* fall through to static entries */
  }

  return [
    { url: `${siteUrl}/en`, lastModified: new Date() },
    { url: `${siteUrl}/en/properties`, lastModified: new Date() },
    { url: `${siteUrl}/en/off-plan`, lastModified: new Date() },
    { url: `${siteUrl}/en/areas`, lastModified: new Date() },
    { url: `${siteUrl}/en/developers`, lastModified: new Date() },
    { url: `${siteUrl}/en/insights`, lastModified: new Date() },
    { url: `${siteUrl}/en/contact`, lastModified: new Date() },
  ];
}
