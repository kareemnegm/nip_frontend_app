import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { locales } from "@/lib/i18n/config";

/**
 * On-demand cache purge for the Laravel admin.
 *
 * Reads are cached for DEFAULT_REVALIDATE_SECONDS, so an edit only appears once
 * that window expires. The backend should POST here after every publish/update
 * so the change goes live immediately instead of on the next 60s tick.
 *
 *   POST /api/revalidate
 *   x-revalidate-secret: <REVALIDATE_SECRET>
 *   { "paths": ["/developers/beyond", "/developers"] }
 *
 * Paths are locale-agnostic — every locale variant is purged for you.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, message: "REVALIDATE_SECRET is not configured" },
      { status: 501 },
    );
  }

  const provided =
    request.headers.get("x-revalidate-secret") ??
    new URL(request.url).searchParams.get("secret");
  if (provided !== secret) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid secret" },
      { status: 401 },
    );
  }

  let paths: unknown;
  try {
    ({ paths } = (await request.json()) as { paths?: unknown });
  } catch {
    return NextResponse.json(
      { revalidated: false, message: "Body must be JSON" },
      { status: 400 },
    );
  }

  if (!Array.isArray(paths) || paths.some((path) => typeof path !== "string")) {
    return NextResponse.json(
      { revalidated: false, message: "`paths` must be an array of strings" },
      { status: 400 },
    );
  }

  const revalidated: string[] = [];
  for (const rawPath of paths as string[]) {
    const path = rawPath.trim();
    if (!path.startsWith("/")) continue;
    for (const locale of locales) {
      const localized = `/${locale}${path === "/" ? "" : path}`;
      revalidatePath(localized);
      revalidated.push(localized);
    }
  }

  return NextResponse.json({ revalidated: true, paths: revalidated });
}
