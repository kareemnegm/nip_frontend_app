import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const iconDir = path.join(root, "public/icons/figma/footer");

const assets = {
  phone: "https://www.figma.com/api/mcp/asset/eb6a09fa-25e9-4811-a679-7ff16996952d",
  mail: "https://www.figma.com/api/mcp/asset/ab92f7df-3a67-42ba-8782-ac16ce2f242b",
  location: "https://www.figma.com/api/mcp/asset/48c588a1-2209-488c-b80c-76d89a909b7d",
  instagram: "https://www.figma.com/api/mcp/asset/21a8b014-135a-4702-9e7e-9521317e14c3",
  facebook: "https://www.figma.com/api/mcp/asset/30b8aef7-6968-42c6-8131-5137d37ddef6",
  linkedin: "https://www.figma.com/api/mcp/asset/56798f52-9a04-4f4e-9116-c76d19daa532",
  youtube: "https://www.figma.com/api/mcp/asset/f4235969-15c2-46d9-a4c8-c36e8a3b4391",
};

function normalizeSvg(svg) {
  return svg
    .replace(/<\?xml[^?]*\?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/#0[Bb]3268/gi, "currentColor")
    .replace(/#0[Ee]4286/gi, "currentColor")
    .replace(/#171[Ee]2[Dd]/gi, "currentColor")
    .replace(/#323[Ee]58/gi, "currentColor")
    .replace(/#4[Ee]5[Aa]78/gi, "currentColor")
    .replace(/#7[Ee]8[Aa][Aa]4/gi, "currentColor")
    .replace(/#A6ADBA/gi, "currentColor")
    .replace(/fill="white"/gi, 'fill="currentColor"')
    .replace(/stroke="white"/gi, 'stroke="currentColor"')
    .replace(/fill="var\(--fill-0,\s*white\)"/gi, 'fill="currentColor"')
    .replace(/<rect width="14" height="14" fill="currentColor"\/>/gi, '<rect width="14" height="14" rx="2" fill="#FFFFFF"/>')
    .replace(/stroke="var\(--stroke-0,\s*currentColor\)"/gi, 'stroke="currentColor"')
    .trim();
}

function extractIconGlyph(svg) {
  const normalized = normalizeSvg(svg);
  const drawablePatterns = [
    /<path\b[^>]*\/>/gi,
    /<path\b[^>]*>[\s\S]*?<\/path>/gi,
    /<circle\b[^>]*\/>/gi,
    /<rect\b[^>]*\/>/gi,
    /<line\b[^>]*\/>/gi,
    /<polyline\b[^>]*\/>/gi,
    /<polygon\b[^>]*\/>/gi,
  ];

  const elements = new Set();
  for (const pattern of drawablePatterns) {
    for (const match of normalized.matchAll(pattern)) {
      const cleaned = match[0]
        .replace(/\sid="[^"]*"/gi, "")
        .replace(/\sclip-path="[^"]*"/gi, "");
      elements.add(cleaned);
    }
  }

  if (elements.size) {
    const content = [...elements].join("");
    const hasStroke = /\bstroke=/.test(content);
    const strokeAttr = hasStroke ? ' stroke-width="1.5"' : "";
    const viewBox = normalized.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 14 14";
    return `<svg viewBox="${viewBox}" fill="none"${strokeAttr} xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
  }

  return normalized;
}

await mkdir(iconDir, { recursive: true });

for (const [name, url] of Object.entries(assets)) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${name}: ${res.status}`);
  const raw = await res.text();
  const svg = extractIconGlyph(raw);
  await writeFile(path.join(iconDir, `${name}.svg`), svg);
  console.log(`saved ${name}`);
}
