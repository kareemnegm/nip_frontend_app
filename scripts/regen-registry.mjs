import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const iconDir = path.join(root, "public/icons/figma");
const registryPath = path.join(root, "components/ui/figma-icon-registry.ts");

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
    .replace(/stroke="var\(--stroke-0,\s*currentColor\)"/gi, 'stroke="currentColor"')
    .trim();
}

// Icons that are drawn with strokes — inject stroke-width="1.5" so they render bold
const strokeIcons = new Set([
  "area", "arrowRight", "bath", "bed", "building", "chevronDown",
  "crane", "developer", "dirham", "dirham-circle", "family", "floorplan", "grid", "handover",
  "lock", "menu", "metro", "mortgage", "park", "percent", "reference", "sofa",
]);

function patchStrokeWidth(svg, name) {
  if (!strokeIcons.has(name)) return svg;
  if (svg.includes("stroke-width")) return svg;
  return svg.replace("<svg ", '<svg stroke-width="1.5" ');
}

const files = (await readdir(iconDir)).filter((f) => f.endsWith(".svg"));
const entries = [];

for (const file of files.sort()) {
  const name = file.replace(/\.svg$/, "");
  if (name.endsWith("-raw")) continue;
  let svg = normalizeSvg(await readFile(path.join(iconDir, file), "utf8"));
  svg = patchStrokeWidth(svg, name);
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
console.log("registry updated with bold stroke-width");
