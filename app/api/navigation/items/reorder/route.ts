import { NextResponse } from "next/server";
import { reorderNavigationItems } from "@/lib/api/navigation";
import { isApiError } from "@/lib/api/errors";
import { getCmsToken } from "@/lib/cms/auth.server";
import type { NavigationItemReorderPayload } from "@/types/api/navigation";

export async function POST(request: Request) {
  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as NavigationItemReorderPayload;
    await reorderNavigationItems(body, token);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isApiError(error)) {
      return NextResponse.json(
        { error: error.message, errors: error.errors },
        { status: error.status },
      );
    }
    const message = error instanceof Error ? error.message : "Reorder failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
