import fs from "node:fs";
import path from "node:path";

const scale = 1.5;

function scalePath(d) {
  return d.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, (n) => {
    const value = Number(n);
    if (Number.isNaN(value)) return n;
    const scaled = value * scale;
    return Number.isInteger(value)
      ? String(scaled)
      : String(Number(scaled.toFixed(4)));
  });
}

function scaleSvg(name) {
  const file = path.join("public/icons/figma", `${name}.svg`);
  const svg = fs.readFileSync(file, "utf8");
  const paths = [...svg.matchAll(/<path\s+([^>]*?)d="([^"]+)"([^>]*?)>/g)].map(
    (match) => {
      const attrs = `${match[1]} ${match[3]}`
        .replace(/\s+/g, " ")
        .replace(/stroke="currentColor"/g, "")
        .replace(/stroke-width="[^"]*"/g, "")
        .replace(/\s*\/?$/, "")
        .trim();
      const attrSuffix = attrs ? ` ${attrs}` : "";
      return `<path d="${scalePath(match[2])}" stroke="currentColor" stroke-width="1.5"${attrSuffix}/>`;
    },
  );
  return `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">${paths.join("")}</svg>`;
}

const bed = `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.72871 17.8114H30.2714C30.9951 17.8114 31.6891 18.1464 32.2008 18.7426C32.7125 19.3388 33 20.1475 33 20.9907V27.3493H3.00015V21.024C2.99637 20.6037 3.06416 20.1867 3.19959 19.7971C3.33502 19.4075 3.53541 19.0531 3.78915 18.7543C4.0429 18.4556 4.34497 18.2184 4.67789 18.0566C5.01081 17.8947 5.36797 17.8114 5.72871 17.8114Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/><path d="M7.08598 5.14288H28.9144C29.2728 5.14288 29.6276 5.22512 29.9586 5.38489C30.2897 5.54467 30.5905 5.77885 30.8438 6.07408C31.0972 6.36931 31.2982 6.71979 31.4353 7.10552C31.5724 7.49126 31.643 7.90468 31.643 8.32219V17.8102H4.35742V8.32219C4.35742 7.47899 4.64489 6.67032 5.1566 6.07408C5.6683 5.47784 6.36232 5.14288 7.08598 5.14288Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/><path d="M11.1861 11.4842H15.2718C15.9954 11.4842 16.6894 11.8192 17.2012 12.4154C17.7129 13.0116 18.0003 13.8203 18.0003 14.6635V17.8095H8.45752V14.6635C8.45752 13.8203 8.74499 13.0116 9.2567 12.4154C9.7684 11.8192 10.4624 11.4842 11.1861 11.4842Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/><path d="M20.7286 11.4842H24.8143C25.5379 11.4842 26.2319 11.8192 26.7436 12.4154C27.2553 13.0116 27.5428 13.8203 27.5428 14.6635V17.8095H18V14.6635C18 13.8203 18.2875 13.0116 18.7992 12.4154C19.3109 11.8192 20.0049 11.4842 20.7286 11.4842Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/><path d="M4.35742 32.143V27.3823" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/><path d="M31.6426 32.143V27.3823" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/></svg>`;

const icons = ["bath", "area", "building", "sofa", "reference"];
const entries = [`  bed: ${JSON.stringify(bed)},`];
for (const name of icons) {
  entries.push(`  ${name}: ${JSON.stringify(scaleSvg(name))},`);
}

const output = `/** Figma property detail facts strip — 36×36 / stroke 1.5 / #0E4286 via currentColor */\nexport const propertyFactIconSvgs = {\n${entries.join("\n")}\n} as const;\n\nexport type PropertyFactIconName = keyof typeof propertyFactIconSvgs;\n`;

fs.writeFileSync("components/ui/property-fact-icons.ts", output);
console.log("Wrote components/ui/property-fact-icons.ts");
