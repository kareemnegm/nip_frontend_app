---
name: nip-architecture
description: NIP Reality frontend architecture — folder structure, backend API integration, editable CMS blocks, and reference project mapping. Use when planning features, adding API helpers, implementing editable sections, or questions about project structure.
---

# NIP Architecture

## Docs (read first)

1. `docs/ARCHITECTURE.md`
2. `docs/EDITABLE-BLOCKS.md`
3. `docs/JIMMY-WORKFLOW.md`

## Folder roles

| Folder | Purpose |
|--------|---------|
| `app/` | Routes, layouts |
| `components/` | UI + hooks |
| `lib/api/` | Backend HTTP client |
| `server/` | Server-only utils (no DB) |
| `types/` | Shared types |

## Data layer

**Backend REST only.** Client: `lib/api/client.ts`.

```typescript
import { apiFetch } from "@/lib/api/client";
```

Suggested helpers to add as needed:

- `lib/api/blocks.ts` — CMS blocks CRUD
- `lib/api/auth.ts` — login/session

## Editable sections pattern

From reference `c:\laragon\www\website`:

- Each slot: `(relUrl, blockKey)`
- Server: `EditableText` / `EditableImage` load from backend
- Client: admin UI saves → backend → `router.refresh()`

Full spec: `docs/EDITABLE-BLOCKS.md`

## Reference vs NIP

| Take from reference | Skip |
|--------------------|------|
| Page section layout | Prisma |
| EditableText/Image UX | `server/db.ts` |
| blockKey conventions | UploadThing in Next.js |
| Admin cookie edit flow | Direct DB in route handlers |

## Env

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Copy from `.env.example` → `.env.local`.

## Quality

```bash
npm run check
```
