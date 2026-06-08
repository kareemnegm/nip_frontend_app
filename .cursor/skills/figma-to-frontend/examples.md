# Figma to Code — Examples

## Example 1: Hero from Figma

**Figma layers:** Frame "Hero" → Heading, Subtext, Button "Get Started", background image

**Files created:**

```
components/ui/Container.tsx
components/ui/Button.tsx
components/sections/HeroSection.tsx
app/page.tsx
```

**Page composition:**

```tsx
import { HeroSection } from "@/components/sections";

export default function HomePage() {
  return (
    <HeroSection
      title="NIP Reality"
      subtitle="Innovation platform"
      ctaLabel="Get started"
      ctaHref="/signup"
    />
  );
}
```

---

## Example 2: Feature grid (reused on Home + About)

**Figma:** 3-column card grid, same card component × 3

**Files:**

```
components/ui/Card.tsx
components/ui/FeatureIcon.tsx
components/sections/FeaturesSection.tsx
```

**FeaturesSection accepts data:**

```tsx
type Feature = { icon: string; title: string; description: string };

export function FeaturesSection({ features }: { features: Feature[] }) {
  return (
    <section className="py-16">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <Card key={f.title}>
            <FeatureIcon name={f.icon} />
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-zinc-600">{f.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

Used on both `/` and `/about` with different `features` arrays.

---

## Example 3: CMS-editable hero (future)

When backend blocks API is live:

```tsx
import { EditableText } from "@/components/EditableText";
import { HeroSection } from "@/components/sections";

const relUrl = "/";

export default function HomePage() {
  return (
    <HeroSection
      title={
        <EditableText
          relUrl={relUrl}
          blockKey="hero-title"
          placeholderContent="NIP Reality"
          placeholderTag="h1"
        />
      }
      subtitle={
        <EditableText
          relUrl={relUrl}
          blockKey="hero-subtitle"
          placeholderContent="Innovation platform"
          placeholderTag="p"
        />
      }
    />
  );
}
```

Section stays reusable — only content source changes.

---

## Example 4: Prompt to use in Cursor chat

```
Use figma-to-frontend skill.

Attached: Figma screenshot for Home page.
Extract reusable Button and Card to components/ui/.
Build HeroSection and FeaturesSection in components/sections/.
Compose app/page.tsx. Tailwind only. npm run check when done.
```
