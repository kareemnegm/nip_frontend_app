#!/usr/bin/env node
/**
 * Pull typography + color styles from Figma REST API.
 * Requires FIGMA_ACCESS_TOKEN (+ optional FIGMA_FILE_KEY) in .env.local
 *
 * Usage: npm run figma:sync-tokens
 * Output: docs/figma-tokens-sync.json (report — review before editing globals.css)
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const envPath = path.join(root, ".env.local");
const outDir = path.join(root, "docs");
const outFile = path.join(outDir, "figma-tokens-sync.json");

const DEFAULT_FILE_KEY = "7X3YcUQj70rvhvLx4pwD9h";

async function loadEnv(file) {
  try {
    const raw = await readFile(file, "utf8");
    const env = {};
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
    return env;
  } catch {
    return {};
  }
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function rgbToHex(r, g, b) {
  const h = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

function pxToRem(px) {
  return `${+(px / 16).toFixed(4).replace(/\.?0+$/, "") || 0}rem`.replace(
    /^0rem$/,
    "0",
  );
}

function letterSpacingToEm(value, fontSize) {
  if (value == null || fontSize == null || fontSize === 0) return undefined;
  // Figma API returns px; percent in UI is often stored as px delta
  const em = value / fontSize;
  if (Math.abs(em) < 0.0001) return "0";
  return `${+em.toFixed(4)}em`;
}

function findNodeById(node, id) {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

async function figmaGet(token, apiPath) {
  const res = await fetch(`https://api.figma.com/v1${apiPath}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status} for ${apiPath}: ${body}`);
  }
  return res.json();
}

function parseTextStyle(node) {
  const s = node.style ?? {};
  return {
    fontFamily: s.fontFamily ?? null,
    fontSize: s.fontSize ?? null,
    fontWeight: s.fontWeight ?? null,
    lineHeightPx: s.lineHeightPx ?? null,
    letterSpacing: s.letterSpacing ?? null,
    textCase: s.textCase ?? null,
    css: {
      fontSize: s.fontSize != null ? pxToRem(s.fontSize) : null,
      lineHeight: s.lineHeightPx != null ? pxToRem(s.lineHeightPx) : null,
      letterSpacing: letterSpacingToEm(s.letterSpacing, s.fontSize),
      fontWeight: s.fontWeight ?? null,
      textTransform:
        s.textCase === "UPPER" ? "uppercase" : s.textCase === "LOWER" ? "lowercase" : null,
    },
  };
}

function parseFillStyle(node) {
  const fill = node.fills?.find((f) => f.type === "SOLID" && f.visible !== false);
  if (!fill?.color) return null;
  const { r, g, b, a = 1 } = fill.color;
  const hex = rgbToHex(r, g, b);
  return a < 1 ? `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)} / ${a})` : hex;
}

async function main() {
  const env = await loadEnv(envPath);
  const token = env.FIGMA_ACCESS_TOKEN;
  const fileKey = env.FIGMA_FILE_KEY || DEFAULT_FILE_KEY;

  if (!token) {
    console.error(
      "Missing FIGMA_ACCESS_TOKEN in .env.local\n" +
        "Add: FIGMA_ACCESS_TOKEN=figd_...\n" +
        "Optional: FIGMA_FILE_KEY=7X3YcUQj70rvhvLx4pwD9h",
    );
    process.exit(1);
  }

  console.log(`Fetching Figma file ${fileKey}...`);

  const file = await figmaGet(token, `/files/${fileKey}?depth=1`);
  const stylesMeta = file.styles ?? {};
  const styleEntries = Object.entries(stylesMeta);

  /** @type {Record<string, unknown>} */
  let variablesReport = { collections: [], variables: [] };
  try {
    const varsRes = await figmaGet(token, `/files/${fileKey}/variables/local`);
    const meta = varsRes.meta ?? {};
    const collections = Object.values(meta.variableCollections ?? {});
    const variables = Object.values(meta.variables ?? {}).map((v) => {
      const collection = meta.variableCollections?.[v.variableCollectionId];
      const modeId = Object.keys(v.valuesByMode ?? {})[0];
      return {
        name: v.name,
        tokenName: normalizeName(v.name),
        collection: collection?.name ?? "unknown",
        type: v.resolvedType,
        value: v.valuesByMode?.[modeId],
      };
    });
    variablesReport = { collections: collections.map((c) => c.name), variables };
  } catch (err) {
    variablesReport = {
      error: err.message,
      hint: "Variables API may need file_variables:read scope on your token",
    };
  }

  if (styleEntries.length === 0) {
    console.warn("No published styles found in this file (using variables if available).");
  }

  const nodeIds = styleEntries.map(([id]) => id).join(",");
  let styleNodes = {};

  if (nodeIds) {
    const nodesRes = await figmaGet(token, `/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeIds)}`);
    styleNodes = nodesRes.nodes ?? {};
  }

  const typography = [];
  const colors = [];
  const effects = [];

  for (const [nodeId, meta] of styleEntries) {
    const node = styleNodes[nodeId]?.document ?? findNodeById(file.document, nodeId);
    const entry = {
      figmaName: meta.name,
      tokenName: normalizeName(meta.name),
      styleType: meta.styleType,
      nodeId,
    };

    if (meta.styleType === "TEXT" && node) {
      typography.push({ ...entry, ...parseTextStyle(node) });
    } else if (meta.styleType === "FILL" && node) {
      const hex = parseFillStyle(node);
      if (hex) colors.push({ ...entry, value: hex });
    } else if (meta.styleType === "EFFECT" && node) {
      effects.push({ ...entry, effects: node.effects ?? [] });
    }
  }

  typography.sort((a, b) => a.figmaName.localeCompare(b.figmaName));
  colors.sort((a, b) => a.figmaName.localeCompare(b.figmaName));

  const tailwindTypography = typography.map((t) => {
    const base = `--text-${t.tokenName}`;
    const lines = [`  ${base}: ${t.css.fontSize};`];
    if (t.css.lineHeight) lines.push(`  ${base}--line-height: ${t.css.lineHeight};`);
    if (t.css.letterSpacing) lines.push(`  ${base}--letter-spacing: ${t.css.letterSpacing};`);
    return { figmaName: t.figmaName, tokenName: t.tokenName, tailwindBlock: lines.join("\n") };
  });

  const report = {
    syncedAt: new Date().toISOString(),
    fileKey,
    fileName: file.name,
    summary: {
      typography: typography.length,
      colors: colors.length,
      effects: effects.length,
      variables:
        Array.isArray(variablesReport.variables) ? variablesReport.variables.length : 0,
    },
    typography,
    colors,
    effects,
    variables: variablesReport,
    tailwindTypography,
    nextSteps: [
      "Compare typography px values with docs/FIGMA-AUDIT.md and .cursor/skills/figma-to-react-components/nip-typography-map.md",
      "Update app/globals.css @theme tokens if Figma changed",
      "Map Figma style names to Heading/Text variants in components/ui/",
      "Run npm run check after any globals.css edits",
    ],
  };

  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`\n✓ Connected to Figma: "${file.name}"`);
  console.log(`  Typography styles: ${typography.length}`);
  console.log(`  Color styles:      ${colors.length}`);
  if (Array.isArray(variablesReport.variables)) {
    console.log(`  Variables:         ${variablesReport.variables.length}`);
  } else if (variablesReport.error) {
    console.log(`  Variables:         skipped (${variablesReport.hint ?? "see report"})`);
  }
  console.log(`  Report written:    docs/figma-tokens-sync.json`);

  if (typography.length > 0) {
    console.log("\nSample typography from Figma:");
    for (const t of typography.slice(0, 8)) {
      console.log(
        `  • ${t.figmaName}: ${t.fontFamily} ${t.fontSize}px / ${t.lineHeightPx}px / w${t.fontWeight}`,
      );
    }
    if (typography.length > 8) console.log(`  … and ${typography.length - 8} more`);
  }

  console.log("\nNext: Jimmy compares this report to globals.css and updates tokens if needed.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
