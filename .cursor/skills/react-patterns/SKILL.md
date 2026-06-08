---
name: react-patterns
description: React 19 reusable component patterns for nip_frontend_app — props API design, composition, ui/ design system, section components, hooks, Tailwind variants, and barrel exports. Use when building React components, refactoring for reuse, creating components/ui atoms, or extending the component library from Figma.
---

# React Patterns (nip_frontend_app)

## Component tiers

| Tier | Path | Server/Client |
|------|------|---------------|
| Atoms | `components/ui/` | Server by default |
| Sections | `components/sections/` | Server by default |
| Shell | `components/Header.tsx` | Client if menu toggles |
| Hooks | `components/use*.ts` | Client only |

See `figma-to-frontend/component-library.md` for reuse rules.

## Reusable component template

```tsx
import { cn } from "@/lib/cn";

export type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "md" | "lg";
};

const paddingMap = {
  none: "",
  md: "p-6",
  lg: "p-8",
} as const;

export function Card({ children, className, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white",
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
```

**Export types** (`CardProps`) so sections can extend them.

## Composition pattern

```tsx
// Section composes ui — no raw duplicate markup
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

export function StatsSection({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <Container>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-zinc-500">{s.label}</p>
          </Card>
        ))}
      </div>
    </Container>
  );
}
```

## Server vs client split

```tsx
// components/sections/FAQSection.tsx — Server
import { FAQAccordion } from "@/components/FAQAccordion"; // client child

export function FAQSection({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="py-16">
      <FAQAccordion items={items} />
    </section>
  );
}
```

Push `"use client"` to the smallest leaf (accordion), not the whole section.

## Props conventions

- `children: React.ReactNode` for flexible content (text, EditableText, icons)
- `className?: string` on every layout component — pass through with `cn()`
- Variants as string unions, not booleans per style
- Data arrays for lists — map in component, don't hardcode 3 copies

## Barrel exports

`components/ui/index.ts`:

```tsx
export { Button } from "./Button";
export type { ButtonProps } from "./Button";
```

## Hooks

```tsx
"use client";

import { useState, useCallback } from "react";

export function useDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  return { isOpen, open, close, toggle };
}
```

## Anti-patterns

| Avoid | Do instead |
|-------|------------|
| Copy-paste button markup | `components/ui/Button` |
| Page-specific component names | Generic section + props |
| Fetch in client component | Fetch in page (server), pass props |
| 200-line page.tsx | Compose sections |

## With Figma skill

When building from Figma, always pair with `figma-to-frontend` skill:
1. Atoms first → `components/ui/`
2. Sections second → `components/sections/`
3. Page last → compose imports

## Quality

```bash
npm run check
```
