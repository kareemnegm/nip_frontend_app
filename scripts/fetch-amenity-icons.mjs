import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const iconDir = path.join(root, "public/icons/figma/amenities");

const assets = {
  bbq: "https://www.figma.com/api/mcp/asset/a783fa18-aab5-43c5-91be-fe1afa6de6c1",
  fitness: "https://www.figma.com/api/mcp/asset/d8a66dea-31b1-4de6-b99b-af7786efb5c2",
  kids: "https://www.figma.com/api/mcp/asset/5521ad11-bf77-4d7b-bc4d-818fbba81ad9",
  cycling: "https://www.figma.com/api/mcp/asset/47a121c6-63e9-4735-b86c-8da70645073a",
  yoga: "https://www.figma.com/api/mcp/asset/ed3cd0f6-ebac-40c2-9ad4-36e49c47578d",
  "smart-home": "https://www.figma.com/api/mcp/asset/fa4c56bf-427d-4dc6-b474-fc8e7169ac39",
  flower: "https://www.figma.com/api/mcp/asset/8e1152cd-5e87-49e4-a5dc-b3651ee4336e",
  basketball: "https://www.figma.com/api/mcp/asset/b26f6cc4-33b8-4eb0-a6de-6f2f02b5c3bc",
  beach: "https://www.figma.com/api/mcp/asset/49faf88b-65a2-4e7c-8bc0-98853a342d07",
  spa: "https://www.figma.com/api/mcp/asset/dec7d909-5bb3-4082-9091-36520d8ffcc4",
  valet: "https://www.figma.com/api/mcp/asset/d82c862d-0c7a-4f80-a9b2-15fa3999a27a",
  lounge: "https://www.figma.com/api/mcp/asset/f525b466-7477-4d54-a5f7-e0e3e21f4fb5",
  concierge: "https://www.figma.com/api/mcp/asset/0fe91e95-e0f9-4ceb-9683-729768a45137",
  pool: "https://www.figma.com/api/mcp/asset/4b2c7660-788c-405c-b0f8-d6db2f3a5a2a",
  sea: "https://www.figma.com/api/mcp/asset/a7b16da0-abe8-4168-8245-5b39eccf5041",
  dinner: "https://www.figma.com/api/mcp/asset/aa9395bf-91d5-405a-b32f-f33be3ca0dc2",
  star: "https://www.figma.com/api/mcp/asset/d772f355-fe0c-4a24-b2c3-b215ea8141af",
  "branded-location": "https://www.figma.com/api/mcp/asset/5124a3d8-12f4-4f41-8adb-9168e37def20",
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
    .replace(/fill="white"/gi, 'fill="currentColor"')
    .replace(/stroke="white"/gi, 'stroke="currentColor"')
    .replace(/stroke="var\(--stroke-0,\s*currentColor\)"/gi, 'stroke="currentColor"')
    .trim();
}

function extractIconGlyph(svg) {
  const normalized = normalizeSvg(svg);
  const drawablePatterns = [
    /<path\b[^>]*\/>/gi,
    /<path\b[^>]*>[\s\S]*?<\/path>/gi,
    /<circle\b[^>]*\/>/gi,
    /<line\b[^>]*\/>/gi,
    /<polyline\b[^>]*\/>/gi,
    /<polygon\b[^>]*\/>/gi,
  ];

  const elements = new Set();
  const withoutBackgroundRects = normalized.replace(
    /<rect\b[^>]*(?:fill="white"|fill="#fff")[^>]*\/>/gi,
    "",
  );

  for (const pattern of drawablePatterns) {
    for (const match of withoutBackgroundRects.matchAll(pattern)) {
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
    const viewBox = normalized.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 24 24";
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
