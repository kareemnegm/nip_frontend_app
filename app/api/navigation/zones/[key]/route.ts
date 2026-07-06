import { NextResponse } from "next/server";
import { updateNavigationZone } from "@/lib/api/navigation";
import { isApiError } from "@/lib/api/errors";
import { getCmsToken } from "@/lib/cms/auth.server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import type { NavigationZoneUpdatePayload } from "@/types/api/navigation";

type RouteContext = { params: Promise<{ key: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await context.params;

  try {
    const body = (await request.json()) as NavigationZoneUpdatePayload & { locale?: string };
    const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
    await updateNavigationZone(
      decodeURIComponent(key),
      {
        locale,
        title: body.title,
        sort_order: body.sort_order,
        is_visible: body.is_visible,
      },
      token,
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isApiError(error)) {
      return NextResponse.json(
        { error: error.message, errors: error.errors },
        { status: error.status },
      );
    }
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
