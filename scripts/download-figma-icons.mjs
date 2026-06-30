import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const brandDir = path.join(root, "public/brand");
const iconDir = path.join(root, "public/icons/figma");
const registryPath = path.join(root, "components/ui/figma-icon-registry.ts");

const brandAssets = {
  "logo-dark": "https://www.figma.com/api/mcp/asset/56e38166-56b7-400c-b7c3-a75de8ffd578",
  "logo-light": "https://www.figma.com/api/mcp/asset/5868d7af-1a36-4868-bc73-2b6f97e4a0d5",
};

const iconAssets = {
  bed: "https://www.figma.com/api/mcp/asset/5ddb20c4-3441-46f5-b860-58b8e5c702d1",
  bath: "https://www.figma.com/api/mcp/asset/fc042256-f623-4247-a200-1b940f8b4d8e",
  area: "https://www.figma.com/api/mcp/asset/8283acfe-1748-40b6-aee7-0cbada3c9e70",
  building: "https://www.figma.com/api/mcp/asset/93b237f3-6cf2-4132-8550-dab38d064c35",
  chevronDown: "https://www.figma.com/api/mcp/asset/33db0344-c657-4882-8bbc-63f8a7c4eedc",
  arrowRight: "https://www.figma.com/api/mcp/asset/16b690b7-2962-420c-84ee-1ff566076b28",
  mapPin: "https://www.figma.com/api/mcp/asset/4570fbbc-f58b-46c8-89b2-0a60527ea56a",
  developer: "https://www.figma.com/api/mcp/asset/c667f17b-41d7-407f-a4a2-6237eed08f02",
  handover: "https://www.figma.com/api/mcp/asset/c7887938-0c8a-4b9e-ba4e-aa0a45a75833",
  sofa: "https://www.figma.com/api/mcp/asset/6ac544df-7db5-45d5-9d87-09fc0289ab85",
  reference: "https://www.figma.com/api/mcp/asset/c5f6729e-2d7c-4d5d-8286-b266abc581f2",
  crane: "https://www.figma.com/api/mcp/asset/b97a6872-066f-4b66-bc69-383443fff3da",
  percent: "https://www.figma.com/api/mcp/asset/0481c1e5-5363-4829-a232-ee198ff33219",
  grid: "https://www.figma.com/api/mcp/asset/3d4bd97b-41d3-4a99-982c-cd771369d81f",
  phone: "https://www.figma.com/api/mcp/asset/91ebe376-11e5-432f-8ad5-034b0c2364fe",
  mail: "https://www.figma.com/api/mcp/asset/cac9debe-82e8-4b96-bdda-8c69d2ca5b4c",
  globe: "https://www.figma.com/api/mcp/asset/f4101314-f99e-436b-b12b-756308f2bcf7",
  lock: "https://www.figma.com/api/mcp/asset/b2bae5d1-01a6-4486-a693-26139d8b6eb5",
  menu: "https://www.figma.com/api/mcp/asset/1f5e6efa-f4c1-4448-87c0-9ecd057aaed8",
  metro: "https://www.figma.com/api/mcp/asset/1b212c18-a790-43b3-89eb-36182086fd0b",
  instagram: "https://www.figma.com/api/mcp/asset/575396f6-0ed8-45a9-bf2e-78b120430d64",
  facebook: "https://www.figma.com/api/mcp/asset/def54899-0d89-4438-9773-cd2b56377121",
  linkedin: "https://www.figma.com/api/mcp/asset/c0855323-14ee-4d4e-8a1c-743fdc445563",
  youtube: "https://www.figma.com/api/mcp/asset/101a8976-33a2-416c-a68d-a49794208804",
  family: "https://www.figma.com/api/mcp/asset/185c3cee-6e4b-4cb4-b03a-f4c58f70ba0c",
  park: "https://www.figma.com/api/mcp/asset/e363b94d-98d8-4f4d-8fa8-d7cab9c6a9ba",
};

/** Currency glyphs (dirham/dollar/euro/pound) are committed under public/icons/figma — not fetched remotely. */

function normalizeSvg(svg) {
  return svg
    .replace(/<\?xml[^?]*\?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/#0[Bb]3268/gi, "currentColor")
    .replace(/#0[Ee]4286/gi, "currentColor")
    .replace(/#171[Ee]2[Dd]/gi, "currentColor")
    .replace(/#323[Ee]58/gi, "currentColor")
    .replace(/#7[Ee]8[Aa][Aa]4/gi, "currentColor")
    .replace(/fill="white"/gi, 'fill="currentColor"')
    .replace(/stroke="white"/gi, 'stroke="currentColor"')
    .trim();
}

/** Strip Figma artboard wrappers and keep the 24×24 icon glyph only. */
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
    /<rect\b[^>]*(?:fill|style)[^>]*\/>/gi,
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
    // If any element uses stroke= (not fill=), make the icon bold by setting stroke-width on the wrapper.
    const content = [...elements].join("");
    const hasStroke = /\bstroke=/.test(content);
    const strokeAttr = hasStroke ? ' stroke-width="1.5"' : "";
    return `<svg viewBox="0 0 24 24" fill="none"${strokeAttr} xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
  }

  return normalized;
}

function extractLogoSvg(svg, fill = "#0B3268") {
  const normalized = normalizeSvg(svg);
  const match = normalized.match(/<g id="Logo">([\s\S]*?)<\/g>\s*<\/g>/);
  if (match?.[1]) {
    const inner = match[1].replace(/currentColor/gi, fill);
    return `<svg viewBox="0 0 112 25" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  }
  return normalized;
}

async function downloadAssets(assets, targetDir, { extractGlyph = false, extractLogo = false } = {}) {
  await mkdir(targetDir, { recursive: true });
  for (const [name, url] of Object.entries(assets)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed ${name}: ${res.status}`);
    const raw = await res.text();
    const svg = extractLogo
      ? extractLogoSvg(raw, name === "logo-light" ? "#FFFFFF" : "#0B3268")
      : extractGlyph
        ? extractIconGlyph(raw)
        : normalizeSvg(raw);
    await writeFile(path.join(targetDir, `${name}.svg`), svg);
    console.log(`saved ${name}`);
  }
}

async function generateRegistry() {
  const files = (await readdir(iconDir)).filter((f) => f.endsWith(".svg"));
  const entries = [];

  for (const file of files.sort()) {
    const name = file.replace(/\.svg$/, "");
    if (name.endsWith("-raw")) continue;
    const svg = normalizeSvg(await readFile(path.join(iconDir, file), "utf8"));
    entries.push(`  ${JSON.stringify(name)}: ${JSON.stringify(svg)},`);
  }

  const aliases = [
    '  currency: "dirham",',
    '  user: "developer",',
    '  home: "building",',
    '  calendar: "handover",',
    '  chevronLeft: "arrowRight",',
    '  chevronRight: "arrowRight",',
  ];

  const content = `/** Auto-generated from public/icons/figma — do not edit by hand. */
export const figmaIconSvgs = {
${entries.join("\n")}
} as const;

export type FigmaIconName = keyof typeof figmaIconSvgs;

export const figmaIconAliases: Partial<Record<string, FigmaIconName>> = {
${aliases.join("\n")}
};
`;

  await writeFile(registryPath, content);
  console.log(`registry → ${registryPath}`);
}

await downloadAssets(brandAssets, brandDir, { extractLogo: true });
await downloadAssets(iconAssets, iconDir, { extractGlyph: true });
await generateRegistry();
