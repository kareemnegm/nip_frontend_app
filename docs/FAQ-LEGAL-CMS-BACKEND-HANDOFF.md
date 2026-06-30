# FAQ + Legal CMS — Backend Handoff

**Audience:** Laravel backend team (`nip_reality_backend`)  
**From:** NIP Reality frontend (`nip_frontend_app`)  
**Date:** June 2026  
**Status:** Frontend wired — backend must implement/seed APIs below

---

## Summary

The FAQ and Legal (Privacy Policy) pages use **two content systems**:

| System | Used for | Storage |
|--------|----------|---------|
| **CMS blocks** | Fixed page slots (hero, legal paragraphs, compliance image) | `cms_blocks` table |
| **FAQ API** | Accordion Q&A list (reorder, add, disable) | `faqs` table |

Both must support **`locale`** (`en`, `ar`). The frontend never writes to a database directly.

**Related docs:**

- [CMS-BLOCKS-SYNC.md](./CMS-BLOCKS-SYNC.md) — block allowlist sync
- [EDITABLE-BLOCKS.md](./EDITABLE-BLOCKS.md) — frontend EditableText / EditableImage pattern
- [I18N-BACKEND-HANDOFF.md](./I18N-BACKEND-HANDOFF.md) — locale on all reads
- [BACKEND-API-SPEC.md](./BACKEND-API-SPEC.md) — full API reference

---

## 1. CMS Blocks API

### Endpoints (implement if not live)

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
| `rel_url` | string | e.g. `/legal`, `/faq` — no `/en` prefix |
| `key` | string | e.g. `hero-title` |
| `locale` | string | `en` or `ar` |
| `content` | text | Text body or image URL |
| `block_type` | enum | `TEXT`, `IMAGE`, `VIDEO`, `HTML` |
| `element_tag` | string? | For TEXT: `h1`, `h2`, `p`, `span`, etc. |

### Allowlist — add to `config/cms-blocks.php`

#### `/faq` (relUrl: `/faq`)

| blockKey | blockType | elementTag | Description |
|----------|-----------|------------|-------------|
| `hero-eyebrow` | TEXT | p | HELP & FAQ |
| `hero-title` | TEXT | h1 | Frequently Asked Questions |
| `hero-description` | TEXT | p | Hero subtitle |
| `cta-title` | TEXT | h2 | Still have questions? |
| `cta-description` | TEXT | p | CTA subtitle |

#### `/legal` (relUrl: `/legal`)

| blockKey | blockType | elementTag | Description |
|----------|-----------|------------|-------------|
| `hero-eyebrow` | TEXT | p | LEGAL |
| `hero-title` | TEXT | h1 | Privacy Policy |
| `hero-last-updated` | TEXT | p | Last Updated \| May 2026 |
| `sidebar-title` | TEXT | p | ON THIS PAGE |
| `compliance-image` | IMAGE | — | RERA / broker compliance badge |
| `section-overview-title` | TEXT | h2 | Overview heading |
| `section-overview-body` | TEXT | p | Overview body |
| `section-information-we-collect-title` | TEXT | h2 | |
| `section-information-we-collect-body` | TEXT | p | |
| `section-how-we-use-it-title` | TEXT | h2 | |
| `section-how-we-use-it-body` | TEXT | p | |
| `section-sharing-disclosure-title` | TEXT | h2 | |
| `section-sharing-disclosure-body` | TEXT | p | |
| `section-data-retention-title` | TEXT | h2 | |
| `section-data-retention-body` | TEXT | p | |
| `section-your-rights-title` | TEXT | h2 | |
| `section-your-rights-body` | TEXT | p | |
| `section-contact-title` | TEXT | h2 | |
| `section-contact-body` | TEXT | p | |

Frontend registry mirror: `lib/i18n/block-keys.ts` → `pageBlockKeys.faq`, `pageBlockKeys.legal`.

### Seed data

Seed **EN + AR** for all keys above. Default copy is in frontend:

- FAQ hero/CTA placeholders: `messages/en.json` → `placeholders.faq`
- Legal all sections: `messages/en.json` → `pages.legal` (and `messages/ar.json` for Arabic)

Staff edit via inline **Edit** on the live site after login at `/en/admin/login`.

---

## 2. FAQ API (accordion)

Accordion items are **not** CMS blocks — they use a dedicated FAQ resource so staff can reorder, add, and disable items.

### Public endpoint

**GET `/api/v1/faqs`**

| Param | Type | Description |
|-------|------|-------------|
| `locale` | string | `en` or `ar` (also honor `Accept-Language` header) |
| `category` | string? | Optional filter |

