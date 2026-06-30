# Figma Design Audit

Living checklist for matching the live site to [NIP Website](https://www.figma.com/design/7X3YcUQj70rvhvLx4pwD9h/NIP-Website) (file `7X3YcUQj70rvhvLx4pwD9h`).

---

## Design QA Checklist (required before any section/page is marked pass)

Every section must pass **all applicable** items. Mark N/A for states not shown in Figma.

| # | Check | What to verify (Figma Dev Mode vs browser) |
|---|-------|---------------------------------------------|
| 1 | **Header height** | Fixed nav bar height matches frame (incl. padding) |
| 2 | **Container width** | `siteMaxWidth` / max-w matches Figma content column |
| 3 | **Grid alignment** | Columns, card grids, flex rows align to same edges as Figma |
| 4 | **Padding** | Section vertical + horizontal padding (py, px, gap) |
| 5 | **Margins** | Space between sections and between blocks inside a section |
| 6 | **Typography — font** | Didot for display titles; Archivo for body/UI everywhere else |
| 7 | **Typography — weight** | 400 / 500 / 600 / 700 matches each text layer |
| 8 | **Typography — size** | Exact px per layer (or token) |
| 9 | **Typography — line height** | Exact leading per layer |
| 10 | **Typography — letter spacing** | tracking / letter-spacing per layer (section titles: -0.88px at 44px = -0.02em) |
| 10a | **Typography — text align** | Check Figma `text-align` per layer: section headings = `center`; body copy = `center` (sections) or `left` (cards/articles); hero = `left`; footer = `left` |
| 11 | **Text colors** | Every text layer hex matches token: headings = `text-brand` (#0b3268), body = `text-ink-secondary` (#323e58), labels dark bg = `text-white`, accent labels = `text-accent` (#3778ce), muted meta = `text-platinum-400` (#aeb6c2), on-dark body = `text-accent-on-dark` (#8fb0dc), overlines on dark = `text-sapphire-200` (#a8bfdf) |
| 12 | **Background colors** | Section/card backgrounds match Figma: white, `sapphire-50` (#eef3fa), `sapphire-800` (#071e40) for dark sections; card backgrounds and card border = `border-line` (#d9deea) |
| 13 | **Border radius** | Cards, buttons, inputs use `--radius-card` (8px) / `--radius-field` (4px) |
| 14 | **Shadows** | `shadow-card` (`0 2px 4px rgba(18,51,94,0.06)`) on property/insight cards |
| 15 | **Hover states** | Nav links, buttons, cards where Figma defines hover |
| 16 | **Disabled states** | Form controls, buttons where applicable |
| 17 | **Loading states** | Skeletons/spinners where page has async content |
| 18 | **Background images** | Hero and section background images load; placeholder image shown when CMS not populated |
| 19 | **Responsive** | Section at **390px**, **768px**, **1280px** vs Figma frames |

**Gate rule:** A section is not `pass` until all applicable rows are ticked. A page is not `pass` until every section is `pass`.

---

## Page Summary

| Route | Figma page node | Sections | Status |
|-------|-----------------|----------|--------|
| `/en` | `1525:28264` | 10 (0–9) | ✅ pass |
| `/en/properties` | TBD | TBD | pending |
| `/en/off-plan` | TBD | TBD | pending |
| `/en/areas` | TBD | TBD | pending |
| `/en/developers` | TBD | TBD | pending |
| `/en/insights` | TBD | TBD | pending |
| `/en/about` | TBD | TBD | pending |
| `/en/contact` | TBD | TBD | pending |
| `/en/curated` | TBD | TBD | pending |
| `/en/concierge` | TBD | TBD | pending |
| `/en/private-office` | TBD | TBD | pending |
| `/en/faq` | TBD | TBD | pending |
| `/en/legal` | TBD | TBD | pending |

---

## Home — `/en`

**Figma frame:** [T02 · Home](https://www.figma.com/design/7X3YcUQj70rvhvLx4pwD9h/NIP-Website?node-id=1525-28264) (`1525:28264`)

**Preview:** http://localhost:3000/en

### Phase 1 — Design system fixes applied

| Fix | Detail | Status |
|-----|--------|--------|
| `--font-display` | Changed from `var(--font-archivo)` to `Didot, "Bodoni 72", var(--font-cormorant), serif` | ✅ done |
| `@theme` tokens | Full typography scale added: display-hero, display-hero-sm, display-lg, display-sm, stat-value, body-regular, body-xs, label-semibold, etc. | ✅ done |
| `SectionHeading.tsx` | Rewritten to use `text-display-sm` (36px) mobile + `sm:text-display-lg` (44px) tokens; desc uses `text-body-regular` | ✅ done |
| `HomeHeroSection.tsx` | `flex flex-col gap-9` container; `text-display-hero` token for title; `text-overline` eyebrow; `text-body-sm` body | ✅ done |
| `PrivateOfficeSection.tsx` | `font-display text-display-lg` title; `text-body-sm text-accent-on-dark` body; gap-10, py-16 sm:py-20 | ✅ done |
| `MarketPulseSection.tsx` | `text-stat-value font-bold` for 36px stat value; per-card context colors (sapphire-100/200); `text-overline font-semibold` label | ✅ done |
| Header height | Changed `py-6` to `h-[82px]` (Figma: 82px) | ✅ done |
| Button text | lg/md size updated to `text-[13px] leading-[18px]` (was text-xs/leading-4) | ✅ done |

### Section audit

| Sec | Section | Figma node | React file | Figma specs (desktop) | QA notes | Status |
|-----|---------|------------|------------|----------------------|----------|--------|
| 0 | Header | `1525:41735` | `Header.tsx` | h=82px, bg white | h-[82px]; text-ink nav links; border-line bottom | ✅ pass |
| 1 | Hero | `1525:28266` | `HomeHeroSection.tsx` | py=200(lg) gap=36; bg aerial photo + gradient overlay; eyebrow sapphire-200 12/600; title white Didot 64/72; body white 13/18 | `/images/hero-bg.jpg` placeholder; dark gradient overlay; text-sapphire-200 eyebrow; text-white title+body; text-overline/display-hero/body-sm tokens | ✅ pass |
| 2 | Search | `1525:28273` | `HomeSearchSection.tsx` | bg sapphire-50 (#eef3fa); label tertiary uppercase | bg-sapphire-50; text-ink-tertiary label | ✅ pass |
| 3 | Featured insights | `1525:28276` | `FeaturedInsightSection.tsx` | bg white; title brand 44/42; desc secondary 15/22 max-w=400; card: cat accent, title brand 20/700, body secondary 13/18, meta platinum-400 11/500 | SectionHeading text-brand/text-ink-secondary; card cardTypography: text-accent category, text-brand title, text-ink-secondary body, text-platinum-400 meta | ✅ pass |
| 4 | Curated collection | `1525:28286` | `CuratedCollectionSection.tsx` | bg sapphire-50; title brand 44/42; desc secondary 15/22 | SectionHeading tokens; bg-sapphire-50 section | ✅ pass |
| 5 | Market pulse | `1525:28295` | `MarketPulseSection.tsx` | bg white; title brand 44/42; desc secondary 15/22; cards sapphire-400→700; context sapphire-100/200; value white 36/700; label white 12/600 | text-stat-value font-bold white; per-card context text-sapphire-100/200; text-overline font-semibold white labels | ✅ pass |
| 6 | Private office | `1525:28320` | `PrivateOfficeSection.tsx` | bg sapphire-800 (#071e40); title white Didot 44/42; body accent-on-dark (#8fb0dc) 13/18 | bg-sapphire-800; text-white title; text-accent-on-dark body; text-display-sm/lg | ✅ pass |
| 7 | Featured selection | `1525:28332` | `FeaturedSelectionSection.tsx` | bg sapphire-50; title brand 44/42; desc secondary 15/22 | SectionHeading tokens; bg-sapphire-50 | ✅ pass |
| 8 | CTA | `1525:28340` | `HomeCtaSection.tsx` | bg white; title brand 44/42; desc secondary 13/18 (body-sm!); max-w=520 | SectionHeading display-lg + descriptionClassName="text-body-sm" max-w-[520px] | ✅ pass |
| 9 | Footer | `1525:36915` | `FooterContent.tsx` | h≈548; 12/16 col text; logo | 12px/16px correct; logo renders | ✅ pass |

---

## Batch A — Global chrome

Shared across all pages. Fix once, all pages inherit.

| Component | React file | Figma node | Status |
|-----------|------------|------------|--------|
| Header | `Header.tsx` | `1149:1333` | ✅ h-[82px] applied |
| Footer | `FooterContent.tsx` | `1059:1279` | ✅ typography 12/16 correct |
| MobileNav | `MobileNav.tsx` | — | ✅ no changes needed |
| StickyCta | `StickyCta.tsx` | — | pending review |

---

## Batch B — Catalog pages (pending)

Shared hero component updated (`CatalogHeroSection.tsx`) — uses `headingClassName("display-lg")` + `textClassName` for eyebrow/description.

| Route | Hero file | Status |
|-------|-----------|--------|
| `/properties` | `CatalogHeroSection` | pending full QA |
| `/off-plan` | `CatalogHeroSection` | pending full QA |
| `/areas` | `CatalogHeroSection` | pending full QA |
| `/developers` | `CatalogHeroSection` | pending full QA |
| `/insights` | `CatalogHeroSection` | pending full QA |

---

## Batch C — Marketing pages (pending)

`PageHero.tsx` updated to use `headingClassName`/`textClassName`.

| Route | Status |
|-------|--------|
| `/about` | pending |
| `/contact` | pending |
| `/insights/[slug]` | pending |

---

## Batch D — Remaining pages (pending)

| Route | Status |
|-------|--------|
| `/curated` | pending |
| `/concierge` | pending |
| `/private-office` | pending |
| `/faq` | pending |
| `/legal` | pending |

---

## Typography token reference

| Variant | Size / leading / tracking | Font | Usage |
|---------|--------------------------|------|-------|
| display-hero | 64/72 / -0.04em | Didot | Home hero H1 |
| display-lg | 44/42 / -0.02em | Didot | Section titles, catalog page H1 |
| display-lg-inverse | 44/42 / -0.02em | Didot | Section titles on dark bg |
| body-lg | 17/28 | Archivo | Long-form intro |
| body-regular | 15/22 | Archivo | Section descriptions |
| body-sm | 13/18 | Archivo | Supporting copy |
| body-xs | 12/16 | Archivo | Context labels, captions |
| overline | 12/16 / uppercase / 600 | Archivo | Labels on light bg |
| overline-accent | same | Archivo | Accent coloured labels |
| overline-tertiary | same | Archivo | Muted labels |
| overline-inverse | same | Archivo | Labels on dark bg |
| label-semibold | 12/16 / 600 | Archivo | Bold UI labels |
| label-muted | 11/14 / 500 | Archivo | Fine print |
