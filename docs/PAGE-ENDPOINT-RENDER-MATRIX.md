# Page Endpoint Render Matrix

This matrix is the runtime source of truth for page rendering vs backend endpoints.

## API Shape Baseline

- Single item endpoints may return `{ data: T }` and must be unwrapped before rendering.
- Paginated lists use Laravel shape: `{ data, links, meta }`.
- Off-plan pages currently use `/properties` with `listing_type=offplan`.

## Route Coverage

| Route | Page File | Endpoint(s) | Required Render Fields | Empty State | Invalid Slug |
|---|---|---|---|---|---|
| `/[locale]` | `app/[locale]/page.tsx` | `GET /home`, `GET /blogs` | `featured_properties`, `areas`, `blogs.data` | Sections render with empty arrays | n/a |
| `/[locale]/properties` | `app/[locale]/properties/page.tsx` | `GET /properties` | `data[]`, `meta.current_page`, `meta.last_page` | `CatalogEmptyState` | n/a |
| `/[locale]/properties/[slug]` | `app/[locale]/properties/[slug]/page.tsx` | `GET /properties/{slug}`, `GET /properties/{slug}/similar` | `title`, `slug`, `price`, `location`, `images[]` | hide optional sections only | `notFound()` |
| `/[locale]/off-plan` | `app/[locale]/off-plan/page.tsx` | `GET /properties?listing_type=offplan` | `data[]`, `meta.*` | `CatalogEmptyState` | n/a |
| `/[locale]/off-plan/[slug]` | `app/[locale]/off-plan/[slug]/page.tsx` | `GET /properties/{slug}` | same as property detail | hide optional sections only | `notFound()` |
| `/[locale]/areas` | `app/[locale]/areas/page.tsx` | `GET /areas` | `data[]`, `meta.*` | `CatalogEmptyState` | n/a |
| `/[locale]/areas/[slug]` | `app/[locale]/areas/[slug]/page.tsx` | `GET /areas/{slug}`, `GET /properties?area={slug}` | `area.name`, `area.slug` | listing empty state | `notFound()` |
| `/[locale]/developers` | `app/[locale]/developers/page.tsx` | `GET /developers` | `data[]`, `meta.*` | `CatalogEmptyState` | n/a |
| `/[locale]/developers/[slug]` | `app/[locale]/developers/[slug]/page.tsx` | `GET /developers/{slug}`, `GET /properties?developer={slug}` | `developer.name`, `developer.slug` | listing empty state | `notFound()` |
| `/[locale]/insights` | `app/[locale]/insights/page.tsx` | `GET /blogs`, `GET /blog-categories` | `data[]`, `meta.*`, categories | `CatalogEmptyState` | n/a |
| `/[locale]/insights/[slug]` | `app/[locale]/insights/[slug]/page.tsx` | `GET /blogs/{slug}`, `GET /blogs` | `title`, `slug`, article body | related section hidden when none | `notFound()` |
| `/[locale]/faq` | `app/[locale]/faq/page.tsx` | `GET /faqs` | `question`, `answer` | fallback FAQ set | n/a |
| `/[locale]/private-office` | `app/[locale]/private-office/page.tsx` | member login via BFF | login card UI fields | n/a | n/a |
| `/[locale]/private-office/member` | `app/[locale]/private-office/member/page.tsx` | `GET /auth/member/me`, `GET /member/curated`, `GET /member/saved` | `user`, `items[]` | section empty states | redirects to login |
| `/[locale]/curated` | `app/[locale]/curated/page.tsx` | `GET /member/curated`, `GET /member/notes` | `curated.items`, `notes.items` | section empty states | redirects to login |

## Verification Procedure

1. Hit each endpoint with real slugs and verify required fields are present.
2. Validate one valid and one invalid slug for each detail route.
3. Verify list pagination metadata for every listing route.
4. Open EN and AR variants of each route and confirm render parity.
5. Run `npm run check` after any adapter or mapper change.
