# Component Library — Reuse Rules

## Directory layout

```
components/
├── ui/                    # Atoms + molecules — design system
│   ├── Button.tsx
│   ├── Container.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Heading.tsx
│   └── index.ts           # barrel export
├── sections/              # Page sections — compose ui/
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   ├── CTASection.tsx
│   └── index.ts
├── Header.tsx             # App shell (shared across pages)
├── Footer.tsx
└── useIsAdmin.ts
```

## Naming

| Type | Pattern | Example |
|------|---------|---------|
| Atom | noun, PascalCase | `Button`, `Input` |
| Section | `[Purpose]Section` | `HeroSection`, `PricingSection` |
| Variant prop | lowercase union | `variant="primary"` |
| Boolean prop | `is`/`has` prefix | `isDisabled`, `hasIcon` |

## Props API design

**Good — flexible reuse:**

```tsx
type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
};
```

**Bad — page-specific, not reusable:**

```tsx
type CardProps = {
  homePageFeatureTitle: string;  // ❌ tied to one page
};
```

Use `children` or `React.ReactNode` props for titles/copy so the same section works on every page.

## Composition over duplication

```tsx
// ✅ Reuse
<Card><FeatureIcon name="shield" /><Text>{description}</Text></Card>

// ❌ Copy-paste three card layouts with different class strings
```

## Barrel exports

`components/ui/index.ts`:

```tsx
export { Button } from "./Button";
export { Container } from "./Container";
export { Card } from "./Card";
```

Import: `import { Button, Container } from "@/components/ui";`

## cn() helper

Create once in `lib/cn.ts`:

```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Install when first needed: `npm install clsx tailwind-merge`

## Variant patterns

Use `cn()` + variant maps — avoid string concatenation:

```tsx
const variants = {
  primary: "bg-brand text-white",
  ghost: "bg-transparent hover:bg-zinc-100",
} as const;
```

## Figma component ↔ code mapping

| Figma | Code |
|-------|------|
| Component set "Button" with variants | Single `Button.tsx` + `variant` prop |
| Component "Card/Default" | `Card.tsx` |
| Instance override (text) | Prop or `children` |
| Auto layout frame named "Section/Hero" | `HeroSection.tsx` |

## When to split a new component

Extract when **any** is true:

- Same visual appears 2+ times
- Figma has a component/master for it
- Element has variants (size, color, state)
- Section might appear on another page later
