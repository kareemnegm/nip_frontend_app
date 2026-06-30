# Private Office & Advisor — Backend Handoff (Frontend → Laravel)

> **Canonical spec from backend:** Use **[ADVISOR-PRIVATE-OFFICE-FRONTEND.md](./ADVISOR-PRIVATE-OFFICE-FRONTEND.md)** as the source of truth.  
> That file is what Laravel shipped (`Status: Implemented and ready for integration`).  
> This document is supplementary context only — if anything conflicts, **follow ADVISOR-PRIVATE-OFFICE-FRONTEND.md**.

**From:** NIP Reality frontend team  
**To:** Laravel backend team  
**Date:** June 2026  
**Frontend repo:** `nip_frontend_app`  
**API base:** `{NEXT_PUBLIC_API_URL}/api/v1` (local: `http://127.0.0.1:8000/api/v1`)

---

## 1. Executive summary

The NIP website has a **Private Office** area: invitation-only members sign in, view properties curated by their assigned advisor, save listings, read private advisor notes, and send messages.

**There is no advisor dashboard in the Next.js website.** Advisors manage members through **Laravel admin APIs** (Filament, Nova, or custom panel). Members see the results on two member pages.

The frontend is **already built and wired**. It calls your REST API. When endpoints return the shapes below, pages work without further frontend changes.

**Separate from Private Office:** CMS staff login (`/en/admin/login`) edits public page copy via the Blocks API. That uses a different auth token (`cms_token`) and is already integrated. This document focuses on **members + advisors**.

**Admin API (section 7):** Yes — include full `/api/v1/admin/*` endpoints in this handoff. They are **required for the Laravel advisor dashboard** (Filament, Nova, or Blade `/admin`). The **Next.js website never calls admin routes**; only the Laravel panel does.

---

## 2. Product overview

### What members see (public website)

| URL | Purpose |
|-----|---------|
| `/en/private-office` | Member login |
| `/en/private-office/member` | Dashboard: welcome, advisor name, curated preview (3), saved properties |
| `/en/curated` | Full curated list, advisor notes, “Message your Advisor” |

Arabic uses `/ar/...` — same pages, locale from route.

### What advisors do (backend / admin — no website UI yet)

1. Create or invite a **member** user
2. Assign themselves (or another staff user) as **`assigned_advisor_id`**
3. **Add curated selections** — link a sale property or off-plan project to the member
4. **Release** selections — member only sees items where `is_released = true`
5. **Write advisor notes** — private context visible on `/curated`
6. **Receive member messages** — created as leads assigned to the advisor

### Roles

| Role | Private Office | CMS edit |
|------|----------------|----------|
| `member` | Login, read own curated/saved/notes, send messages | No |
| `editor` (advisor) | Manage **assigned members only** via admin API | Yes (`canEditCms`) |
| `admin` | Manage **all members** via admin API | Yes |
| `viewer` | No Private Office admin | Read-only CMS |

**Important:** Member JWT must **not** grant CMS access. CMS JWT must **not** access `/member/*` endpoints.

---

## 3. Architecture

```
Member browser
    → Next.js BFF (login/logout/message only)
        → Laravel /api/v1/auth/member/* and /api/v1/member/*
    → Next.js Server Components (curated/saved/notes/me)
        → Laravel with Bearer from httpOnly cookie `member_token`

Advisor / admin
    → Laravel admin panel ONLY (not Next.js)
        → Laravel /api/v1/admin/*
        → Auth: POST /api/v1/auth/login (staff token, role admin|editor)
```

**Frontend BFF routes (already live):**

| Next.js route | Proxies to |
|---------------|------------|
| `POST /api/member/login` | `POST /api/v1/auth/member/login` → sets `member_token` cookie |
| `POST /api/member/logout` | `POST /api/v1/auth/member/logout` |
| `POST /api/member/message` | `POST /api/v1/member/message` |

**Server-side reads (no BFF — token from cookie):**

- `GET /api/v1/auth/member/me`
- `GET /api/v1/member/curated`
- `GET /api/v1/member/saved`
- `GET /api/v1/member/notes`

---

## 4. Database (minimum schema)

### Extend `users`

| Column | Type | Notes |
|--------|------|-------|
| `role` | enum | Add `member` alongside `admin`, `editor`, `viewer` |
| `assigned_advisor_id` | FK → users.id, nullable | Member’s advisor |
| `invitation_status` | enum | `pending`, `active`, `suspended` |
| `salutation` | string, nullable | e.g. `"Mr."` — used in welcome hero |
| `preferred_locale` | string | default `en` |

