/**
 * Fails if app/components TSX use banned typography/color patterns.
 * Files listed in design-token-allowlist.txt are temporarily exempt (debt until refix).
 *
 * See: .cursor/design-system/forbidden.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SCAN_DIRS = ["app", "components"];
const EXTENSIONS = new Set([".tsx", ".ts", ".jsx", ".js"]);

const BANNED = [
  {
    id: "tailwind-default-text",
    re: /\btext-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/,
    hint: "Use text-{token} from .cursor/design-system/typography-map.md",
  },
  {
    id: "raw-text-px",
    re: /\btext-\[[0-9.]+(?:px|rem|em)\]/,
    hint: "Use a typography token instead of text-[Npx]",
  },
  {
    id: "hex-color",
    re: /#[0-9a-fA-F]{3,8}\b/,
    hint: "Use a color token from .cursor/design-system/colors.md (hex only in globals.css)",
  },
];

const IGNORE_FILE_PARTS = [
  `${path.sep}node_modules${path.sep}`,
  `${path.sep}.next${path.sep}`,
  `${path.sep}scripts${path.sep}`,
];

function loadAllowlist() {
  const file = path.join(root, "scripts", "design-token-allowlist.txt");
  if (!fs.existsSync(file)) return new Set();
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const set = new Set();
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    set.add(t.replace(/\\/g, "/"));
  }
  return set;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (IGNORE_FILE_PARTS.some((p) => full.includes(p))) continue;
    if (name.isDirectory()) walk(full, out);
    else if (EXTENSIONS.has(path.extname(name.name))) out.push(full);
  }
  return out;
}

function relPosix(abs) {
  return path.relative(root, abs).replace(/\\/g, "/");
}

function main() {
  const allow = loadAllowlist();
  const files = SCAN_DIRS.flatMap((d) => walk(path.join(root, d)));
  const violations = [];

  for (const file of files) {
    const rel = relPosix(file);
    if (allow.has(rel)) continue;
    // Skip CSS-in-JS free: only scan likely UI sources; skip pure types if needed
    if (rel.endsWith(".d.ts")) continue;

    const text = fs.readFileSync(file, "utf8");
    // Strip block comments so JSDoc hex notes do not fail the gate
    const withoutBlocks = text.replace(/\/\*[\s\S]*?\*\//g, (block) =>
      block.replace(/[^\n]/g, " "),
    );
    const lines = withoutBlocks.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (/^\s*import\s/.test(line)) continue;
      // Strip line comments
      line = line.replace(/\/\/.*$/, "");
      if (!line.trim()) continue;

      for (const rule of BANNED) {
        if (rule.re.test(line)) {
          violations.push({
            file: rel,
            line: i + 1,
            id: rule.id,
            hint: rule.hint,
            sample: lines[i].trim().slice(0, 120),
          });
        }
      }
    }
  }

  if (violations.length === 0) {
    console.log("check-design-tokens: OK");
    process.exit(0);
  }

  console.error(`check-design-tokens: ${violations.length} violation(s)\n`);
  console.error("See .cursor/design-system/forbidden.md\n");
  for (const v of violations.slice(0, 80)) {
    console.error(`${v.file}:${v.line}  [${v.id}]  ${v.sample}`);
    console.error(`  → ${v.hint}`);
  }
  if (violations.length > 80) {
    console.error(`\n… and ${violations.length - 80} more`);
  }
  console.error(
    "\nIf this is legacy debt during a page refix, temporarily list the file in scripts/design-token-allowlist.txt — then remove it when the page passes FIGMA-AUDIT.",
  );
  process.exit(1);
}

main();
