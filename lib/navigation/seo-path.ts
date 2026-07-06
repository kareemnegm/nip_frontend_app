/** Normalize href to a page_seo lookup path (strip hash/query; external → null). */
export function resolveSeoPath(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return null;
  }
  const withoutHash = trimmed.split("#")[0] ?? trimmed;
  const pathOnly = withoutHash.split("?")[0] ?? withoutHash;
  if (!pathOnly.startsWith("/")) {
    return `/${pathOnly}`;
  }
  return pathOnly || "/";
}