Members with `invitation_status != active` or inactive account → **403 on login**.

### Table: `saved_properties`

| Column | Type |
|--------|------|
| `id` | PK |
| `user_id` | FK → users (member) |
| `property_id` | FK → properties |
| `created_at` | timestamp |

**Unique:** `(user_id, property_id)`

### Table: `curated_selections`

| Column | Type |
|--------|------|
| `id` | PK |
| `user_id` | FK → users (member) |
| `advisor_id` | FK → users (advisor) |
| `property_id` | FK → properties, nullable |
| `project_id` | FK → off-plan projects, nullable |
| `title` | string |
| `note` | text, nullable |
| `is_released` | boolean, default false |
| `released_at` | timestamp, nullable |
| `created_at` | timestamp |

Exactly one of `property_id` or `project_id` must be set.

### Table: `advisor_notes`

| Column | Type |
|--------|------|
| `id` | PK |
| `user_id` | FK → users (member) |
| `advisor_id` | FK → users (advisor) |
| `title` | string |
| `content` | text |
| `created_at` | timestamp |

---

## 5. Member authentication API

Base: `/api/v1/auth/member`

### POST `/auth/member/login`

**Body:**
```json
{
  "email": "member@example.com",
  "password": "secret"
}
```

**Response `200`:**
```json
{
  "token": "jwt-string",
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
      "name": "Sara N.",
      "email": "sara@niprealty.com",
      "availability": "Mon–Fri | Responds within hours"
    }
  },
  "expiresAt": "2026-06-20T10:00:00Z"
}
```

**Errors:**

| HTTP | Code | When |
|------|------|------|
| 401 | `INVALID_CREDENTIALS` | Wrong email/password |
| 403 | `NOT_A_MEMBER` | User is admin/editor, not member |
| 403 | `ACCOUNT_INACTIVE` | Account disabled |
| 403 | `INVITATION_PENDING` | Not activated yet |

**Notes for Laravel:**
- Frontend stores `token` in httpOnly cookie `member_token` (7 days)
- Single-item `user` may be wrapped as `{ data: user }` — frontend unwraps via `unwrapData()` if needed

---

### POST `/auth/member/logout`

**Headers:** `Authorization: Bearer {token}`  
**Response:** `204 No Content`

---

### GET `/auth/member/me`

**Headers:** `Authorization: Bearer {token}`  

**Response `200`:** Same `user` object shape as login (without token).

**Errors:** `401` if missing/expired token; `403` if token is CMS/admin user, not member.

---

## 6. Member data API

Base: `/api/v1/member`  
**Auth:** Bearer token, `role = member`  
**Scope:** Every query MUST filter `user_id = authenticated member.id`

**Optional query param on all reads:** `locale=en|ar` (default member’s `preferredLocale`)

### Pagination shape (required by frontend)

Member list endpoints must **not** use Laravel’s default `{ data, meta, links }` wrapper alone. The frontend expects:

```json
{
  "items": [ ... ],
  "total": 6,
  "page": 1,
  "totalPages": 1
}
```

Query params: `page` (default 1), `limit` (default 12; dashboard uses `limit=3`; curated page should use `limit=20` once frontend is updated).

**Important:** Member list endpoints use `limit`, **not** `per_page` (catalog uses `per_page`).

### JSON field naming (member APIs)

| Layer | Convention | Examples |
|-------|------------|----------|
| Member profile, curated wrapper, notes, pagination | **camelCase** | `displayName`, `releasedAt`, `savedAt`, `createdAt`, `totalPages` |
| Nested `property` / `project` objects | **snake_case** | Same shape as `GET /api/v1/properties` (`PropertyResource`) |

Nested property must include at minimum for cards to render:

- `id`, `slug`, `title`, `listing_type`, `type`, `price`, `bedrooms`, `bathrooms`, `area_sqft`, `location`, `image_url`, `handover_quarter` (off-plan)
- Optional: `area: { id, name, slug }`, `developers[]`

Do **not** use camelCase on nested properties (`primaryImage`, `areaSqft`, etc.) — the frontend mapper expects snake_case.

---

### GET `/member/curated`

Returns **released only:** `is_released = true`, ordered by `released_at DESC`.

