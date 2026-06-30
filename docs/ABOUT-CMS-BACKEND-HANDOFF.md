# About Page CMS — Backend Handoff

**Audience:** Laravel backend team (`nip_reality_backend`)  
**From:** NIP Reality frontend (`nip_frontend_app`)  
**Date:** June 2026  
**Status:** Frontend wired — backend must register and seed blocks below

---

## Summary

The About page (`/en/about`, `/ar/about`) — including the **Our Approach** section linked from the footer (`/about#approach`) — uses **CMS blocks** for every editable area.

| System | Used for | Storage |
|--------|----------|---------|
| **CMS blocks** | Hero, market copy, our role, partner logos, closing standard | `cms_blocks` table |

Both locales (`en`, `ar`) must be supported. The frontend never writes to the database directly.

**Related docs:**

- [CMS-BLOCKS-SYNC.md](./CMS-BLOCKS-SYNC.md) — block allowlist sync
- [EDITABLE-BLOCKS.md](./EDITABLE-BLOCKS.md) — EditableText / EditableImage pattern
- [I18N-BACKEND-HANDOFF.md](./I18N-BACKEND-HANDOFF.md) — locale on all reads
- [FAQ-LEGAL-CMS-BACKEND-HANDOFF.md](./FAQ-LEGAL-CMS-BACKEND-HANDOFF.md) — same handoff format

---

## 1. CMS Blocks API

### Endpoints (must be live)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/blocks?relUrl=&locale=` | Public | SSR page render |
| POST | `/api/v1/blocks` | Bearer (admin/editor) | Upsert block |
| DELETE | `/api/v1/blocks` | Bearer (admin/editor) | Remove block |
| POST | `/api/v1/media` | Bearer (admin/editor) | Upload image → URL for IMAGE blocks |

### Storage model

Unique row per **`(rel_url, key, locale)`**:

| Column | Type | Notes |
|--------|------|-------|
| `rel_url` | string | `/about` — no `/en` prefix |
| `key` | string | e.g. `hero-title` |
| `locale` | string | `en` or `ar` |
| `content` | text | Text body or image URL |
| `block_type` | enum | `TEXT`, `IMAGE`, `VIDEO`, `HTML` |
| `element_tag` | string? | For TEXT: `h1`, `h2`, `p`, etc. |

---

## 2. Allowlist — add to `config/cms-blocks.php`

### `/about` (relUrl: `/about`)

#### Hero (already partially in use)

| blockKey | blockType | elementTag | Description |
|----------|-----------|------------|-------------|
| `hero-eyebrow` | TEXT | p | ABOUT NIP |
| `hero-title` | TEXT | h1 | One Source. One System. One Standard. |
| `hero-description` | TEXT | p | Hero subtitle |

#### Market context

| blockKey | blockType | elementTag | Description |
|----------|-----------|------------|-------------|
| `market-title` | TEXT | h2 | Dubai's Property Market moves Quickly |
| `market-body` | TEXT | p | Market context paragraph |

#### Our role (`#approach` anchor)

| blockKey | blockType | elementTag | Description |
|----------|-----------|------------|-------------|
| `role-eyebrow` | TEXT | p | OUR ROLE |
| `role-title` | TEXT | h2 | We do not Begin with Inventory |
| `role-body` | TEXT | p | Role description paragraph |
| `role-image` | IMAGE | — | Left-column photo (520×400) |

#### Partners strip

| blockKey | blockType | elementTag | Description |
|----------|-----------|------------|-------------|
| `partners-caption` | TEXT | p | Two-line caption (use `\n` between lines) |
| `partner-logo-1` | IMAGE | — | Meraas logo |
| `partner-logo-2` | IMAGE | — | H&H logo |
| `partner-logo-3` | IMAGE | — | Emaar logo |
| `partner-logo-4` | IMAGE | — | Aldar logo |
| `partner-logo-5` | IMAGE | — | Omniyat logo |

#### Closing standard (`#why-nip` anchor)

| blockKey | blockType | elementTag | Description |
|----------|-----------|------------|-------------|
| `standard-title` | TEXT | h2 | NIP is Built around a Simple Standard: |
| `standard-quote` | TEXT | p | Italic quote line |

Frontend registry mirror: `lib/i18n/block-keys.ts` → `pageBlockKeys.about`.

---

## 3. Seed data

Seed **EN + AR** for all keys above.

Default copy lives in frontend messages:

| Section | EN source |
|---------|-----------|
| Hero | `messages/en.json` → `placeholders.about.hero` |
| Market | `messages/en.json` → `placeholders.about.market` |
| Role | `messages/en.json` → `placeholders.about.role` |
| Partners caption | `messages/en.json` → `placeholders.about.partners.caption` |
| Standard | `messages/en.json` → `placeholders.about.standard` |

Arabic equivalents: `messages/ar.json` → `placeholders.about.*`

### Optional image seeds

Frontend ships default partner logos under `public/logos/`:

- `about-partner-meraas.png`
- `about-partner-hh.png`
- `about-partner-emaar.png`
- `about-partner-aldar.png`
- `about-partner-omniyat.png`

Backend may upload these to media storage and seed `partner-logo-1` … `partner-logo-5` IMAGE blocks. Until seeded, the frontend uses the local PNG fallbacks.

`role-image` has no default photo — staff upload via inline **Edit** on the live site.

---

## 4. Page anchors (footer links)

| Footer link | Anchor | Section |
|-------------|--------|---------|
| Our Approach | `#approach` | Our Role |
| Why NIP | `#why-nip` | Closing standard |
| Team | `#team` | Hero (stub until Team section is built) |

---

## 5. Frontend behavior (for backend QA)

| Section | Priority | Fallback |
|---------|----------|----------|
| All TEXT blocks | CMS block → placeholder JSON | `placeholders.about.*` in messages |
| Role image | CMS IMAGE block | Gray placeholder until staff uploads |
| Partner logos | CMS IMAGE block | `public/logos/about-partner-*.png` |

Staff with `canEditCms` see **Edit** on all wired TEXT and IMAGE blocks after login at `/en/admin/login`.

---

## 6. Backend checklist

- [ ] `GET/POST/DELETE /api/v1/blocks` live for `relUrl=/about`
- [ ] `POST /api/v1/media` live for image upload
- [ ] Register all 17 `/about` keys in `config/cms-blocks.php`
- [ ] Seed EN + AR for all TEXT blocks
- [ ] Optional: seed partner logo IMAGE blocks from bundled PNGs
- [ ] Confirm `partners-caption` supports newline in content (`Trusted Partnership\nwith Dubai's Leading Developers`)

---

## 7. Testing matrix

| URL | Locale | Expect |
|-----|--------|--------|
| `/en/about` | en | CMS blocks or EN JSON fallbacks; all sections editable when staff logged in |
| `/ar/about` | ar | Arabic blocks or AR JSON fallbacks |
| `/en/about#approach` | en | Scrolls to Our Role section |
| `/en/about#why-nip` | en | Scrolls to closing standard section |

---

## 8. Contact

Frontend block registry: `lib/i18n/block-keys.ts`  
Frontend component: `components/sections/AboutStorySections.tsx`
