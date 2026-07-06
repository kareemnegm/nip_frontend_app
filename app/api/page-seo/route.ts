import { NextResponse } from "next/server";
import { getPageSeo, listPageSeo, upsertPageSeo } from "@/lib/api/page-seo";
import { isApiError } from "@/lib/api/errors";
import { getCmsToken } from "@/lib/cms/auth.server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import type { PageSeoUpsertPayload } from "@/types/api/page-seo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale = localeParam && isLocale(localeParam) ? localeParam : defaultLocale;
  const path = searchParams.get("path");

  if (path) {
    try {
      const row = await getPageSeo(path, locale);
      return NextResponse.json(row);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load SEO";
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await listPageSeo(locale, token);
    return NextResponse.json(rows);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list SEO";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function PUT(request: Request) {
  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as PageSeoUpsertPayload;
    const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
    await upsertPageSeo({ ...body, locale }, token);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isApiError(error)) {
      return NextResponse.json(
        { error: error.message, errors: error.errors },
        { status: error.status },
      );
    }
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