**Response item shape:**
```json
{
  "id": 10,
  "title": "Palm Jumeirah Residence",
  "note": "Pre-launch access secured. Direct frontage...",
  "releasedAt": "2026-05-22T10:00:00Z",
  "type": "property",
  "property": {
    "id": 100,
    "slug": "palm-jumeirah-villa",
    "title": "Luxury Palm Villa",
    "type": "villa",
    "listing_type": "sale",
    "price": 15000000,
    "bedrooms": 5,
    "bathrooms": 6,
    "area_sqft": 8500,
    "location": "Palm Jumeirah, Dubai",
    "image_url": "https://cdn.niprealty.com/properties/palm-villa.jpg",
    "handover_quarter": null,
    "area": {
      "id": 1,
      "slug": "palm-jumeirah",
      "name": "Palm Jumeirah"
    }
  },
  "project": null,
  "advisor": {
    "id": 2,
    "name": "Sara N."
  }
}
```

For off-plan: `"type": "project"`, `property: null`, `project: { ... }` with `listing_type: "offplan"`, `slug`, `title`, `handover_quarter`, `image_url`, `area`, `developers`.

**Rules:**
- Unreleased selections never appear here
- If listing is sold or unpublished, still return the item (frontend may show subtle unavailable state later)
- `title` / `note` on the selection override card display; `note` maps to card excerpt
- `slug` on nested property/project is required for card links to work

**Frontend usage:**
- Dashboard: `GET /member/curated?limit=3`
- Curated page: `GET /member/curated?limit=20`

---

### GET `/member/saved`

**Response item:**
```json
{
  "savedAt": "2026-05-10T09:15:00Z",
  "property": {
    "id": 100,
    "slug": "palm-jumeirah-villa",
    "title": "Luxury Palm Villa",
    "type": "villa",
    "listing_type": "sale",
    "price": 15000000,
    "bedrooms": 5,
    "bathrooms": 6,
    "area_sqft": 8500,
    "location": "Palm Jumeirah, Dubai",
    "image_url": "https://cdn.niprealty.com/properties/palm-villa.jpg",
    "area": {
      "id": 1,
      "slug": "palm-jumeirah",
      "name": "Palm Jumeirah"
    }
  }
}
```

Property fields should match your existing `GET /properties` list item shape.

---

### POST `/member/saved`

**Body (frontend sends snake_case):**
```json
{
  "property_id": 100
}
```

**Response `201`:**
```json
{
  "id": 5,
  "propertyId": 100,
  "savedAt": "2026-06-13T12:00:00Z"
}
```

**Errors:** `404` property not found; `409 ALREADY_SAVED` duplicate.

*(Save button on property detail pages is planned — endpoint should exist now.)*

---

### DELETE `/member/saved/{propertyId}`

**Response:** `204`  
**Error:** `404` if not in member’s list.

---

### GET `/member/notes`

**Response item:**
```json
{
  "id": 7,
  "title": "Why this Palm Jumeirah residence",
  "content": "Pre-launch access secured...",
  "createdAt": "2026-05-22T10:00:00Z",
  "advisor": {
    "id": 2,
    "name": "Sara N."
  }
}
```

Ordered by `created_at DESC`.

---

### POST `/member/message`

