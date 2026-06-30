# Internationalization — Backend Handoff

**Audience:** Laravel backend team (`nip_reality_backend`)  
**From:** NIP Reality frontend (`nip_frontend_app`)  
**Date:** June 2026  
**Status:** Frontend sends locale on all reads — backend must return localized content

---

## Summary

The Next.js site supports **English (`en`)** and **Arabic (`ar`)** via URL prefix (`/en/...`, `/ar/...`). The frontend now sends the active locale on **every catalog/data API request**. CMS editable blocks already use per-locale storage.

**Your job:** Return localized text fields for the requested locale, with fallback to English when a translation is missing.

---

## How the frontend sends locale

Every catalog GET request includes:

1. **Query param:** `?locale=en` or `?locale=ar`
2. **Header:** `Accept-Language: en` or `Accept-Language: ar`

Example:

```
GET /api/v1/properties?locale=ar&page=1&per_page=9
Accept-Language: ar
Accept: application/json
```

Member reads also send locale (for confirmation messages, etc.):

```
GET /api/v1/member/curated?locale=ar&limit=20
Authorization: Bearer {member_token}
```

---

## Endpoints that must honor `locale`

| Endpoint | Translatable fields (examples) |
|----------|-------------------------------|
| `GET /home` | Featured area names, any hero copy returned in payload |
| `GET /properties`, `GET /properties/{slug}`, `GET /properties/{slug}/similar` | `title`, `description`, `location`, `type`, area/developer names |
| `GET /areas`, `GET /areas/{slug}` | `name`, `description` |
| `GET /developers`, `GET /developers/{slug}` | `name`, `description` |
| `GET /blogs`, `GET /blogs/{slug}`, `GET /blog-categories` | `title`, `excerpt`, `content`/`body`, category `name` |
| `GET /faqs` | `question`, `answer` |
| `GET /blocks?relUrl&locale` | Block `content` per locale (see CMS section) |
| `GET /auth/member/me`, `GET /member/*` | User-facing strings; message confirmations respect `locale` on `POST /member/message` |

### Fields that stay shared (not translated)

- `id`, `slug`, `price`, `currency`, `bedrooms`, `bathrooms`, `area_sqft`
- Image URLs, dates, counts, IDs
- **Slugs:** one slug per record across all languages (same URL path in `/en` and `/ar`)

---

## Fallback behavior

When `locale=ar` but no Arabic translation exists for a field:

1. Return the **English (default) value** for that field
2. Do **not** return 404 or empty string unless the record itself is unpublished

This keeps `/ar` usable while translations are being added.

---

## CMS blocks (editable page copy)

The frontend CMS already reads/writes blocks per language.

### Storage model

One row per **`relUrl + key + locale`**:

| relUrl | key | locale | content |
|--------|-----|--------|---------|
| `/` | `hero-title` | `en` | `Elevated Living in Dubai` |
| `/` | `hero-title` | `ar` | `حياة راقية في دبي` |

### API contract (already implemented on frontend)

**Read:**

```
GET /api/v1/blocks?relUrl=/about&locale=ar
```

Returns blocks for that page in Arabic only.

**Save (staff auth):**

```json
POST /api/v1/blocks
{
  "relUrl": "/about",
  "key": "hero-title",
  "locale": "ar",
  "content": "حياة راقية في دبي",
  "blockType": "TEXT",
  "elementTag": "h1"
}
```

**Delete:**

```json
DELETE /api/v1/blocks
{
  "relUrl": "/about",
  "key": "hero-title",
  "locale": "ar"
}
```

When staff edits on `/ar/private-office`, the frontend sends `locale: "ar"` — only the Arabic block is updated; English is untouched.

Optional: if no block exists for `locale=ar`, fall back to `locale=en` content on read (frontend also has English placeholder fallbacks).

---

## Adding future languages

1. Backend accepts new locale code (e.g. `fr`) on all endpoints above
2. Frontend adds `"fr"` to `locales` in `lib/i18n/config.ts`
3. Frontend adds `messages/fr.json` for fixed UI strings
4. CMS blocks get a third row per `relUrl + key + fr`

No routing changes required.

---

## Frontend fixed UI vs backend content

| Layer | Where it lives | Who edits |
|-------|----------------|-----------|
| Menus, buttons, labels, errors | `messages/en.json`, `messages/ar.json` | Developers / translators in repo |
| Page marketing copy (hero, sections) | CMS blocks (`GET/POST /blocks`) | Staff in browser on `/en` or `/ar` |
| Listings, blogs, FAQs, areas | Laravel database + API | Backend admin / CMS |

---

## Test checklist for backend

- [ ] `GET /properties?locale=ar` returns Arabic titles when translations exist
- [ ] `GET /properties?locale=ar` falls back to English when Arabic missing
- [ ] `GET /blocks?relUrl=/&locale=ar` returns Arabic blocks independently of `locale=en`
- [ ] `POST /blocks` with `locale=ar` does not overwrite English block
- [ ] `GET /faqs?locale=ar` returns Arabic Q&A
- [ ] `POST /member/message` with `"locale": "ar"` returns Arabic confirmation text
- [ ] Form POST endpoints (`/contact-inquiries`, `/consultations`, etc.) honor `Accept-Language: ar` for confirmation emails/messages

---

## CMS block seed checklist (`locale=ar`)

Frontend shows Arabic defaults from `messages/ar.json` until these blocks exist in the backend. Seed one row per **`relUrl + key + locale=ar`**. Keys match `lib/i18n/block-keys.ts`.

| relUrl | block keys |
|--------|------------|
| `/` | `hero-eyebrow`, `hero-title`, `hero-body`, `featured-insight-title`, `featured-insight-desc`, `curated-collection-title`, `curated-collection-desc`, `market-pulse-title`, `market-pulse-desc`, `private-office-title`, `private-office-desc`, `featured-selection-title`, `featured-selection-desc`, `home-cta-title`, `home-cta-desc` |
| `/properties`, `/off-plan`, `/areas`, `/developers`, `/insights` | `hero-eyebrow`, `hero-title`, `hero-description` |
| `/areas`, `/developers`, `/insights` | also `cta-title` (bottom CTA band heading) |
| `/about`, `/contact`, `/faq`, `/concierge`, `/contribute`, `/legal` | hero keys per page (see block-keys) |
| `/contact` | also `form-intro-overline`, `form-intro-body` |
| `/faq` | also `cta-title`, `cta-description` |
| `/contribute` | also `sidebar-title` |
| `/legal` | also `hero-last-updated` |
| `/curated` | `hero-eyebrow`, `hero-badge`, `hero-title`, `hero-description`, `selection-*`, `notes-*` |
| `/private-office` | `login-title`, `login-description` |
| `/thank-you`, `/404`, `/500` | `status-eyebrow`, `status-title`, `status-description` |
| `/global` | `footer-tagline`, `footer-newsletter-title`, `footer-newsletter-desc`, `footer-copyright` |

Staff can also edit live on `/ar/...` in the browser — no deploy required.

---

## Related docs

- [ADVISOR-PRIVATE-OFFICE-FRONTEND.md](./ADVISOR-PRIVATE-OFFICE-FRONTEND.md) — member API (camelCase, separate from catalog snake_case)
- [EDITABLE-BLOCKS.md](./EDITABLE-BLOCKS.md) — frontend CMS block pattern
- [CMS-BLOCKS-SYNC.md](./CMS-BLOCKS-SYNC.md) — block keys per page
