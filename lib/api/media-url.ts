import { API_BASE_URL } from "./client";

const apiOrigin = () => API_BASE_URL.replace(/\/$/, "");

/**
 * Resolve API media paths for `<img>` / `next/image` `src`.
 *
 * The API returns root-relative `*_url` values (e.g. `/storage/properties/…`).
 * When the Next.js app runs on a different origin, prepend `NEXT_PUBLIC_API_URL`.
 * Full `http(s)://` values are passed through (legacy data).
 */
export function resolveMediaUrl(
  path: string | null | undefined,
): string | undefined {
  if (!path?.trim()) return undefined;

  const trimmed = path.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.pathname.startsWith("/storage/")) {
        return `${apiOrigin()}${parsed.pathname}${parsed.search}`;
      }
    } catch {
      return trimmed;
    }
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${apiOrigin()}${trimmed}`;
  }

  return trimmed;
}

/** Alias for docs / parity with backend handoff examples. */
export const mediaUrl = resolveMediaUrl;

/** Build a public URL for blog featured/author images when the API omits `*_url`. */
export function resolveBlogFeaturedImage(
  blog: { featured_image_url?: string | null; featured_image?: string | null },
): string | undefined {
  const fromApi = resolveMediaUrl(blog.featured_image_url);
  if (fromApi) return fromApi;

  const raw = blog.featured_image?.trim();
  if (!raw) return undefined;

  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
    return resolveMediaUrl(raw);
  }

  if (raw.startsWith("storage/")) {
    return resolveMediaUrl(`/${raw}`);
  }

  const relative = raw.includes("/") ? raw : `blogs/${raw}`;
  return resolveMediaUrl(`/storage/${relative}`);
}
