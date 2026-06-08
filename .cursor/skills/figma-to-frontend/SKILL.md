---
name: figma-to-frontend
description: Converts Figma designs into reusable React/Next.js components with Tailwind in nip_frontend_app. Extracts atoms (Button, Input), molecules (Card, FormField), and sections (Hero, Features), builds a shared component library under components/ui and components/sections, and composes pages from reused pieces. Use for Figma handoff, figma-to-code, design tokens, component extraction, or building UI from mockups.
---

# Figma to Frontend (NIP Reality)

**Jimmy owns implementation.** User is not a React developer — do not ask technical questions. Analyze Figma, decide component structure, build everything, run `npm run check`.

## Workflow overview

```
Figma frame → audit layers → extract tokens → build ui/ atoms → build sections → compose page → verify
```

Read [component-library.md](./component-library.md) for reuse rules. See [examples.md](./examples.md) for full walkthroughs.

## Step 1 — Audit the Figma frame

Before writing code, classify every layer:

| Tier | Figma signal | Code location | Reuse |
|------|--------------|---------------|-------|
| **Atom** | Button, badge, icon, input, label | `components/ui/` | All pages |
| **Molecule** | Card, nav item, testimonial row, form field group | `components/ui/` or `components/` | Multiple sections |
| **Section** | Hero, features grid, footer block, CTA band | `components/sections/` | One layout, many pages |
| **Page** | Full frame with header + sections + footer | `app/[route]/page.tsx` | Single route |

**Rule:** If a element appears twice in Figma (or likely will), extract to `components/ui/` first — never duplicate markup across sections.

## Step 2 — Extract design tokens

Add to `app/globals.css`:

```css
@theme inline {
  --color-brand: #...;        /* primary from Figma */
  --color-brand-muted: #...;
  --color-surface: #...;
  --font-display: var(--font-geist-sans);
  --radius-card: 12px;
}
```

Use token names in Tailwind: `bg-brand`, `text-brand-muted`, `rounded-[var(--radius-card)]`.

## Step 3 — Build atoms (components/ui/)

Create small, prop-driven components. **No page-specific copy hardcoded.**

```tsx
// components/ui/Button.tsx
import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors",
        variant === "primary" && "bg-brand text-white hover:opacity-90",
        variant === "secondary" && "border border-zinc-200 bg-white",
        size === "md" && "h-11 px-5 text-sm rounded-full",
        className,
      )}
      {...props}
    />
  );
}
```

Add `lib/cn.ts` (clsx + tailwind-merge) when building first ui component.

**Standard atoms to create from Figma:** `Button`, `Badge`, `Container`, `Heading`, `Text`, `Input`, `Icon` (wrapper).

## Step 4 — Build sections (components/sections/)

Sections **compose atoms** — they accept content via props or editable blocks:

```tsx
// components/sections/HeroSection.tsx
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type HeroSectionProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
};

export function HeroSection({ title, subtitle, ctaLabel, ctaHref }: HeroSectionProps) {
  return (
    <section className="py-20 bg-surface">
      <Container className="flex flex-col gap-6 max-w-3xl">
        <div className="text-4xl font-bold tracking-tight">{title}</div>
        {subtitle && <p className="text-lg text-zinc-600">{subtitle}</p>}
        {ctaLabel && ctaHref && (
          <Button asChild><a href={ctaHref}>{ctaLabel}</a></Button>
        )}
      </Container>
    </section>
  );
}
```

Export from `components/sections/index.ts` for clean imports.

## Step 5 — Compose the page

```tsx
// app/page.tsx
import { HeroSection } from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <HeroSection
        title="Welcome"
        subtitle="Placeholder until CMS blocks wired"
        ctaLabel="Get started"
        ctaHref="/contact"
      />
    </>
  );
}
```

For CMS-editable copy, pass `EditableText` as `title` prop — see `docs/EDITABLE-BLOCKS.md`.

## Step 6 — Figma inspect → Tailwind cheat sheet

| Figma | Tailwind |
|-------|----------|
| Auto layout horizontal + gap 16 | `flex gap-4` |
| Auto layout vertical + gap 24 | `flex flex-col gap-6` |
| Padding 32 | `p-8` |
| Fill container width | `w-full` |
| Hug contents | `w-fit` |
| Fixed 1440 frame | `max-w-7xl mx-auto px-6` |
| Drop shadow | `shadow-lg` |
| Corner radius 999 | `rounded-full` |

Mobile-first: base = mobile frame, `md:` = tablet, `lg:` = desktop.

## Reuse checklist (mandatory)

Before finishing any Figma task:

```
- [ ] No duplicated button/card/input markup — all in components/ui/
- [ ] Section used 2+ places? → components/sections/ with props
- [ ] Colors/spacing from @theme tokens, not random hex in 5 files
- [ ] components/sections/index.ts and components/ui/index.ts export public API
- [ ] npm run check passes
- [ ] Compared mobile + desktop to Figma
```

## When to use client components

| Need | Solution |
|------|----------|
| Static layout from Figma | Server Component section |
| Hover menu, carousel, modal | `"use client"` wrapper only |
| Form with validation | Client form + server action or API |

Keep sections as Server Components; wrap interactive leaf in client child.

## Figma MCP / screenshot handoff

When user attaches Figma link or screenshot:

1. List visible sections top-to-bottom
2. Identify reusable atoms before coding
3. Propose file list: `components/ui/X.tsx`, `components/sections/Y.tsx`, `app/Z/page.tsx`
4. Implement atoms first, then sections, then page

## Related skills

- `react-patterns` — props API, composition, hooks
- `nip-architecture` — API data, editable blocks
- `nextjs-app-router` — page routing, SSR

## Docs

- `docs/JIMMY-WORKFLOW.md`
- `docs/EDITABLE-BLOCKS.md`
