/** Marketing / CMS pages — cached until POST /api/revalidate or interval elapses. */
export const STATIC_PAGE_REVALIDATE_SECONDS = 60;

/** Catalog listings (properties, areas, developers) — always fresh. */
export const CATALOG_PAGE_REVALIDATE_SECONDS = 0;