**Response:** `200 OK`

```json
{
  "items": [
    {
      "id": "uuid",
      "question": "How does NIP's Private Advisory work?",
      "answer": "We start with your mandate...",
      "sortOrder": 1,
      "category": "general"
    }
  ],
  "total": 5
}
```

Resolve `question` and `answer` for the requested locale. Fallback to English when Arabic is missing.

### Admin endpoints (CMS editor for FAQ list)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/admin/faqs` | Admin/editor | List all FAQs |
| POST | `/api/v1/admin/faqs` | Admin/editor | Create FAQ |
| PUT | `/api/v1/admin/faqs/{id}` | Admin/editor | Update question/answer/order/active |
| DELETE | `/api/v1/admin/faqs/{id}` | Admin/editor | Remove FAQ |

### Database schema

Table: `faqs` (see [BACKEND-API-SPEC.md](./BACKEND-API-SPEC.md))

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `question` | JSON | `{"en":"...","ar":"..."}` |
| `answer` | JSON | `{"en":"...","ar":"..."}` |
| `category` | string? | e.g. `general` |
| `sort_order` | integer | Display order |
| `is_active` | boolean | Hide when false |

### Seed — 5 default FAQs (Figma T13)

Match frontend fallback copy in `messages/en.json` → `pages.faq.items`:

| sort_order | key (reference) | EN question |
|------------|-----------------|-------------|
| 1 | advisory | How does NIP's Private Advisory work? |
| 2 | fees | Do you Charge buyers a Fee? |
| 3 | goldenVisa | Can you help with the Golden Visa? |
| 4 | offPlanReady | Do you handle Off-Plan and Ready properties? |
| 5 | responseTime | How Quickly will an Advisor Respond? |

Provide Arabic translations in the JSON `ar` keys (see `messages/ar.json` → `pages.faq.items`).

### Admin UI

Simple CRUD screen with:

- Question (EN) / Question (AR) text fields
- Answer (EN) / Answer (AR) text areas
- Sort order, active toggle, optional category

This is the **CMS text editor** for FAQ accordion items.

---

## 3. Frontend behavior (for backend QA)

### FAQ page (`/en/faq`, `/ar/faq`)

| Section | Priority | Fallback |
|---------|----------|----------|
| Hero + CTA | CMS block → placeholder JSON | `placeholders.faq` |
| Accordion | `GET /faqs?locale=` | `pages.faq.items` in messages JSON |

If `GET /faqs` returns items, frontend uses API data (admin edits appear after page refresh).

### Legal page (`/en/legal`, `/ar/legal`)

| Section | Priority | Fallback |
|---------|----------|----------|
| Hero, sidebar, all 7 sections | CMS block → placeholder JSON | `pages.legal` in messages |
| Compliance image | CMS IMAGE block `compliance-image` | Hidden until staff uploads |

Staff with `canEditCms` see **Edit** on all wired TEXT and IMAGE blocks.

---

## 4. Backend checklist

### CMS blocks

- [ ] `GET/POST/DELETE /api/v1/blocks` live
- [ ] `POST /api/v1/media` live for image upload
- [ ] Register all `/faq` and `/legal` keys in `config/cms-blocks.php`
- [ ] Seed EN + AR for all legal TEXT blocks
- [ ] Seed EN + AR for FAQ hero + CTA blocks

### FAQ API

- [ ] `GET /api/v1/faqs?locale=en` returns 5 seeded items
- [ ] `GET /api/v1/faqs?locale=ar` returns Arabic Q&A
- [ ] Admin CRUD endpoints for FAQ management
- [ ] `is_active=false` excludes item from public list

### Legal compliance image

- [ ] `compliance-image` IMAGE block accepted on `/legal`
- [ ] Optional: upload default RERA badge to media library and seed block URL

---

## 5. Testing matrix

| URL | Locale | Expect |
|-----|--------|--------|
| `/en/faq` | en | API FAQs or EN JSON fallback; hero/CTA editable when staff logged in |
| `/ar/faq` | ar | Arabic API or AR JSON fallback |
| `/en/legal` | en | CMS blocks or EN placeholders; compliance image when set |
| `/ar/legal` | ar | Arabic blocks or AR placeholders |

### Dev signals

When backend is down, frontend logs `[API fallback] GET /faqs` in the dev terminal and uses JSON fallbacks.

---

## 6. Contact

Frontend block registry: `lib/i18n/block-keys.ts`  
Frontend components: `components/sections/FaqStorySections.tsx`, `components/sections/LegalStorySections.tsx`
