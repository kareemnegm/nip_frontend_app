import { API_BASE_URL } from "./client";

const apiOrigin = () => API_BASE_URL.replace(/\/$/, "");

/**
 * Hosts `next/image` is allowed to optimize — must stay in sync with
 * `images.remotePatterns` in next.config.ts. A src on any other host makes
 * next/image THROW, which turns one bad record into a 500 for the whole page,
 * so unknown hosts are dropped and the card renders its placeholder instead.
 */
const STATIC_ALLOWED_HOSTS = new Set([
  "127.0.0.1",
  "localhost",
  "nip_reality_backend.test",
]);

function isOptimizableHost(hostname: string): boolean {
  if (STATIC_ALLOWED_HOSTS.has(hostname)) return true;
  try {
    return new URL(apiOrigin()).hostname === hostname;
  } catch {
    return false;
  }
}

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
    let parsed: URL;
    try {
      parsed = new URL(trimmed);
    } catch {
      return undefined;
    }
    if (parsed.pathname.startsWith("/storage/")) {
      return `${apiOrigin()}${parsed.pathname}${parsed.search}`;
    }
    return isOptimizableHost(parsed.hostname) ? trimmed : undefined;
  }

  if (trimmed.startsWith("/")) {
    return `${apiOrigin()}${trimmed}`;
  }

  return trimmed;
}

/** Alias for docs / parity with backend handoff examples. */
export const mediaUrl = resolveMediaUrl;

/** Build a public URL for a blog image when the API omits its `*_url` companion. */
function resolveBlogImage(
  urlField: string | null | undefined,
  rawField: string | null | undefined,
): string | undefined {
  const fromApi = resolveMediaUrl(urlField);
  if (fromApi) return fromApi;

  const raw = rawField?.trim();
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

export function resolveBlogFeaturedImage(
  blog: { featured_image_url?: string | null; featured_image?: string | null },
): string | undefined {
  return resolveBlogImage(blog.featured_image_url, blog.featured_image);
}

/** Mid-article image — its own upload, never scraped out of the body HTML. */
export function resolveBlogContentImage(
  blog: { content_image_url?: string | null; content_image?: string | null },
): string | undefined {
  return resolveBlogImage(blog.content_image_url, blog.content_image);
}

type DualMediaFields = {
  urlField?: string | null;
  rawField?: string | null;
  storagePrefix: string;
  /** `<video src>` can use external CDNs that `next/image` rejects. */
  allowExternalUrl?: boolean;
};

function resolveDualMediaUrl({
  urlField,
  rawField,
  storagePrefix,
  allowExternalUrl = false,
}: DualMediaFields): string | undefined {
  const fromApi = resolveMediaUrl(urlField);
  if (fromApi) return fromApi;

  const raw = rawField?.trim();
  if (!raw) return undefined;

  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
    const resolved = resolveMediaUrl(raw);
    if (resolved) return resolved;
    if (allowExternalUrl && (raw.startsWith("http://") || raw.startsWith("https://"))) {
      try {
        new URL(raw);
        return raw;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  if (raw.startsWith("storage/")) {
    return resolveMediaUrl(`/${raw}`);
  }

  const relative = raw.includes("/") ? raw : `${storagePrefix}/${raw}`;
  return resolveMediaUrl(`/storage/${relative}`);
}

/** Property teaser / tour video — prefers `video_url` / `videoUrl`, falls back to `video` path. */
export function resolvePropertyVideoUrl(property: {
  video?: string | null;
  video_url?: string | null;
  videoUrl?: string | null;
}): string | undefined {
  return resolveDualMediaUrl({
    urlField: property.video_url ?? property.videoUrl,
    rawField: property.video,
    storagePrefix: "properties",
    allowExternalUrl: true,
  });
}

/** RERA / listing QR — prefers `qr_code_image_url`, falls back to `qr_code_image` path. */
export function resolvePropertyQrCodeUrl(property: {
  qr_code_image_url?: string | null;
  qrCodeImageUrl?: string | null;
  qr_code_image?: string | null;
  qrCodeImage?: string | null;
}): string | undefined {
  return resolveDualMediaUrl({
    urlField: property.qr_code_image_url ?? property.qrCodeImageUrl,
    rawField: property.qr_code_image ?? property.qrCodeImage,
    storagePrefix: "properties",
  });
}
