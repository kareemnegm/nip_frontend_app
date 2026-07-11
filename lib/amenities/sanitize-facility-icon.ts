/**
 * Basic sanitization for backend facility SVG markup.
 * Strips scripts, event handlers, and foreignObject before inline render.
 */
export function sanitizeFacilityIconSvg(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;

  let svg = raw.trim();

  if (!/^<svg[\s>]/i.test(svg)) return null;

  svg = svg
    .replace(/<\?xml[^?]*\?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/#0[Bb]3268/gi, "currentColor")
    .replace(/#0[Ee]4286/gi, "currentColor")
    .replace(/#171[Ee]2[Dd]/gi, "currentColor")
    .replace(/#323[Ee]58/gi, "currentColor")
    .replace(/#4[Ee]5[Aa]78/gi, "currentColor")
    .replace(/#7[Ee]8[Aa][Aa]4/gi, "currentColor")
    .replace(/fill="white"/gi, 'fill="currentColor"')
    .replace(/stroke="white"/gi, 'stroke="currentColor"');

  if (!/^<svg[\s>]/i.test(svg)) return null;

  return svg;
}
