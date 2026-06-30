# FAQ + Legal CMS Migration Plan

## Status
- [ ] Draft  [x] Approved  [x] Implemented  [ ] Verified

## Source
- Frontend handoff: `FAQ-LEGAL-CMS-BACKEND-HANDOFF.md`
- Copy fallbacks: `nip_frontend_app/messages/{en,ar}.json`
- CMS blocks plan: `cms-blocks-migration-plan.md` (partial — FAQ/Legal keys + seeds missing)

## Target API

### CMS blocks (extend existing module)
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/api/v1/blocks?relUrl=&locale=` | public | Page blocks (already live) |
| POST | `/api/v1/blocks` | sanctum + cms.write | Upsert block (already live) |
| DELETE | `/api/v1/blocks` | sanctum + cms.write | Delete block (already live) |
| POST | `/api/v1/media` | sanctum + cms.write | Image upload (already live) |

### FAQ accordion (new module)
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/api/v1/faqs?locale=&category=` | public | Active FAQs, localized |
| GET | `/api/v1/admin/faqs` | sanctum + admin.role | List all FAQs (raw translations) |
| POST | `/api/v1/admin/faqs` | sanctum + admin.role | Create FAQ |
| PUT | `/api/v1/admin/faqs/{id}` | sanctum + admin.role | Update FAQ |
| DELETE | `/api/v1/admin/faqs/{id}` | sanctum + admin.role | Delete FAQ |

## Schema

### `cms_blocks` (existing)
- Expand allowlist for `/legal` (18 keys including `compliance-image`)
- Seed EN + AR TEXT blocks for `/faq` (5 keys) and `/legal` (17 TEXT keys)

### `faqs` (new)
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `question` | JSON | `{"en":"...","ar":"..."}` |
| `answer` | JSON | same |
| `category` | VARCHAR nullable | e.g. `general` |
| `sort_order` | INTEGER | display order |
| `is_active` | BOOLEAN | default true |
| timestamps | | |

Index: `(is_active, sort_order)`

## Business rules
- Public FAQs: `is_active = true`, ordered by `sort_order`
- Locale: resolve via `LocaleResolver`; fallback EN when AR missing
- CMS block keys validated against `config/cms-blocks.php`
- `compliance-image` IMAGE block on `/legal` — no default seed; staff uploads via inline editor

## Seed data
- FAQ accordion: 5 items from `pages.faq.items` (EN + AR)
- FAQ CMS blocks: `placeholders.faq` (EN + AR)
- Legal CMS blocks: `placeholders.legal.hero` + `pages.legal` sections/sidebar (EN + AR)

## Implementation checklist
- [ ] Expand `/legal` allowlist in `config/cms-blocks.php`
- [ ] `CmsBlockDefaultsSeeder` + register in `DatabaseSeeder`
- [ ] `faqs` migration, model, repository, service, controllers, requests, resource
- [ ] Routes + `RepositoryServiceProvider` binding
- [ ] `FaqSeeder` + register in `DatabaseSeeder`
- [ ] Feature tests

## Parity acceptance
- [ ] `GET /blocks?relUrl=/faq&locale=en` returns 5 seeded blocks
- [ ] `GET /blocks?relUrl=/legal&locale=ar` returns 17 TEXT blocks
- [ ] `GET /faqs?locale=en` returns 5 items with `total: 5`
- [ ] `GET /faqs?locale=ar` returns Arabic Q&A
- [ ] `is_active=false` excluded from public list
- [ ] Admin CRUD works for editor role
- [ ] POST `/legal` · `sidebar-title` block accepted

## Dependencies
- Phase 1 Auth (Sanctum)
- CMS blocks module (live)

## Postman folder
`Public/FAQ`, `Admin/FAQ`, `CMS Blocks`
