/**
 * Removes `<div>...</div>` blocks (including nested divs) whose OWN opening
 * tag contains every class-name needle AND whose full content contains every
 * text needle. Scans in document order, matching tags via depth counting.
 *
 * Requiring a match on the div's own opening tag (not just its descendants')
 * is what keeps this safe to run over an entire article body: a generic
 * top-level wrapper (e.g. `<div class="prose">`) around real article content
 * will never itself carry the chrome-specific classes, so it's never
 * mistaken for the block we're trying to remove — only the actual chrome
 * wrapper div is. Bails out safely on unbalanced markup.
 */
function stripDivBlocks(
  html: string,
  classNeedles: string[],
  contentNeedles: string[],
): string {
  const divTagRe = /<div\b[^>]*>|<\/div\s*>/gi;
  let result = html;
  let searchFrom = 0;

  while (searchFrom < result.length) {
    divTagRe.lastIndex = searchFrom;
    const openMatch = divTagRe.exec(result);
    if (!openMatch) break;

    if (openMatch[0].toLowerCase().startsWith("</div")) {
      // Stray closing tag hit while scanning past a non-matching div's
      // opening tag — skip it and keep looking for the next opening tag.
      searchFrom = divTagRe.lastIndex;
      continue;
    }

    const openTag = openMatch[0];
    const start = openMatch.index;
    let depth = 1;
    divTagRe.lastIndex = start + openTag.length;
    let end: number | null = null;
    let tagMatch: RegExpExecArray | null;
    while ((tagMatch = divTagRe.exec(result))) {
      depth += tagMatch[0].toLowerCase().startsWith("</div") ? -1 : 1;
      if (depth === 0) {
        end = divTagRe.lastIndex;
        break;
      }
    }

    if (end == null) break; // unbalanced markup — don't risk truncating content

    const matchesOwnClasses = classNeedles.every((needle) => openTag.includes(needle));
    if (matchesOwnClasses) {
      const block = result.slice(start, end);
      if (contentNeedles.every((needle) => block.includes(needle))) {
        result = result.slice(0, start) + result.slice(end);
        searchFrom = start;
        continue;
      }
    }

    searchFrom = start + openTag.length;
  }

  return result;
}

/**
 * Prepare blog HTML for the T12 insight article body.
 * Strips XSS vectors, document wrappers, and embedded page chrome (footer/logo)
 * that sometimes ship inside CMS `source_code` exports.
 */
export function prepareInsightArticleHtml(raw: string): string {
  if (!raw || typeof raw !== "string") return "";

  let html = raw;

  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/gi, "");
  html = html.replace(/<script\b[^>]*\/?\s*>/gi, "");
  html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style\b[^>]*>/gi, "");
  html = html.replace(/<style\b[^>]*\/?\s*>/gi, "");
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

  // Document / landmark wrappers must never ship into dangerouslySetInnerHTML.
  // Legacy CMS exports almost always end with a stray `</article>`; during SSR
  // that closing tag closes the page's real <article> and blanks the page.
  html = html.replace(/<\/?(?:html|head|body|article|main|header|nav)[^>]*>/gi, "");

  html = html.replace(/<footer[\s\S]*?<\/footer>/gi, "");
  html = html.replace(/<img[^>]*alt=["'][^"']*logo[^"']*["'][^>]*>/gi, "");
  html = html.replace(
    /<(?:p|div|span|h[1-6])[^>]*>\s*NIP\s*[–-]\s*NOVEL INSIGHT PROPERTY[\s\S]*?<\/(?:p|div|span|h[1-6])>/gi,
    "",
  );

  // Legacy site export always appended its global "Office Location / Get In
  // Touch" footer contact block inside the article body HTML — it's page
  // chrome, not article content, so it must never render inline in the body.
  html = stripDivBlocks(
    html,
    ["border-t-2", "not-prose"],
    ["Office Location", "Get In Touch"],
  );

  return html.trim();
}
