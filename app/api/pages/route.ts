import { NextResponse } from "next/server";
import { createBuilderPage } from "@/lib/api/pages";
import { isApiError } from "@/lib/api/errors";
import { getCmsToken } from "@/lib/cms/auth.server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { validateBuilderPath } from "@/lib/page-builder/reserved-paths";
import type { BuilderPageCreatePayload } from "@/types/api/page-builder";

export async function POST(request: Request) {
  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as BuilderPageCreatePayload;
    const pathError = validateBuilderPath(body.path);
    if (pathError) {
      return NextResponse.json({ error: pathError }, { status: 422 });
    }
    const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
    const result = await createBuilderPage({ ...body, locale }, token);
    return NextResponse.json(result);
  } catch (error) {
    if (isApiError(error)) {
      return NextResponse.json(
        { error: error.message, errors: error.errors },
        { status: error.status },
      );
    }
    const message = error instanceof Error ? error.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
