import type { MetadataRoute } from "next";
import { getAreas } from "@/lib/api/areas";
import { getBlogs } from "@/lib/api/blogs";
import { getDevelopers } from "@/lib/api/developers";
import { getProperties } from "@/lib/api/properties";
import { locales } from "@/lib/i18n/config";
import { propertyDetailHref } from "@/lib/mappers/property";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Built from live routes, not the backend's legacy sitemap XML — that feed
 * still lists pre-relaunch WordPress URLs (`/about-us/`, `/blog/`, project
 * slugs at the root) which all 404 here, so Google was crawling 80 dead links.
 */
const STATIC_PATHS = [
  "",
  "/properties",
  "/off-plan",
  "/areas",
  "/developers",
  "/insights",
  "/about",
  "/contact",
  "/faq",
  "/concierge",
  "/contribute",
  "/legal",
] as const;

const LIST_PAGE_SIZE = 100;

type Entry = MetadataRoute.Sitemap[number];

function entry(
  siteUrl: string,
  path: string,
  priority: number,
  lastModified?: string | null,
): Entry {
  return {
    url: `${siteUrl}${path}`,
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    priority,
  };
}

async function safeList<T>(load: () => Promise<{ data: T[] }>): Promise<T[]> {
  try {
    const response = await load();
    return response.data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [properties, areas, developers, blogs] = await Promise.all([
    safeList(() => getProperties({ per_page: LIST_PAGE_SIZE })),
    safeList(() => getAreas({ per_page: LIST_PAGE_SIZE })),
    safeList(() => getDevelopers({ per_page: LIST_PAGE_SIZE })),
    safeList(() => getBlogs({ per_page: LIST_PAGE_SIZE })),
  ]);

  const entries: Entry[] = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push(entry(siteUrl, `/${locale}${path}`, path === "" ? 1 : 0.8));
    }

    for (const property of properties) {
      entries.push(
        entry(
          siteUrl,
          propertyDetailHref(property, locale),
          0.7,
          property.created_at,
        ),
      );
    }

    for (const area of areas) {
      entries.push(entry(siteUrl, `/${locale}/areas/${area.slug}`, 0.6));
    }

    for (const developer of developers) {
      entries.push(
        entry(siteUrl, `/${locale}/developers/${developer.slug}`, 0.6),
      );
    }

    for (const blog of blogs) {
      entries.push(
        entry(siteUrl, `/${locale}/insights/${blog.slug}`, 0.6, blog.created_at),
      );
    }
  }

  return entries;
}
