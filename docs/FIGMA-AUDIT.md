# Figma Design Audit

Living checklist for matching the live site to [NIP Website](https://www.figma.com/design/7X3YcUQj70rvhvLx4pwD9h/NIP-Website) (file `7X3YcUQj70rvhvLx4pwD9h`).

**Design rules (single source of truth):** [.cursor/design-system/](../.cursor/design-system/README.md)  
**Workflow:** [.cursor/design-system/page-workflow.md](../.cursor/design-system/page-workflow.md)  
**Debt gate:** `scripts/design-token-allowlist.txt` — remove paths when a page is refixed.

All existing routes below will be **refixed** to Figma. New pages start as `pending` and must pass without allowlist entries.

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
| `/en/contribute` | `1525:27340` | 2 | ✅ pass |
| `/en/about` | `1525:27728` | 5 | in progress — hero refixed |
| `/en/contact` | `1525:27463` | 2 | ✅ pass |
| `/en/curated` | TBD | TBD | pending |
| `/en/concierge` | TBD | TBD | pending |
| `/en/private-office` | TBD | TBD | pending |
| `/en/faq` | TBD | TBD | pending |
| `/en/legal` | TBD | TBD | pending |
| `/en/thank-you` | `1525:27419` | 1 | ✅ pass |
| `not-found` (404) | `1525:27407` | 1 | ✅ pass |

---

## Home — `/en`

**Figma frame:** [T02 · Home](https://www.figma.com/design/7X3YcUQj70rvhvLx4pwD9h/NIP-Website?node-id=1525-28264) (`1525:28264`)

**Preview:** http://localhost:3000/en

### Phase 1 — Design system fixes applied

| Fix | Detail | Status |
|-----|--------|--------|
| `--font-display` | Changed from `var(--font-archivo)` to `Didot, "Bodoni 72", var(--font-cormorant), serif` | ✅ done |
| `@theme` tokens | Full typography scale added: display-hero, display-hero-sm, display-lg, display-sm, stat-value, body-regular, body-xs, label-semibold, etc. | ✅ done |
| `SectionHeading.tsx` | Rewritten to use `text-display-sm` (36px) mobile + `sm:text-display-lg` (44px) tokens; desc uses `text-body-sm sm:text-body-regular` | ✅ done |
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

### Sitewide mobile typography (home scale)

All marketing page heroes and section titles now use the **home mobile scale** on viewports below `sm` (640px):

- **Titles:** `text-display-sm` (36px) → `sm:text-display-lg` (44px) or hero tokens where applicable
- **Lead body:** `text-body-sm` (13px) → `sm:text-body-regular` or `sm:text-body-lg` per page

**Shared:** `CatalogHeroSection`, `SectionHeading`, `CtaBand`, `EditableCtaBand`, `AreaSectionHeading`

**Pages:** contact, contribute, FAQ, legal, concierge, about (hero body), curated, thank-you, 404, 500, area/developer detail heroes + CTAs, catalog list heroes (properties, off-plan, areas, developers, insights)

**Out of scope (unchanged):** property/off-plan detail H1/H2 at 30px; insight article H1; mid-section `heading-h1` blocks on about/area pages.

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
| `/about` | in progress — see [About — /en/about](#about--enabout) |
| `/contact` | ✅ pass — see [Contact — /en/contact](#contact--encontact) |
| `/insights/[slug]` | pending |

---

## About — `/en/about`

**Figma frame:** [T08 · Flexible Content (About NIP)](https://www.figma.com/design/7X3YcUQj70rvhvLx4pwD9h/NIP-Website?node-id=1525-27728) (`1525:27728`)

**Preview:** http://localhost:3000/en/about

| Fix | Detail | Status |
|-----|--------|--------|
| Hero container width | `max-w-[846px]` (too narrow — forced the headline to wrap onto 2 lines) → `sitePageInnerClassName` (1080px, matches Figma's real frame inner width, same convention as `ContactHeroSection`) | ✅ done |
| Hero title | Raw `text-[44px] leading-[42px] tracking-[-0.88px]` (no responsive step, wrapped badly on all sizes) → `font-display text-display-sm uppercase text-brand sm:text-display-lg` (36px mobile → 44px desktop tokens, single line at desktop matching Figma) | ✅ done |
| Hero description | Raw `text-[17px] leading-[28px]` → `text-body-lg` token (17/28 exact, same color `text-ink-secondary`) | ✅ done |
| Market/Role/Standard headings (`aboutHeadingClassName`) | Raw `text-[30px] leading-[38px] tracking-[-1.2px]` → `font-display text-heading-h1 uppercase text-brand` token | ✅ done |
| Market/Role body copy (`aboutBodyClassName`) | Raw `text-[17px] leading-[28px]` → `text-body-lg` token | ✅ done |
| Standard-section quote | Raw `text-[13px] leading-[18px]` → `text-body-sm` token | ✅ done |
| "Read our Insights" CTA label | Raw `text-[13px] leading-[18px]` → `text-label` token | ✅ done |

Removed `components/sections/AboutStorySections.tsx` from `scripts/design-token-allowlist.txt`.

Remaining for full page pass: partners-strip logo/background QA and full 390/768/1280 responsive sweep against Figma per the checklist above.

---

## Contact — `/en/contact`

**Figma frame:** [T14 · Speak with NIP](https://www.figma.com/design/7X3YcUQj70rvhvLx4pwD9h/NIP-Website?node-id=1525-27463) (`1525:27463`)

**Preview:** http://localhost:3000/en/contact

| Fix | Detail | Status |
|-----|--------|--------|
| Hero title | Hardcoded `text-[44px] leading-[42px] tracking-[-0.02em]` + missing `uppercase` → `font-display text-display-lg uppercase text-brand` (Figma renders "SPEAK WITH NIP") | ✅ done |
| Hero description | Wrong color `text-ink-secondary` → `text-ink` (#171e2d); trailing period removed from CMS placeholder to match Figma copy exactly | ✅ done |
| Intro overline | Wrong color `text-accent` → `text-brand` (Figma "PRIVATE ADVISORY \| BY INVITATION" is #0b3268, not #3778ce) | ✅ done |
| Intro body | Wrong color `text-ink-secondary` → `text-ink`; width `max-w-[420px]` (Figma exact) | ✅ done |
| Form section padding | `pb-[72px]` → `pb-20` (Figma 80px) | ✅ done |
| Form layout | `grid lg:grid-cols-[400px_1fr]` → `flex justify-between` with a 440px intro column and a 540px form card (Figma `1525:27471`) | ✅ done |
| Form card | Replaced the generic 4-field `InquiryForm` with `ContactRequirementForm` matching Figma's richer "Form / Lead (2-step)" component (`1525:27475`): adds Preferred language, Lead type, Budget range, Timeline selects | ✅ done |
| Form heading | `text-xl font-bold leading-[26px] text-brand` (20/26, wrong color) → new `text-heading-h2` token (24/30/700) `text-ink` | ✅ done |
| Form subtitle | Hardcoded `leading-[18px] text-ink-secondary` → `text-body-sm text-ink` | ✅ done |
| Submit button | Was stretched `w-full justify-center` — Figma button is auto-width. Also fixed a `flex-col` stretch bug that forced the button (and would force any auto-width child) to fill the card | ✅ done |
| Field labels | `text-xs font-semibold` (browser default 12px) → token-based via new `labelClassName` prop: `text-label-muted` (11/14) for Name/Phone/Email/Message, `text-label` (13/18) for the four selects — exact Figma sizes | ✅ done |
| Shared input styling | `FormControls.tsx` / `PhoneInput.tsx`: `text-sm` (14px) → `text-body-sm` (13px, Figma exact); `border-line` → `border-border-default`; `px-4` → `px-3.5` (14px exact); `text-xs` labels/errors → `text-label-semibold`/`text-body-xs` tokens (same rendered size, no more banned classes) | ✅ done |
| Checkbox | 16px `border-line` box → 18px `rounded-[3px] border-border-default` (Figma exact); label text `text-xs` → `text-body-xs text-ink-tertiary` | ✅ done |
| Copy casing | "Phone Number" → "Phone number"; "E-mail Address" → "Email address"; consent line trailing period removed — all matched verbatim to Figma text layers | ✅ done |

Removed `components/sections/ContactStorySections.tsx`, `components/ui/FormControls.tsx`, `components/ui/PhoneInput.tsx`, `components/ui/LeadForms.tsx` from `scripts/design-token-allowlist.txt`.

---

## Thank You — Confirmation page

**Figma frame:** [T16a · Thank-you](https://www.figma.com/design/7X3YcUQj70rvhvLx4pwD9h/NIP-Website?node-id=1525-27419) (`1525:27419`)

**Preview:** http://localhost:3000/en/thank-you

| Fix | Detail | Status |
|-----|--------|--------|
| Badge icon | Generic stroke checkmark on `bg-success` (old `#2e7d5b`) → Figma "Complete" asset reused as the existing `delivered` icon (identical paths already in the registry); `bg-success` retokenized to Figma "Feedback/Green-600" `#36957c`; size 56/28px → 52/36px exact | ✅ done |
| Eyebrow | `CONFIRMATION` + `tracking-[0.18em]` (not in Figma) → copy `Request Received`, `text-overline font-semibold uppercase text-success`, no extra tracking | ✅ done |
| Title | `text-[44px] leading-[42px] tracking-[-0.02em]` raw px → `font-display font-normal uppercase text-brand text-display-lg` token; copy `Request Received` → `Thank You` | ✅ done |
| Description | `text-body-lg` (17/28) max-w-680 secondary → Figma is `text-body-sm` (13/18) `text-ink-tertiary` max-w-[520px]; copy updated to match Figma exactly | ✅ done |
| Buttons | Second button was `bg-accent` (#3778ce, wrong — Figma uses the same `sapphire-600` as the first button); both now use the shared `Button` (`primary` variant); label `Read the Latest Insights` → `Explore Insights` | ✅ done |
| Spacing | `mt-*` ad-hoc offsets → single `gap-[18px]` flex column matching Figma Auto Layout; `py-20 pb-[72px]` → `py-20 lg:py-[140px]` | ✅ done |

---

## Contribute — Submit an insight

**Figma frame:** [T20 · Contribute Insight](https://www.figma.com/design/7X3YcUQj70rvhvLx4pwD9h/NIP-Website?node-id=1525-27340) (`1525:27340`)

**Preview:** http://localhost:3000/en/contribute

| Fix | Detail | Status |
|-----|--------|--------|
| Hero title | Raw `text-[44px] leading-[42px] tracking-[-0.02em]` (no uppercase) → `font-display text-display-lg uppercase text-brand` token, matching every other page hero | ✅ done |
| Hero description | `max-w-[680px] text-body-lg leading-[28px]` → `max-w-[640px] text-body-lg text-ink-secondary` (exact Figma width + hex `#323e58`) | ✅ done |
| Sidebar "What We Publish" | `text-xl` (20px Tailwind default, banned) → `text-h3 font-bold text-brand` (Figma "02 Heading/H3" 20/26/700) | ✅ done |
| Publish-point titles | `text-body-md font-bold text-ink` (15px, wrong size/weight/color) → `text-label-semibold font-semibold text-brand` (Figma 12/16/600, `#0b3268`) | ✅ done |
| Publish-point body | `text-body-sm leading-[18px] text-ink-secondary` → `text-body-sm text-ink-tertiary` (Figma `#4e5a78`); list gap 24px / row gap 6px / icon-title gap 10px to match Auto Layout | ✅ done |
| Form card shell | Double-nested `bg-sapphire-50 p-6` + inner white `p-8` card (not in Figma — single card only) → one `border-line` card, `rounded-xl` (12px), `p-9` (36px), `gap-[18px]`, `lg:max-w-[540px]` | ✅ done |
| Field labels | Default `text-label-semibold` (12/16/600) → Figma "04 Label/Small" `text-label-muted font-medium text-ink-secondary` (11/14/500) on every field | ✅ done |
| Author/Email row gap | `gap-4` (16px) → `gap-3` (12px) matching Figma | ✅ done |
| Draft dropzone | `px-6 py-8` → `py-6` (Figma `py-[24px]` only, full-width box); caption color `text-ink-tertiary` → `text-basalt-300` (`#7e8aa4`); helper text weight → `font-medium` (Archivo Medium) | ✅ done |
| Submit button | `w-full justify-center` (stretched) → default `Button` size (Figma button hugs its label, not full-width) | ✅ done |
| Layout | `grid lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-16` → `flex lg:flex-row lg:justify-between` with sidebar `lg:max-w-[380px]`, matching Figma's fixed 380/540 column widths and the same pattern as the Contact page | ✅ done |
| Section padding | `pb-[72px]` → `pb-20` (Figma `pb-[80px]`) | ✅ done |

Removed `components/sections/ContributeStorySections.tsx` from `scripts/design-token-allowlist.txt`.

---

## Developers list — Advisory CTA band

**Figma frame:** [Advisory CTA band](https://www.figma.com/design/7X3YcUQj70rvhvLx4pwD9h/NIP-Website?node-id=1525-27893) (`1525:27893`) — same reusable component as the per-developer/per-area "Interested in…" bands.

**Preview:** http://localhost:3000/en/developers (bottom of page)

| Fix | Detail | Status |
|-----|--------|--------|
| Title casing/font | "Looking for the Right Developer?" rendered sentence-case in a generic `text-3xl sm:text-4xl lg:text-5xl font-semibold` — not uppercase, wrong font (Archivo, not Didot) → `font-display font-normal uppercase text-display-lg` (Didot 44/42, -0.02em), matching every other CTA band on the site | ✅ done |
| Eyebrow | Missing — Figma shows an `ADVISORY` label above the title (`text-overline font-semibold uppercase text-accent-on-dark`, #8fb0dc) → added via new `eyebrow` prop on `CtaBand`/`EditableCtaBand`, reusing the existing `pages.developers.advisory` copy | ✅ done |
| Button | Generic `accent`-colored `Button` with plain "Speak with NIP" text → white pill button (`bg-white text-brand`, `rounded-[var(--radius-field)]`) with "Speak with" in Archivo SemiBold + "NIP" in the logo font (Kalnia), exactly matching the Figma "Speak with NIP" component used elsewhere (`DeveloperStorySections.tsx`, `AreaStorySections.tsx`) | ✅ done |
| Shared component debt | `CtaBand.tsx` / `EditableCtaBand.tsx` used raw `text-[11px]`, `tracking-[0.18em]`, `text-3xl…text-5xl`, `text-sm` → all replaced with `text-overline`, `text-display-lg`, `text-body-regular` tokens | ✅ done |
| Developer card grid | Card title/meta/CTA used banned `text-2xl`, `text-sm` defaults → `text-h3 font-bold`, `text-body-sm`, `text-label-semibold` tokens (same pattern as `Cards.tsx`) | ✅ done |

Removed `components/sections/CtaBand.tsx`, `components/sections/EditableCtaBand.tsx`, `app/[locale]/developers/page.tsx` from `scripts/design-token-allowlist.txt`. (`/areas` reuses the same fixed component but keeps its plain title, no eyebrow — not requested for this pass.)

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

## Private Office — Login card

**Figma frame:** [Private Office login](https://www.figma.com/design/7X3YcUQj70rvhvLx4pwD9h/NIP-Website?node-id=1525-27708) (`1525:27708`)

**Preview:** http://localhost:3000/en/private-office

| Fix | Detail | Status |
|-----|--------|--------|
| Card shell | `rounded-[8px]` → `rounded-[var(--radius-card-lg)]` (16px, new token); `border-line` → `border-basalt-100` (#d9e0ea exact); `shadow-card` → one-off `shadow-[0px_2px_8px_rgba(18,51,94,0.06)]` (wider blur than the standard property-card shadow); fixed `max-w-[460px]` (372px content + 44px padding) instead of `max-w-md`; padding `p-8 sm:p-10` → `p-8 sm:p-11` (44px desktop) | ✅ done |
| Logo tagline | "For Those Who / Expect More" was 10px uppercase `text-ink-tertiary` (gray) — Figma is 8px, not uppercase, `text-brand`. Added `text-tagline-micro` token (8/10) | ✅ done |
| Lock badge | 48px circle `bg-brand` (#0b3268) with a 20px icon → 52px circle `bg-sapphire-600` (#0e4286) with a 36px icon, matching Figma exactly | ✅ done |
| "PRIVATE OFFICE" overline | `text-[11px] tracking-[0.18em] text-ink-tertiary` → `text-overline font-semibold uppercase text-platinum-600` (12/16, #7c8694) | ✅ done |
| Title | `text-3xl font-semibold tracking-tight` (36px, no uppercase) → `text-property-h1` (Didot 30/38, -1.2px, uppercase, `text-brand`) — reuses the same class as the property-detail H1 | ✅ done |
| Description | `text-sm leading-6 text-ink-secondary max-w-xs` → `text-body-sm text-ink-tertiary max-w-[360px]` (13/18, #4e5a78) | ✅ done |
| Vertical rhythm | Ad hoc `mt-8`/`mt-6`/`space-y-4` → consistent `gap-4` (16px) flex columns throughout, matching the Figma frame's single 16px gap | ✅ done |
| "Request access \| Forgot password?" | `text-sm text-brand` + gray separator → `text-label-muted font-medium text-accent` (11/14, #3778ce) for the whole line | ✅ done |
| Sign In button, form field shell (height/border/radius) | Already matched Figma via shared `Button` (`bg-sapphire-600`) and `TextInput` (`h-11`, `rounded-[var(--radius-field)]`) — no change needed | ✅ pass |

Removed `components/sections/PrivateOfficeLoginCard.tsx`, `components/sections/PrivateOfficeLoginIntro.tsx`, `components/forms/PrivateOfficeLoginForm.tsx` from `scripts/design-token-allowlist.txt`.

---

## Not Found — 404 page

**Figma frame:** [T16b · 404](https://www.figma.com/design/7X3YcUQj70rvhvLx4pwD9h/NIP-Website?node-id=1525-27407) (`1525:27407`)

**Preview:** any unmatched URL, e.g. http://localhost:3000/en/does-not-exist

| Fix | Detail | Status |
|-----|--------|--------|
| Badge icon | Hand-drawn Lucide-style "frown" face (not a Figma asset) → exported the real Figma "Error-404" glyph (`public/icons/figma/error404.svg`, registered as `error404`); `bg-brand` → `bg-accent` (#3778ce exact); size 56/28px → 52/28px exact | ✅ done |
| Eyebrow | `text-brand` + `tracking-[0.18em]` (not in Figma) → `text-overline font-semibold uppercase text-accent` (Figma "ERROR 404" is #3778ce, no extra tracking) | ✅ done |
| Title | `text-[44px] leading-[42px] tracking-[-0.02em]` raw px, missing `uppercase` → `font-display font-normal uppercase text-brand text-display-lg` token | ✅ done |
| Description | `text-body-lg` (17/28) max-w-680 secondary → Figma is `text-body-sm` (13/18) `text-ink-tertiary` max-w-[520px] | ✅ done |
| Buttons | Second button was `bg-accent` + an arrow icon (neither in Figma — both buttons are plain `sapphire-600`) → both now use the shared `Button` (`primary` variant), no icon | ✅ done |
| Spacing | `mt-*` ad-hoc offsets → single `gap-[18px]` flex column matching Figma Auto Layout; `py-20 pb-[72px]` → `py-20 lg:py-[140px]` | ✅ done |

Removed `components/sections/NotFoundStorySections.tsx` from `scripts/design-token-allowlist.txt`.

---

## Property / Off-Plan detail — Similar Properties section

**Figma frame:** [Similar Properties](https://www.figma.com/design/7X3YcUQj70rvhvLx4pwD9h/NIP-Website?node-id=1525-28213) (`1525:28213`)

**Preview:** http://localhost:3000/en/properties/seven-palm-hotel-apartment

| Fix | Detail | Status |
|-----|--------|--------|
| Section not rendering | `/properties/{slug}/similar` recommendations sometimes return the *other* listing type (e.g. off-plan projects on a ready-property page), so the strict type filter emptied the grid and the whole section disappeared. Added `getSimilarPropertiesFor()` (`lib/api/properties.ts`) which backfills from the regular catalog (`listing_type` + `type` match, falling back to `listing_type` only) so 3 same-type cards always render when matching inventory exists. | ✅ done |
| Card typography tokens | `Cards.tsx` `cardTypography` (shared by `PropertyCard`/`OffPlanCard`/`InsightCard`/`CommunityCard`) used banned raw utilities (`text-xs`, `text-xl`, `text-[11px]`, `text-[13px]`, `leading-[…]`) for meta/price/badge/cta/excerpt text. Replaced with `text-label-semibold`, `text-h3`, `text-label-muted`, `text-body-xs`, `text-body-sm` tokens — same computed size, now Figma-token compliant. | ✅ done |
| Card shell / image / badges / layout | 344px card, 236px image, `bg-basalt-100` placeholder, `border-line` + `shadow-card` + `radius-card`, `bg-basalt-50` meta/badge chips, `gap-6` (24px) grid | already matched Figma — no change needed | ✅ pass |

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
