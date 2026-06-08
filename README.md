# NIP Reality Frontend

Next.js frontend for the NIP Reality platform. **Open this folder** as your workspace in Cursor.

| | |
|---|---|
| Stack | Next.js 16, React 19, TypeScript, Tailwind v4 |
| Data | External backend REST API (no Prisma in frontend) |

## Quick start

```powershell
npm install
copy .env.example .env.local   # set NEXT_PUBLIC_API_URL when backend is ready
npm run dev
```

Open http://localhost:3000

## Commands

```powershell
npm run dev       # development server
npm run check     # lint + typecheck
npm run build     # production build
```

## Documentation

| Doc | Purpose |
|-----|---------|
| **[docs/WORKING-WITH-JIMMY.md](./docs/WORKING-WITH-JIMMY.md)** | **How to talk to Jimmy (start here)** |
| [AGENTS.md](./AGENTS.md) | Cursor agent rules — Jimmy persona |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Structure and API data flow |
| [docs/JIMMY-WORKFLOW.md](./docs/JIMMY-WORKFLOW.md) | Figma → React workflow |
| [docs/EDITABLE-BLOCKS.md](./docs/EDITABLE-BLOCKS.md) | CMS editable sections |
| [docs/CURSOR-SKILLS.md](./docs/CURSOR-SKILLS.md) | Cursor skills guide |

## Cursor setup

- **Rules:** `.cursor/rules/` — auto-attached project context
- **Skills:** `.cursor/skills/` — figma-to-frontend, react-patterns, nextjs-app-router, nip-architecture

## Reference project

UI/pattern reference: `c:\laragon\www\website` (uses Prisma — NIP uses backend API instead).

## Phases

| Phase | Status |
|-------|--------|
| 1 — Init + folder structure | Done |
| 2 — Docs, Cursor rules/skills | Done |
| 3 — Backend API contract + editable components | Next |
| 4 — Figma page builds | Ongoing |
