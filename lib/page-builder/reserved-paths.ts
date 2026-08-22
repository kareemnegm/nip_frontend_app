/** Paths that must never be used for builder pages (static App Router routes). */
export const RESERVED_BUILDER_PATHS = new Set([
  "/",
  "/about",
  "/properties",
  "/off-plan",
  "/resale",
  "/areas",
  "/developers",
  "/insights",
  "/faq",
  "/legal",
  "/contact",
  "/contribute",
  "/concierge",
  "/curated",
  "/private-office",
  "/thank-you",
  "/admin",
  "/arancia",
  "/global",
  "/404",
  "/500",
]);

export function normalizeBuilderPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") return "/";
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+$/, "") || "/";
}

export function isReservedBuilderPath(path: string): boolean {
  const normalized = normalizeBuilderPath(path);
  if (RESERVED_BUILDER_PATHS.has(normalized)) return true;
  if (normalized.startsWith("/admin")) return true;
  if (normalized.startsWith("/arancia")) return true;
  return false;
}

/** First URL segment used by fixed App Router pages (see app/[locale]/*). */
export const STATIC_APP_FIRST_SEGMENTS = new Set([
  "about",
  "admin",
  "areas",
  "builder",
  "concierge",
  "contact",
  "contribute",
  "curated",
  "developers",
  "faq",
  "insights",
  "legal",
  "off-plan",
  "private-office",
  "properties",
  "resale",
  "thank-you",
  "500",
]);

/** Whether proxy should rewrite a public URL to the internal builder route. */
export function shouldRewriteToBuilderPage(path: string): boolean {
  const normalized = normalizeBuilderPath(path);
  if (normalized === "/") return false;
  if (isReservedBuilderPath(normalized)) return false;

  const first = normalized.split("/").filter(Boolean)[0];
  if (!first || STATIC_APP_FIRST_SEGMENTS.has(first)) return false;

  return true;
}

export function validateBuilderPath(path: string): string | null {
  const normalized = normalizeBuilderPath(path);
  if (normalized === "/") {
    return "Path cannot be empty or just /.";
  }
  // Allow hyphens in every segment (e.g. /investor-guide, /a/b-c)
  if (!/^\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(normalized)) {
    return "Use lowercase letters, numbers, and hyphens only (e.g. /investor-guide).";
  }
  if (isReservedBuilderPath(normalized)) {
    return "That path is reserved for a fixed site page.";
  }
  return null;
}
