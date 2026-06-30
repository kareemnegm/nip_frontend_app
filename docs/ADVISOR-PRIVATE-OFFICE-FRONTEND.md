# Private Office & Advisor — Frontend Integration Guide

**Audience:** NIP Reality frontend team (Next.js)  
**Backend repo:** `nip_reality_backend`  
**API base:** `{NEXT_PUBLIC_API_URL}/api/v1`  
**Status:** Implemented and ready for integration  
**Last updated:** June 2026

---

## Table of contents

1. [What this feature is](#1-what-this-feature-is)
2. [What the frontend builds vs what backend handles](#2-what-the-frontend-builds-vs-what-backend-handles)
3. [Environment & auth](#3-environment--auth)
4. [Member API (your main work)](#4-member-api-your-main-work)
5. [Admin / advisor API (usually not frontend)](#5-admin--advisor-api-usually-not-frontend)
6. [Pages → endpoints mapping](#6-pages--endpoints-mapping)
7. [Frontend checklist](#7-frontend-checklist)
8. [TypeScript shapes](#8-typescript-shapes)
9. [Errors & edge cases](#9-errors--edge-cases)
10. [Local dev & test accounts](#10-local-dev--test-accounts)
11. [Related docs](#11-related-docs)

---

## 1. What this feature is

**Private Office** is an invitation-only member area on the public website. After login, a member sees:

- Their assigned **advisor** (name, email, availability)
- **Curated selections** — properties/off-plan projects picked by the advisor
- **Saved properties** — listings the member bookmarked
- **Advisor notes** — private written context from the advisor
- **Message advisor** — send a question directly to the assigned advisor

**Advisors do not use the Next.js site.** They manage members through the Laravel **Blade admin** at `/admin/members` (or the admin REST API if you build a separate admin SPA — not required today).

---

## 2. What the frontend builds vs what backend handles

| Responsibility | Owner | Notes |
|----------------|-------|-------|
| Member login / logout / session | **Frontend** | Store Sanctum token; protect member routes |
| Member dashboard & curated pages | **Frontend** | Call member read APIs |
| Message advisor form | **Frontend** | `POST /member/message` |
| Save property button (future) | **Frontend** | `POST /DELETE /member/saved` |
| Create members, assign advisor | **Backend admin** | `/admin/members` — not Next.js |
| Add / release curated selections | **Backend admin** | Advisor workflow in Blade |
| Write / delete advisor notes | **Backend admin** | Advisor workflow in Blade |
| Receive member messages | **Backend admin** | Stored as leads assigned to advisor |

**You do not need to build an advisor dashboard in Next.js** unless product explicitly asks for one later.

---

## 3. Environment & auth

### Environment variables

```env
# Frontend .env.local
NEXT_PUBLIC_API_URL=http://nip_reality_backend.test
# or http://127.0.0.1:8000

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Backend `.env` must include your frontend origin in `CORS_ALLOWED_ORIGINS`.

### Two separate auth systems — do not mix tokens

| User | Login endpoint | Token scope | Used for |
|------|----------------|-------------|----------|
| **Member** | `POST /auth/member/login` | Private Office only | `/member/*`, `/auth/member/me` |
| **CMS staff** (admin/editor) | `POST /auth/login` | CMS + admin API | `/admin/*`, CMS blocks |

- A **member token** calling `/member/*` → OK  
- A **CMS token** calling `/member/*` → `403 FORBIDDEN`  
- A **member token** calling `/admin/*` → `403 FORBIDDEN`

### Request headers (all member calls)

```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json   # on POST bodies
```

### Login cookies (optional)

On successful member login, the backend also sets HttpOnly cookies:

| Cookie | Purpose |
|--------|---------|
| `auth_token` | Same Sanctum token (HttpOnly) |
| `member` | `"1"` — quick flag for member UI |

If you use a **Next.js BFF** (recommended for login/logout/message), the BFF can store the token in an httpOnly `member_token` cookie and attach `Authorization` on server-side fetches.

### Naming convention

**Member APIs use camelCase** in JSON request/response fields (`displayName`, `propertyId`, `releasedAt`, etc.).

Public catalog APIs use **snake_case** (`image_url`, `listing_type`). Do not assume one convention everywhere.

### Pagination (member lists)

Member list endpoints return this shape — **not** Laravel’s `{ data, meta, links }`:

```json
{
  "items": [ ... ],
  "total": 6,
  "page": 1,
  "totalPages": 1
}
```

Query params: `page` (default `1`), `limit` (default `12`, max `50`).

---

## 4. Member API (your main work)

Base paths:

- Auth: `/api/v1/auth/member`
- Data: `/api/v1/member`

All `/member/*` routes require `auth:sanctum` + `role = member`.

---

### POST `/auth/member/login`

Member sign-in from `/private-office`.

**Request:**

```json
{
  "email": "member@niprealty.com",
  "password": "member-password"
}
```

**Response `200`:**

```json
{
  "token": "1|abc...",
  "user": {
    "id": 3,
    "email": "member@niprealty.com",
    "name": "Kamyar",
    "salutation": "Mr.",
    "displayName": "Mr. Kamyar",
    "role": "member",
    "preferredLocale": "en",
    "advisor": {
      "id": 2,
      "name": "Sara N.",
      "email": "advisor@niprealty.com",
      "availability": "Mon–Fri | Responds within hours"
    }
  },
  "expiresAt": "2026-06-17T12:00:00+00:00"
}
```

**Frontend actions:**

- Store `token` (cookie or secure storage)
- Redirect to `/[locale]/private-office/member`
- Show inline error on failure (see [Errors](#9-errors--edge-cases))

`advisor` may be omitted if no advisor is assigned yet — handle `null`/missing gracefully in the UI.

---

### POST `/auth/member/logout`

**Auth:** Bearer member token  
**Response:** `204 No Content`

Clears session server-side. Frontend should delete local token/cookies and redirect to `/private-office`.

---

### GET `/auth/member/me`

**Auth:** Bearer member token

**Response `200`:** Same `user` object as login (without `token` / `expiresAt`).

**Use on:**

- `/private-office/member` — welcome hero (`displayName`)
- `/curated` — advisor bar (`user.advisor.name`, `availability`)
- Any page load that needs fresh profile

---

### GET `/member/curated`

Released curated selections only (`is_released = true`), newest first.

**Query:** `?page=1&limit=12` — dashboard preview uses `limit=3`.

**Response item:**

```json
{
  "id": 10,
  "title": "Palm Jumeirah Residence",
  "note": "Pre-launch access secured. Direct frontage...",
  "releasedAt": "2026-05-22T10:00:00+00:00",
  "type": "property",
  "property": {
    "id": 100,
    "slug": "palm-jumeirah-villa",
    "title": "Luxury Palm Villa",
    "propertyType": "villa",
    "listingType": "sale",
    "price": 15000000,
    "currency": "AED",
    "bedrooms": 5,
    "bathrooms": 6,
    "areaSqft": 8500,
    "location": "Palm Jumeirah, Dubai",
    "area": { "slug": "palm-jumeirah", "name": "Palm Jumeirah" },
    "primaryImage": "http://api.example.com/storage/properties/abc.jpg",
    "isFeatured": true,
    "isExclusive": false,
    "isAvailable": true
  },
  "project": null,
  "advisor": { "id": 2, "name": "Sara N." }
}
```

**Rules for UI:**

| Field | UI usage |
|-------|----------|
| `type` | `"property"` or `"project"` (off-plan) |
| `property` / `project` | Exactly one is populated; render the matching card component |
| `title` | Selection title (may differ from listing title) |
| `note` | Card excerpt / advisor context |
| `isAvailable: false` | Show “No longer available” badge; still display the item |
| Unreleased items | Never returned — no frontend filter needed |

Off-plan items: `type: "project"`, `property: null`, `project` populated with `name`, `startingPrice`, `handoverQuarter`, `developer`, `area`, `primaryImage`, `isAvailable`.

---

### GET `/member/saved`

**Query:** `?page=1&limit=12`

**Response item:**

```json
{
  "savedAt": "2026-05-10T09:15:00Z",
  "property": {
    "id": 100,
    "slug": "palm-jumeirah-villa",
    "title": "Luxury Palm Villa",
    "propertyType": "villa",
    "listingType": "sale",
    "price": 15000000,
    "currency": "AED",
    "bedrooms": 5,
    "bathrooms": 6,
    "areaSqft": 8500,
    "location": "Palm Jumeirah, Dubai",
    "primaryImage": "http://...",
    "isAvailable": true
  }
}
```

Use existing `PropertyCard` component; link via `property.slug`.

---

### POST `/member/saved`

Save a property from a detail page (when member is logged in).

**Request:**

```json
{
  "propertyId": 100
}
```

**Response `201`:**

```json
{
  "id": 5,
  "propertyId": 100,
  "savedAt": "2026-06-13T12:00:00+00:00"
}
```

**Errors:** `404 NOT_FOUND`, `409 ALREADY_SAVED`

---

### DELETE `/member/saved/{propertyId}`

**Response:** `204 No Content`  
**Error:** `404` if property not in saved list

---

### GET `/member/notes`

Advisor notes for the curated page.

**Query:** `?page=1&limit=20`

**Response item:**

```json
{
  "id": 7,
  "title": "Why this Palm Jumeirah residence",
  "content": "Pre-launch access secured. Direct frontage...",
  "createdAt": "2026-05-22T10:00:00+00:00",
  "advisor": { "id": 2, "name": "Sara N." }
}
```

**UI:** Show `title`, formatted `createdAt`, `content` as body. Ordered newest first by backend.

---

### POST `/member/message`

Send a message to the member’s assigned advisor (replaces linking to `/contact`).

**Request:**

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
| `subject` | Yes | Max 255 chars |
| `message` | Yes | Body text |
| `locale` | No | `"en"` or `"ar"` — controls confirmation message language |
| `relatedPropertyId` | No | Link to a property |
| `relatedProjectId` | No | Link to off-plan property (same `properties` table) |
| `relatedCuratedId` | No | Link to curated selection |

**Response `201`:**

```json
{
  "id": 99,
  "message": "Your message has been sent. Sara N. typically responds within hours."
}
```

Arabic confirmation when `locale: "ar"`:

> تم إرسال رسالتك. عادةً ما يرد {advisorName} خلال ساعات.

**Error:** `403 NO_ADVISOR_ASSIGNED` — show friendly message if member has no advisor.

**Frontend actions:**

- Wire modal/form submit to this endpoint (direct or via BFF)
- Show success toast with `message` from response
- Disable submit while loading; validate subject + message client-side

---

## 5. Admin / advisor API (usually not frontend)

> **Skip this section** unless you are building a separate admin SPA. Advisors already use `/admin/members` in Laravel Blade.

Base: `/api/v1/admin`  
Auth: Bearer token from `POST /auth/login` (admin or editor role)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/admin/members` | Create member |
| GET | `/admin/members` | List members (editor: assigned only) |
| GET | `/admin/members/{memberId}/curated` | All curated incl. drafts + `isReleased` |
| POST | `/admin/members/{memberId}/curated` | Add curated selection |
| PATCH | `/admin/curated/{curatedId}/release` | Release to member |
| DELETE | `/admin/curated/{curatedId}` | Remove curated item |
| GET | `/admin/members/{memberId}/notes` | List notes |
| POST | `/admin/members/{memberId}/notes` | Create note |
| DELETE | `/admin/notes/{noteId}` | Delete note |

**Create member body (camelCase):**

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

**Add curated body:**

```json
{
  "propertyId": 100,
  "projectId": null,
  "title": "Palm Jumeirah Residence",
  "note": "Pre-launch access secured.",
  "releaseImmediately": false
}
```

**Release body:**

```json
{ "isReleased": true }
```

**Create note body:**

```json
{
  "title": "Why this Palm Jumeirah residence",
  "content": "Pre-launch access secured..."
}
```

Editors may only access members where `assigned_advisor_id` equals their user id.

---

## 6. Pages → endpoints mapping

| Frontend route | APIs to call |
|----------------|--------------|
| `/[locale]/private-office` | `POST /auth/member/login` |
| `/[locale]/private-office/member` | `GET /auth/member/me`, `GET /member/curated?limit=3`, `GET /member/saved?limit=12` |
| `/[locale]/curated` | `GET /auth/member/me`, `GET /member/curated`, `GET /member/notes`, `POST /member/message` |
| Property detail (future) | `POST /member/saved`, `DELETE /member/saved/{propertyId}` |

**Route protection:**

- `/private-office/member` and `/curated` require authenticated member
- Unauthenticated → redirect to `/private-office`
- Use middleware or server-side token check before fetching member APIs

**Suggested BFF routes (if not already wired):**

| Next.js route | Proxies to |
|---------------|------------|
| `POST /api/member/login` | `POST /api/v1/auth/member/login` |
| `POST /api/member/logout` | `POST /api/v1/auth/member/logout` |
| `POST /api/member/message` | `POST /api/v1/member/message` |

Server Components can call read APIs directly with Bearer from httpOnly cookie.

---

## 7. Frontend checklist

Use this as your integration todo list.

### Setup

- [ ] Set `NEXT_PUBLIC_API_URL` in `.env.local`
- [ ] Confirm CORS allows `http://localhost:3000` on backend
- [ ] Run backend seed: `php artisan db:seed --class=MemberDemoSeeder`

### API layer

- [ ] Create `lib/api/member-auth.ts` — `loginMember`, `logoutMember`, `getMemberMe`
- [ ] Create `lib/api/member.ts` — `getCurated`, `getSaved`, `saveProperty`, `unsaveProperty`, `getNotes`, `sendMessage`
- [ ] Create `types/api/member.ts` — interfaces from [TypeScript shapes](#8-typescript-shapes)
- [ ] Helper to attach `Authorization: Bearer` on all member requests

### Login page (`/private-office`)

- [ ] Wire form to `POST /auth/member/login`
- [ ] On success: store token, redirect to `/private-office/member`
- [ ] On error: show message from `error.message` or validation errors
- [ ] Handle `403` codes: `NOT_A_MEMBER`, `ACCOUNT_INACTIVE`, `INVITATION_PENDING`

### Protected routes

- [ ] Guard `/private-office/member` and `/curated`
- [ ] Redirect unauthenticated users to `/private-office`

### Member dashboard

- [ ] Replace hardcoded welcome name with `user.displayName` from `/auth/member/me`
- [ ] Replace hardcoded advisor with `user.advisor` (handle missing advisor)
- [ ] Replace placeholder curated list with `GET /member/curated?limit=3`
- [ ] Replace placeholder saved list with `GET /member/saved`

### Curated page

- [ ] Hero advisor info from `/auth/member/me`
- [ ] Full grid from `GET /member/curated`
- [ ] Notes section from `GET /member/notes`
- [ ] Message modal → `POST /member/message` (not `/contact`)
- [ ] Handle `NO_ADVISOR_ASSIGNED` — hide or disable message CTA

### Optional / future

- [ ] Save button on property detail → `POST /member/saved`
- [ ] Unsave toggle → `DELETE /member/saved/{propertyId}`
- [ ] Show `isAvailable: false` badge on sold/unpublished listings

### Remove placeholders

Replace hardcoded data in (if still present):

- `components/placeholders.ts` — `sampleAdvisorSelection`, `sampleProperties`
- `components/sections/CuratedStorySections.tsx` — `curatedAdvisorNotes`
- `components/sections/PrivateOfficeMemberSections.tsx` — static names

---

## 8. TypeScript shapes

```typescript
// types/api/member.ts

export interface MemberAdvisor {
  id: number;
  name: string;
  email: string;
  availability: string | null;
}

export interface MemberUser {
  id: number;
  email: string;
  name: string;
  salutation: string | null;
  displayName: string;
  role: 'member';
  preferredLocale: string;
  advisor?: MemberAdvisor | null;
}

export interface MemberLoginResponse {
  token: string;
  user: MemberUser;
  expiresAt: string;
}

export interface MemberPaginated<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface MemberPropertyCard {
  id: number;
  slug: string;
  title: string;
  propertyType: string;
  listingType: string;
  price: number | null;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqft: number | null;
  location: string | null;
  area?: { slug: string; name: string };
  primaryImage: string | null;
  isFeatured?: boolean;
  isExclusive?: boolean;
  isAvailable: boolean;
}

export interface MemberOffplanCard {
  id: number;
  slug: string;
  name: string;
  startingPrice: number | null;
  currency: string;
  handoverQuarter: string | null;
  status: string;
  primaryImage: string | null;
  developer: { slug: string; name: string } | null;
  area?: { slug: string; name: string };
  isAvailable: boolean;
}

export interface CuratedSelection {
  id: number;
  title: string;
  note: string | null;
  releasedAt: string | null;
  type: 'property' | 'project';
  property: MemberPropertyCard | null;
  project: MemberOffplanCard | null;
  advisor: { id: number; name: string };
}

export interface SavedPropertyItem {
  savedAt: string;
  property: MemberPropertyCard;
}

export interface AdvisorNote {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  advisor: { id: number; name: string };
}

export interface MemberMessageRequest {
  subject: string;
  message: string;
  locale?: 'en' | 'ar';
  relatedPropertyId?: number | null;
  relatedProjectId?: number | null;
  relatedCuratedId?: number | null;
}

export interface MemberMessageResponse {
  id: number;
  message: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details: unknown[];
  };
}
```

---

## 9. Errors & edge cases

### ApiException format (most business errors)

```json
{
  "error": {
    "code": "NO_ADVISOR_ASSIGNED",
    "message": "No advisor is assigned to your account.",
    "details": []
  }
}
```

### Private Office error codes

| HTTP | Code | When | Frontend action |
|------|------|------|-----------------|
| 401 | `INVALID_CREDENTIALS` | Wrong email/password on login | Show inline error |
| 401 | `UNAUTHORIZED` | Missing/expired token | Redirect to login |
| 403 | `NOT_A_MEMBER` | Admin tried member login | Show “not a member account” |
| 403 | `ACCOUNT_INACTIVE` | Account disabled | Show contact support message |
| 403 | `INVITATION_PENDING` | Not activated yet | Show pending invitation message |
| 403 | `FORBIDDEN` | Wrong token type (CMS vs member) | Clear token, re-login |
| 403 | `NO_ADVISOR_ASSIGNED` | Message without advisor | Disable message form |
| 404 | `NOT_FOUND` | Property/saved item missing | Show not found |
| 409 | `ALREADY_SAVED` | Duplicate save | Show “already saved” |
| 422 | — | Validation failed | Show `errors` per field |

### Validation error (422)

```json
{
  "message": "The subject field is required.",
  "errors": {
    "subject": ["The subject field is required."]
  }
}
```

### UI edge cases

1. **`advisor` is null** — Member logged in but no advisor assigned yet. Hide message CTA or show “Advisor will be assigned soon.”
2. **Empty curated list** — Show empty state; advisor may not have released selections yet.
3. **`isAvailable: false`** — Keep card visible with subtle badge.
4. **Images** — Use `primaryImage` URLs as returned (absolute URLs from backend storage).
5. **Do not use CMS token** for member pages or vice versa.

---

## 10. Local dev & test accounts

### Backend setup

```bash
php artisan migrate
php artisan db:seed --class=MemberDemoSeeder
php artisan storage:link
```

Ensure at least one **published** property exists (seeder attaches demo data to the first published property).

### Test accounts (after `MemberDemoSeeder`)

| Email | Password | Role | Use |
|-------|----------|------|-----|
| `member@niprealty.com` | `member-password` | member | Frontend Private Office login |
| `advisor@niprealty.com` | `advisor-password` | editor | Backend `/admin/members` only |
| `admin@niprealty.com` | (from main seeder) | admin | Full admin access |

### Smoke tests (cURL)

```bash
API=http://127.0.0.1:8000/api/v1

# Login
curl -s -X POST "$API/auth/member/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"member@niprealty.com","password":"member-password"}'

# Use TOKEN from response:
curl -s "$API/auth/member/me" -H "Authorization: Bearer TOKEN"
curl -s "$API/member/curated?limit=3" -H "Authorization: Bearer TOKEN"
curl -s "$API/member/notes" -H "Authorization: Bearer TOKEN"
curl -s "$API/member/saved" -H "Authorization: Bearer TOKEN"

curl -s -X POST "$API/member/message" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","message":"Hello advisor","locale":"en"}'
```

### URLs to verify end-to-end

| URL | Expected |
|-----|----------|
| `http://localhost:3000/en/private-office` | Login works with member account |
| `http://localhost:3000/en/private-office/member` | Shows name, advisor, curated preview, saved |
| `http://localhost:3000/en/curated` | Full curated, notes, message form |
| `http://127.0.0.1:8000/admin/members` | Advisor manages content (backend only) |

---

## 11. Related docs

| File | Use |
|------|-----|
| **This file** | Private Office + advisor — frontend integration |
| [FRONTEND-API-INTEGRATION.md](./FRONTEND-API-INTEGRATION.md) | Full public site API (properties, blogs, forms) |
| [PRIVATE-OFFICE-BACKEND-HANDOFF.md](./PRIVATE-OFFICE-BACKEND-HANDOFF.md) | Extended handoff notes (backend ↔ frontend) |
| [routes/api.php](./routes/api.php) | Authoritative route list |
| [tests/Feature/PrivateOffice/](./tests/Feature/PrivateOffice/) | Behavioral test examples |

**Ignore for integration:** [BACKEND-API-SPEC-frontend.md](./BACKEND-API-SPEC-frontend.md) (unimplemented CMS schema).

---

*Backend team: update this file when member API shapes or routes change.*
