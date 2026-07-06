import { NextResponse } from "next/server";
import { createNavigationItem } from "@/lib/api/navigation";
import { isApiError } from "@/lib/api/errors";
import { getCmsToken } from "@/lib/cms/auth.server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import type { NavigationItemCreatePayload } from "@/types/api/navigation";

export async function POST(request: Request) {
  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as NavigationItemCreatePayload;
    const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
    const result = await createNavigationItem({ ...body, locale }, token);
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
