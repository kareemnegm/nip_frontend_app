import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "public", "brand", "logo-small.png");
const pngTarget = path.join(root, "public", "brand", "logo-small.png");
const faviconPng = path.join(root, "public", "favicon.png");
const faviconIco = path.join(root, "public", "favicon.ico");
const appIcon = path.join(root, "app", "icon.png");
const tempPng = path.join(root, "public", "brand", "logo-small.tmp.png");

const normalizedPng = await sharp(source)
  .resize(512, 512, { fit: "cover" })
  .png()
  .toBuffer();

fs.writeFileSync(tempPng, normalizedPng);
fs.renameSync(tempPng, pngTarget);
fs.writeFileSync(faviconPng, normalizedPng);
fs.writeFileSync(appIcon, normalizedPng);

const icoSizes = [16, 32, 48];
const icoPngs = await Promise.all(
  icoSizes.map((size) => sharp(normalizedPng).resize(size, size).png().toBuffer()),
);
const ico = await toIco(icoPngs);
fs.writeFileSync(faviconIco, ico);

console.log(`Normalized PNG: ${pngTarget} (${normalizedPng.length} bytes)`);
console.log(`Wrote ICO: ${faviconIco} (${ico.length} bytes)`);
