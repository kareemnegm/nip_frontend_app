---
name: nextjs-app-router
description: Next.js 16 App Router conventions for nip_frontend_app — routes, Server Components, API routes, env, and backend fetching. Use when creating pages, layouts, route handlers, SSR, or App Router questions.
---

# Next.js App Router (nip_frontend_app)

## Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Home
├── about/page.tsx      # /about
└── api/                # Optional BFF proxies
    └── [...]/route.ts
```

Path alias: `@/*` → project root.

## Server vs client

| Use Server Component | Use Client Component |
|---------------------|---------------------|
| Data fetch from backend | useState, useEffect |
| Static/SSR content | Event handlers, forms |
| EditableText server part | EditableTextClient |
| SEO metadata | Browser APIs |

## Fetch backend (Server Component)

```typescript
import { apiFetch } from "@/lib/api/client";

export default async function Page() {
  const data = await apiFetch<{ title: string }>("/api/v1/page/home");
  return <h1>{data.title}</h1>;
}
```

## After client mutation

```typescript
"use client";
import { useRouter } from "next/navigation";

const router = useRouter();
await saveBlock(payload);
router.refresh();
```

## Metadata

```typescript
import type { Metadata } from "next";
export const metadata: Metadata = { title: "About" };
```

## Rules

- No `pages/` directory
- No Prisma in this repo
- Env: `NEXT_PUBLIC_API_URL` in `.env.local`

## Docs

- `docs/ARCHITECTURE.md`
