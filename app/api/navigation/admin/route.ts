import { NextResponse } from "next/server";
import { getNavigationAdmin } from "@/lib/api/navigation";
import { getCmsToken } from "@/lib/cms/auth.server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export async function GET(request: Request) {
  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale = localeParam && isLocale(localeParam) ? localeParam : defaultLocale;

  try {
    const payload = await getNavigationAdmin(locale, token);
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load navigation";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
