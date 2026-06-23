/**
 * Prepare blog HTML for the T12 insight article body.
 * Strips XSS vectors, document wrappers, and embedded page chrome (footer/logo)
 * that sometimes ship inside CMS `source_code` exports.
 */
export function prepareInsightArticleHtml(raw: string): string {
  if (!raw || typeof raw !== "string") return "";

  let html = raw;

  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/gi, "");
  html = html.replace(/<script\b[^>]*\/?\s*>/gi, "");
  html = html.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
  html = html.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, "");
  html = html.replace(
    /\s+(?:href|src)\s*=\s*["']?\s*javascript:[^"'\s>]*/gi,
    "",
  );

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch?.[1]) {
    html = bodyMatch[1];
  }

  html = html.replace(/<\/?(?:html|head|body)[^>]*>/gi, "");

  html = html.replace(/<footer[\s\S]*?<\/footer>/gi, "");
  html = html.replace(/<img[^>]*alt=["'][^"']*logo[^"']*["'][^>]*>/gi, "");
  html = html.replace(
    /<(?:p|div|span|h[1-6])[^>]*>\s*NIP\s*[–-]\s*NOVEL INSIGHT PROPERTY[\s\S]*?<\/(?:p|div|span|h[1-6])>/gi,
    "",
  );

  return html.trim();
}