**Body:**
```json
{
  "subject": "Question on curated selection",
  "message": "Can we arrange a private viewing?",
  "locale": "en",
  "relatedPropertyId": 100,
  "relatedProjectId": null,
  "relatedCuratedId": 10
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `subject` | Yes | max 255 |
| `message` | Yes | body text |
| `locale` | No | for confirmation message language |
| `relatedPropertyId` | No | link to property |
| `relatedProjectId` | No | link to off-plan project |
| `relatedCuratedId` | No | link to curated item |

**Backend behavior:**
1. Verify member has `assigned_advisor_id`
2. Create lead (recommend `leadType: member_message`) with `assigned_to = advisor`
3. Pre-fill member name/email from auth user

**Response `201`:**
```json
{
  "id": 99,
  "message": "Your message has been sent. Sara typically responds within hours."
}
```

**Error:** `403 NO_ADVISOR_ASSIGNED` if no advisor on member record.

---

## 7. Admin / Advisor API (Laravel dashboard only)

These endpoints power the **Laravel admin panel** — how advisors and admins manage Private Office members. The **Next.js website does not call these routes.**

### Who uses what

| Consumer | Auth | Endpoints |
|----------|------|-----------|
| Next.js member pages | `member_token` → Bearer | `/auth/member/*`, `/member/*` |
| Next.js CMS inline edit | `cms_token` → Bearer | `/blocks`, `/media`, `/auth/me` |
| **Laravel advisor dashboard** | Staff Bearer from `POST /auth/login` | **`/admin/*` below** |

### Auth

- **Login:** `POST /api/v1/auth/login` (same as CMS staff — `admin@niprealty.com`, `advisor@niprealty.com`)
- **Header:** `Authorization: Bearer {staff_token}`
- **Roles:** `admin` = all members; `editor` = only members where `assigned_advisor_id = current user.id`
- **Must not** accept member tokens on `/admin/*`

### Admin endpoint summary

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/members` | List members (paginated, filterable) |
| POST | `/admin/members` | Create / invite member |
| GET | `/admin/members/:memberId` | Member detail + advisor assignment |
| PATCH | `/admin/members/:memberId` | Update member, assign advisor, suspend |
| GET | `/admin/members/:memberId/curated` | All curated items incl. drafts |
| POST | `/admin/members/:memberId/curated` | Add curated selection |
| PATCH | `/admin/curated/:curatedId/release` | Release / unrelease to member |
| PATCH | `/admin/curated/:curatedId` | Edit title, note (optional) |
| DELETE | `/admin/curated/:curatedId` | Remove selection |
| GET | `/admin/members/:memberId/notes` | List advisor notes for member |
| POST | `/admin/members/:memberId/notes` | Create note |
| PATCH | `/admin/notes/:noteId` | Edit note |
| DELETE | `/admin/notes/:noteId` | Delete note |
| GET | `/admin/members/:memberId/saved` | View member's saved properties (read-only) |
| GET | `/admin/messages` | Inbox: messages from `POST /member/message` |
| PATCH | `/admin/messages/:messageId` | Mark read / status (optional) |

Admin list endpoints may use Laravel standard pagination `{ data, meta, links }` **or** the member `{ items, total, page, totalPages }` shape — Laravel panel can adapt either way.

---

### GET `/admin/members`

List Private Office members.

**Query params (optional):**

| Param | Description |
|-------|-------------|
| `page`, `limit` | Pagination |
| `search` | Filter by name or email |
| `advisor_id` | Filter by assigned advisor (admin only) |
| `invitation_status` | `pending`, `active`, `suspended` |

**Editor scope:** Return only members where `assigned_advisor_id = current user.id`.

**Response item (example):**
```json
{
  "id": 5,
  "email": "member@example.com",
  "name": "Kamyar",
  "displayName": "Mr. Kamyar",
  "salutation": "Mr.",
  "role": "member",
  "invitationStatus": "active",
  "preferredLocale": "en",
  "assignedAdvisorId": 2,
  "advisor": {
    "id": 2,
    "name": "Sara N.",
    "email": "advisor@niprealty.com"
  },
  "curatedReleasedCount": 3,
  "curatedDraftCount": 1,
  "createdAt": "2026-01-15T10:00:00Z"
}
```

---

### GET `/admin/members/:memberId`

Single member profile for advisor dashboard detail view. Same fields as list item, plus counts for saved properties and notes if useful.

**Errors:** `404` not found; `403` if editor accesses unassigned member.

---

### PATCH `/admin/members/:memberId`

Update member record.

**Body (all optional):**
```json
{
  "name": "Kamyar",
  "salutation": "Mr.",
  "assignedAdvisorId": 2,
  "preferredLocale": "en",
  "invitationStatus": "active",
  "password": "new-temporary-password"
}
```

Use `invitationStatus: "suspended"` to block login. Response: updated member object.

---

### POST `/admin/members`

Create or invite a Private Office member.

**Body:**
```json
{
  "email": "newmember@example.com",
  "name": "Kamyar",
  "salutation": "Mr.",
  "password": "temporary-password",
  "assignedAdvisorId": 2,
  "preferredLocale": "en",
  "invitationStatus": "active"
}
```

**Response `201`:** member record with `id`, `email`, `name`, `role: "member"`, `invitationStatus`.

---

### GET `/admin/members/:memberId/curated`

List all curated selections for a member (**including unreleased drafts**).

**Response:** Same items as `GET /member/curated`, plus on each item:
- `isReleased` (boolean)
- `releasedAt` (nullable)

Nested `property` / `project` use **snake_case** (see section 6).

---

### POST `/admin/members/:memberId/curated`

Add a curated selection for a member.

**Body:**
```json
{
  "propertyId": 100,
  "projectId": null,
  "title": "Palm Jumeirah Residence",
  "note": "Pre-launch access secured.",
  "releaseImmediately": false
}
```

Exactly one of `propertyId` or `projectId`.  
If `releaseImmediately: true`, set `is_released = true` and `released_at = now()`.

**Response `201`:** created selection (with `isReleased`).

---

### PATCH `/admin/curated/:curatedId/release`

Release or hide a curated selection from the member.

**Body:**
```json
{
  "isReleased": true
}
```

When `isReleased` becomes `true`, set `released_at = NOW()`. When `false`, clear or keep `released_at` per your policy.

---

### PATCH `/admin/curated/:curatedId` (optional)

Edit draft/released selection metadata without changing release state.

**Body:**
```json
{
  "title": "Updated title",
  "note": "Updated advisor note"
}
```

---

### DELETE `/admin/curated/:curatedId`

**Response:** `204`

---

### GET `/admin/members/:memberId/notes`

List all advisor notes for a member (admin/advisor view).

**Response:** `{ items: [ { id, title, content, createdAt, advisor: { id, name } } ], total, page, totalPages }`

---

### POST `/admin/members/:memberId/notes`

**Body:**
```json
{
  "title": "Why this Palm Jumeirah residence",
  "content": "Pre-launch access secured..."
}
```

**Response `201`:** created note.

---

### PATCH `/admin/notes/:noteId`

**Body:**
```json
{
  "title": "Updated title",
  "content": "Updated content"
}
```

**Response `200`:** updated note. Editor may only edit notes they created or for their assigned members.

---

### DELETE `/admin/notes/:noteId`

**Response:** `204`

---

### GET `/admin/members/:memberId/saved` (read-only)

View properties the member saved — helps advisor during calls.

**Response:** Same shape as `GET /member/saved` for that member.

---

### GET `/admin/messages`

Inbox for member → advisor messages created by `POST /member/message`.

**Query params:** `page`, `limit`, `member_id`, `status` (`new`, `read`, `closed`), `advisor_id`

**Editor scope:** Messages for assigned members only.

**Response item (example):**
```json
{
  "id": 99,
  "subject": "Question on curated selection",
  "message": "Can we arrange a private viewing?",
  "status": "new",
  "createdAt": "2026-06-13T12:00:00Z",
  "member": {
    "id": 5,
    "name": "Kamyar",
    "email": "member@example.com"
  },
  "relatedPropertyId": 100,
  "relatedCuratedId": 10
}
```

Store in `leads` table with `lead_type: member_message`, `assigned_to = member's advisor`.

---

### PATCH `/admin/messages/:messageId` (optional)

Update message status when advisor handles it.

**Body:**
```json
{
  "status": "read"
}
```

---

## 8. Security & business rules

1. **Data isolation** — Member A never sees Member B’s curated, saved, or notes (`403` on tampering).
2. **Curated visibility** — Members see only `is_released = true`. Releasing is a deliberate advisor action.
3. **Auth separation** — Member token ≠ CMS token. Cross-use returns `403`.
4. **Advisor scope** — Editors manage assigned members only; admins manage all.
5. **Sold listings** — Keep in curated/saved even if unpublished; frontend handles display.
6. **Admin routes** — Never exposed to Next.js; Laravel panel only.

**Suggested rate limits:**
- Login: 10/min per IP
- Member reads: 500/min per user
- Messages: 10/hour per member

---

## 9. CORS & environment

**Frontend dev URL:** `http://localhost:3000`  
**Backend dev URL:** `http://127.0.0.1:8000`

CORS must allow:
- Origin: `http://localhost:3000`
- `credentials: true` (cookies if used cross-origin; BFF avoids this for most calls)

**Env on frontend:** `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`

**Image URLs:** Property images may be `http://localhost/storage/...` in local dev.

---

## 10. Error response format

Use consistent JSON errors (frontend parses `message` and `errors`):

```json
{
  "message": "Human readable message",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

Or wrapped:
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have access to this resource"
  }
}
```

Private Office error codes: `INVALID_CREDENTIALS`, `NOT_A_MEMBER`, `ACCOUNT_INACTIVE`, `INVITATION_PENDING`, `NO_ADVISOR_ASSIGNED`, `ALREADY_SAVED`.

---

## 11. Acceptance criteria (definition of done)

Backend is ready when **all** pass:

- [ ] Member logs in → receives JWT; frontend sets `member_token` cookie
- [ ] Invalid login → `401`; inactive/pending member → `403`
- [ ] Admin CMS login cannot call `GET /member/curated` (→ `403`)
- [ ] Member A cannot read Member B’s data
- [ ] Unreleased curated items hidden from `GET /member/curated`
- [ ] `PATCH .../release` makes item visible on next member fetch
- [ ] `GET /member/curated` returns `{ items, total, page, totalPages }` shape
- [ ] `GET /auth/member/me` includes nested `advisor` object
- [ ] `GET /member/notes` returns notes for curated page
- [ ] `POST /member/message` creates lead assigned to member’s advisor
- [ ] `POST /member/saved` + `DELETE /member/saved/{id}` work with duplicate protection
- [ ] Admin can list/create/update members via `/admin/members`
- [ ] Admin can manage curated, release, notes, and read messages via `/admin/*`
- [ ] Editor restricted to assigned members only (members, curated, notes, messages)
- [ ] Nested property objects use snake_case matching `GET /properties`
- [ ] `locale=ar` returns Arabic titles where available on property/project fields

**Smoke test URLs after seeding data:**
- http://localhost:3000/en/private-office — login
- http://localhost:3000/en/private-office/member — dashboard
- http://localhost:3000/en/curated — full view + notes + message

---

## 12. Suggested test data

| User | Role | Purpose |
|------|------|---------|
| `admin@niprealty.com` | admin | CMS + all members |
| `advisor@niprealty.com` | editor | CMS + assigned members only |
| `member@example.com` (create) | member | Private Office login testing |

Seed at least:
- 1 member with `assigned_advisor_id` → advisor user
- 2–3 curated selections (1 released, 1 draft)
- 2 advisor notes
- 1–2 saved properties

---

## 13. Frontend integration status

| Feature | Backend needed | Next.js status |
|---------|----------------|----------------|
| Member login / dashboard / curated / notes / message | Yes | **Wired** |
| Admin member management UI | Yes (`/admin/*`) | **Not built** — Laravel only |
| Property save button on detail pages | Yes (`POST /member/saved`) | **Not wired yet** |
| Member sign out button | Yes (`POST /auth/member/logout`) | BFF exists; **UI pending** |
| Full curated list on `/curated` | Yes | **Bug:** page loads `limit=3`; fix pending |
| `locale` query on member reads | Optional | **Not sent yet** |

---

## 14. Frontend file reference (for debugging)

| Area | Path |
|------|------|
| API client | `lib/api/member.ts` |
| Types | `types/api/member.ts` |
| Member cookie | `lib/member/session.client.ts` (`member_token`) |
| Login BFF | `app/api/member/login/route.ts` |
| Message BFF | `app/api/member/message/route.ts` |
| Login page | `app/[locale]/private-office/page.tsx` |
| Dashboard | `app/[locale]/private-office/member/page.tsx` |
| Curated page | `app/[locale]/curated/page.tsx` |
| Message form | `components/forms/MemberAdvisorMessageForm.tsx` |
| Logout BFF | `app/api/member/logout/route.ts` |

---

## 15. Out of scope (this phase)

- Advisor dashboard UI in Next.js (admin panel on Laravel only — **but `/admin/*` API is in scope for Laravel**)
- Password reset email (`POST /auth/member/forgot-password`) — optional later
- FAQ / CMS blocks / catalog APIs — separate specs
- Push/email notifications to advisor on new message

---

## 16. Related docs in frontend repo

| Document | Contents |
|----------|----------|
| `docs/PRIVATE-OFFICE-API-SPEC.md` | Full original spec with cURL examples |
| `docs/BACKEND-API-SPEC.md` | Global API + DB reference |
| `docs/PAGE-ENDPOINT-RENDER-MATRIX.md` | Which pages call which endpoints |
| `docs/CMS-BLOCKS-SYNC.md` | CMS auth (separate from Private Office) |

---

**Questions?** Contact frontend — member pages are ready (section 5–6). Laravel admin panel needs section 7 (`/admin/*`) plus member APIs live with the response shapes documented above.
