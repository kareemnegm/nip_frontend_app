import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const iconDir = path.join(root, "public/icons/figma/amenities");
const registryPath = path.join(root, "components/ui/amenity-icon-registry.ts");

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

const files = (await readdir(iconDir)).filter((f) => f.endsWith(".svg"));
const entries = [];

for (const file of files.sort()) {
  const name = file.replace(/\.svg$/, "");
  const svg = normalizeSvg(await readFile(path.join(iconDir, file), "utf8"));
  entries.push(`  ${JSON.stringify(name)}: ${JSON.stringify(svg)},`);
}

const content = `/** Auto-generated from public/icons/figma/amenities — do not edit by hand. */
export const amenityIconSvgs = {
${entries.join("\n")}
} as const;

export type AmenityIconName = keyof typeof amenityIconSvgs;
`;

await writeFile(registryPath, content);
console.log(`amenity registry → ${registryPath}`);
