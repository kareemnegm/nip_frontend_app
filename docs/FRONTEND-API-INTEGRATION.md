# NIP Reality — Frontend API Integration Guide

**Give this file to your frontend AI agent** when building the public website or Private Office member area.

This document describes the **implemented Laravel REST API** at `/api/v1/*`. It is the source of truth for frontend integration.

> **Do not use** `BACKEND-API-SPEC-frontend.md` for integration — that file describes a planned CMS (blocks/locales) that was **not built**. Admin content is managed via the Blade panel at `/admin` (session auth), not via a headless CMS API.

**Backend repo:** `nip_reality_backend`  
**API version:** `v1`  
**Last updated:** June 2026

---

## Instructions for the AI agent

1. Use **only** endpoints listed in this document unless the user explicitly asks for admin API usage.
2. Base URL: `{NEXT_PUBLIC_API_URL}/api/v1` (see [Environment](#environment-variables)).
3. Public catalog + forms: **no auth**.
4. Private Office: **Sanctum bearer token** from member login.
5. All JSON responses use **camelCase field names only where noted** (member APIs use camelCase; most public resources use **snake_case**).
6. Images: use `*_url` fields (`image_url`, `logo_url`, `featured_image_url`, …), not raw `image` paths.
7. Pagination: Laravel standard `{ data, links, meta }` except member endpoints (custom shape — see [Member pagination](#member-pagination)).
8. On `422`, display field errors from `errors` object.
9. Map legacy PHP pages to these APIs (see [Page → API mapping](#page--api-mapping)).

---

## Environment variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://nip_reality_backend.test
# or http://127.0.0.1:8000 during local dev

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend CORS (already configured)

Set in backend `.env`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-production-domain.com
```

CORS allows credentials for Sanctum. For **public GET + POST forms**, bearer token in `Authorization` header is enough; cookie-based SPA auth is optional.

---

## Authentication

### Admin (CMS editors) — usually **not needed in frontend**

- Login: `POST /api/v1/auth/login` → `{ token, token_type: "Bearer", user }`
- Use header: `Authorization: Bearer {token}`
- Protected admin routes: `/api/v1/admin/*` (role: admin/editor)

The team uses the **Blade admin UI** at `/admin` for content management. Build the marketing site against **public** endpoints below.

### Private Office members

| Action | Method | Path | Auth |
|--------|--------|------|------|
| Login | POST | `/auth/member/login` | No |
| Logout | POST | `/auth/member/logout` | Bearer + member role |
| Profile | GET | `/auth/member/me` | Bearer + member role |

**Login body:**

```json
{
  "email": "member@example.com",
  "password": "secret"
}
```

**Login success (200):**

```json
{
  "token": "1|…",
  "user": {
    "id": 1,
    "email": "member@example.com",
    "name": "Kamyar",
    "salutation": "Mr.",
    "displayName": "Mr. Kamyar",
    "role": "member",
    "preferredLocale": "en",
    "advisor": {
      "id": 2,
      "name": "Advisor Name",
      "email": "advisor@niprealty.com",
      "availability": "Mon–Fri | Responds within hours"
    }
  },
  "expiresAt": "2026-06-14T12:00:00+00:00"
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 401 | `INVALID_CREDENTIALS` | Wrong email/password |
| 403 | `NOT_A_MEMBER` | Admin user tried member login |

Store `token` and send on every member request:

```
Authorization: Bearer {token}
Accept: application/json
```

---

## Response conventions

### Standard success

- `200` — OK (GET, PATCH)
- `201` — Created (POST)
- `204` — No content (DELETE)

### Validation error (422)

```json
{
  "message": "The email field is required.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### Not found (404)

Empty body or `{ "message": "…" }` depending on route.

### Laravel pagination (public catalog, blogs)

```json
{
  "data": [ /* items */ ],
  "links": {
    "first": "…",
    "last": "…",
    "prev": null,
    "next": "…"
  },
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 9,
    "total": 42
  }
}
```

Query: `?page=2&per_page=9` (properties default `per_page=9`).

### Member pagination

```json
{
  "items": [ /* … */ ],
  "total": 10,
  "page": 1,
  "totalPages": 1
}
```

Query: `?page=1&limit=12` (max `limit=50`).

---

## Media URLs

The API returns **root-relative** paths on `*_url` fields (special characters are already encoded):

```json
"image_url": "/storage/properties/1755213939_original%20%289%29.webp",
"images": [{ "image_url": "/storage/properties/gallery/1776236241_69df36d1713dd_4ex.png" }]
```

| Resource | Fields |
|----------|--------|
| Property / area | `image_url`, `photo_url`, gallery `images[].image_url` |
| Developer | `logo_url`, `photo_url` |
| Blog | `featured_image_url`, `author_image_url` |

**Rules**

- Always use `*_url` fields — never build `/storage/${property.image}` manually.
- Do not strip or re-encode paths (spaces/parentheses are already `%20`, `%28`, etc.).
- `image_url` may be `null` when the file is missing — show a placeholder in the UI.

**Same origin** (site and API on one domain, or Next.js proxies `/api` + `/storage` to Laravel): use the path as-is.

**Separate frontend** (e.g. Next.js on `localhost:3000`, API on `127.0.0.1:8000`): prepend `NEXT_PUBLIC_API_URL`:

```ts
import { resolveMediaUrl } from "@/lib/api/media-url";

// /storage/… → http://127.0.0.1:8000/storage/…
const src = resolveMediaUrl(property.image_url);
```

Env: `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` (production: your real API domain, e.g. `https://api.nipreality.com`).

---

## Public endpoints

### Health

```
GET /health
→ { "status": "ok" }
```

### Home (landing page bootstrap)

```
GET /home
```

```json
{
  "data": {
    "featured_properties": [ /* PropertyResource[] */ ],
    "areas": [ /* AreaResource[] */ ],
    "developers": [ /* DeveloperResource[] */ ],
    "blogs_count": 24
  }
}
```

Use for homepage hero sections, featured listings, area/developer strips.

---

### Properties

| Method | Path | Description |
|--------|------|-------------|
| GET | `/properties` | Paginated published listings |
| GET | `/properties/{slug}` | Detail by slug |
| GET | `/properties/{slug}/similar` | Up to 3 similar published |

**List query parameters** (all optional):

| Param | Example | Notes |
|-------|---------|-------|
| `keyword` | `marina` | Title or location search |
| `type` | `Apartment` | Property type |
| `category` | `Apartment` | Used with `listing_type` |
| `listing_type` | `offplan`, `sale` | Off-plan vs resale |
| `purpose` | `For Sale` | |
| `location` | `Dubai Marina` | LIKE match |
| `community` | `Palm` | Alias for location LIKE |
| `area` | `downtown-dubai` | Area **slug** |
| `developer` | `emaar` | Developer **slug** |
| `bedrooms` / `beds` | `2` | |
| `bathrooms` / `baths` | `2` | |
| `min_price` / `price_min` | `500000` | |
| `max_price` / `price_max` | `2000000` | |
| `price_range` | `AED 1M+` | Preset buckets |
| `per_page` | `12` | Default 9 |
| `page` | `2` | |

**Property object (public detail — key fields):**

```json
{
  "id": 1,
  "title": "Luxury Apartment",
  "slug": "luxury-apartment",
  "description": "…",
  "type": "Apartment",
  "purpose": "For Sale",
  "location": "Dubai Marina",
  "listing_type": "sale",
  "bedrooms": 2,
  "bathrooms": 2,
  "area_sqft": 1200,
  "floors": 1,
  "price": 1500000,
  "image": "properties/abc.jpg",
  "image_url": "/storage/properties/abc.jpg",
  "hero_title": "…",
  "featured": true,
  "about_location": "…",
  "master_plan_description": "…",
  "area": { "id": 1, "name": "…", "slug": "…", "image_url": "…" },
  "developers": [ { "id": 1, "name": "…", "slug": "…", "logo_url": "…" } ],
  "facilities": [ { "id": 1, "facility": "Pool", "facility_icon": "<svg…>" } ],
  "images": [
    { "id": 1, "type": "interior", "image_url": "…" }
  ],
  "created_at": "2026-01-15T10:00:00+00:00"
}
```

Draft properties are **never** returned on public routes (404 on detail).

---

### Areas

| Method | Path |
|--------|------|
| GET | `/areas` |
| GET | `/areas/{slug}` |

Area detail includes `project_count` (published properties in that area).

---

### Developers

| Method | Path |
|--------|------|
| GET | `/developers` |
| GET | `/developers/{slug}` |

---

### Facilities

```
GET /facilities
→ { "data": [ { "id", "facility", "facility_icon" } ] }
```

Use for property filter UI and detail amenity lists.

---

### Blogs

| Method | Path |
|--------|------|
| GET | `/blog-categories` |
| GET | `/blogs?category={slug}` |
| GET | `/blogs/{slug}` |

- Blog list paginates 9 per page.
- Filter by category slug: `?category=market-insights`
- Detail increments view count server-side.
- Content fields: `content`, `source_code`, and computed `body` (= `source_code` or `content`).

---

### Sitemap

```
GET /sitemap
→ application/xml (not JSON)
```

Use in Next.js `app/sitemap.ts` by fetching and parsing, or proxy XML.

---

## Lead & form endpoints

All return `201` on success. Several support optional reCAPTCHA when backend `RECAPTCHA_ENABLED=true`.

### Property inquiry

```
POST /property-inquiries
Content-Type: application/json
```

```json
{
  "property_id": 12,
  "name": "Jane Buyer",
  "email": "jane@example.com",
  "phone": "+971500000001",
  "message": "Interested in viewing.",
  "purpose_of_inquiry": "Buy",
  "page_url": "https://niprealty.com/properties/luxury-apartment",
  "form_id": "property-detail-form",
  "external_source": "Property Page"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `property_id` | No | Links to listing; resolves `property_name_id` for Zoho |
| `name`, `email`, `phone` | Yes | |
| `purpose_of_inquiry` | No | `Buy`, `Rent`, `Invest`, `General` |
| `company` | No | **Honeypot** — if filled, API returns fake success and stores nothing |

### Contact inquiry (contact page / contact list)

```
POST /contact-inquiries
```

```json
{
  "name": "John",
  "email": "john@example.com",
  "phone": "+971501234567",
  "message": "Hello",
  "interested_property": "Palm Jumeirah Villa",
  "language": "en",
  "g-recaptcha-response": "…"
}
```

### Consultation (VIP / consultation forms)

```
POST /consultations
```

Same body shape as contact inquiry (+ optional `external_source`).

### Career application

```
POST /career-applications
Content-Type: multipart/form-data
```

| Field | Required | Notes |
|-------|----------|-------|
| `name`, `email`, `phone` | Yes | |
| `role` or `job_title` | One required | `job_title` is aliased to `role` |
| `cv` | Yes | PDF/DOC/DOCX, max 5 MB |
| `linkedin_url`, `message` | No | |
| `g-recaptcha-response` | If enabled | |

### Support inquiry

```
POST /support-inquiries
```

```json
{
  "name": "Mike",
  "email": "mike@example.com",
  "messages": "I need help with…",
  "g-recaptcha-response": "…"
}
```

Note field name is **`messages`** (plural), not `message`.

### Newsletter

```
POST /newsletter-subscriptions
{ "email": "user@example.com" }
```

Duplicate email → `422` with friendly message on `email`.

---

## Private Office (member) endpoints

All require `Authorization: Bearer {memberToken}`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/member/curated?page=1&limit=12` | Advisor curated properties/projects |
| GET | `/member/saved?limit=12` | Saved listings |
| POST | `/member/saved` | Save property `{ "property_id": 5 }` |
| DELETE | `/member/saved/{propertyId}` | Unsave |
| GET | `/member/notes?limit=20` | Advisor notes |
| POST | `/member/message` | Message advisor |

**Curated item shape:**

```json
{
  "id": 1,
  "title": "Shortlist for June",
  "note": "Why we picked this",
  "releasedAt": "2026-06-01T09:00:00+00:00",
  "type": "property",
  "property": { /* card */ },
  "project": null,
  "advisor": { "id": 2, "name": "…" }
}
```

When `listing_type === "offplan"`, `type` is `"project"` and `project` is populated instead of `property`.

**Message advisor:**

```json
{
  "subject": "Question about curated item",
  "message": "Can we schedule a viewing?",
  "locale": "en",
  "relatedPropertyId": 5,
  "relatedCuratedId": 1
}
```

---

## Admin API (optional / headless)

Only use if building a **separate** admin frontend. The team already has `/admin` Blade UI.

Prefix: `/api/v1/admin` — requires Sanctum + admin role.

| Resource | Routes |
|----------|--------|
| Dashboard stats | `GET /dashboard/stats` |
| Areas, Developers | Full REST `apiResource` |
| Properties | REST + `POST /properties/{id}/publish`, `POST /properties/{id}/resend-zoho` |
| Property images | `POST /properties/{id}/images`, `DELETE /properties/{id}/images/{imageId}` |
| Blogs, Blog categories | Full REST |
| Facilities | `GET /facilities` |
| Leads | `GET /property-inquiries`, `/contact-inquiries`, etc. |
| Zoho resend | `POST /zoho/resend/{type}/{id}` |
| Members (Private Office) | `POST /members`, curated/notes management |

Admin property create accepts multipart for images. Minimal create: `{ "title": "Draft Listing" }` → auto slug + `property_name_id`.

---

## Page → API mapping

Map legacy `nip_reality` PHP pages to API calls:

| Legacy page | Frontend route (suggested) | API |
|-------------|---------------------------|-----|
| `index.php` | `/` | `GET /home` |
| `properties.php` / listings | `/properties` | `GET /properties?{filters}` |
| Property detail | `/properties/[slug]` | `GET /properties/{slug}` |
| `developers.php` | `/developers` | `GET /developers` |
| Developer detail | `/developers/[slug]` | `GET /developers/{slug}` |
| Areas | `/areas` | `GET /areas`, `GET /areas/{slug}` |
| `blog.php` | `/blog` | `GET /blogs`, `GET /blog-categories` |
| `blog-detail.php` | `/blog/[slug]` | `GET /blogs/{slug}` |
| Contact form | `/contact` | `POST /contact-inquiries` |
| Property inquiry modal | on property page | `POST /property-inquiries` |
| Consultation / VIP | `/consultation` | `POST /consultations` |
| Careers | `/careers` | `POST /career-applications` |
| Support | `/support` | `POST /support-inquiries` |
| Newsletter footer | global component | `POST /newsletter-subscriptions` |
| Private Office | `/private-office` | Member auth + `/member/*` |
| Sitemap | `sitemap.xml` | `GET /sitemap` |

**Static/marketing copy** (about, privacy, cookie policy) is **not** in the API — keep as frontend content or MDX until a CMS is added.

---

## Recommended Next.js integration pattern

```typescript
// lib/api.ts
const API = process.env.NEXT_PUBLIC_API_URL + '/api/v1';

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Accept: 'application/json', ...init?.headers },
    next: { revalidate: 60 }, // ISR for catalog pages
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}
```

For career CV upload, use `FormData` instead of JSON.

---

## Related docs

| File | Use |
|------|-----|
| **This file** | Primary frontend integration spec |
| [BACKEND-API-SPEC.md](./BACKEND-API-SPEC.md) | Content editability map — what editors change in admin vs CMS vs code |
| `PRIVATE-OFFICE-API-SPEC.md` | Extended Private Office UX/business rules (some intro text outdated — endpoints **are** live) |
| `routes/api.php` | Authoritative route list |
| `app/Http/Resources/*` | Exact response field shapes |
| `app/Http/Requests/Store*.php` | Exact validation rules |
| `tests/Feature/*` | Behavioral examples |

**Ignore for integration:** `BACKEND-API-SPEC-frontend.md` (unimplemented CMS schema).

---

## Local dev checklist

1. Backend running: `php artisan serve` or Laragon vhost
2. `php artisan storage:link` (media URLs work)
3. Seed or import data: `php artisan db:seed` or `legacy:import-*`
4. Frontend `.env.local`: `NEXT_PUBLIC_API_URL` points to backend
5. Backend `.env`: `CORS_ALLOWED_ORIGINS` includes frontend origin
6. Test: `GET {API_URL}/api/v1/health`

---

## Quick cURL smoke tests

```bash
# Health
curl -s http://localhost/api/v1/health

# Home
curl -s http://localhost/api/v1/home

# Properties
curl -s "http://localhost/api/v1/properties?listing_type=offplan&per_page=6"

# Property inquiry
curl -s -X POST http://localhost/api/v1/property-inquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@example.com","phone":"+971500000000","property_id":1}'

# Member login
curl -s -X POST http://localhost/api/v1/auth/member/login \
  -H "Content-Type: application/json" \
  -d '{"email":"member@example.com","password":"secret"}'
```
