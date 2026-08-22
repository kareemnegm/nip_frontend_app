import { NextResponse } from "next/server";
import { deleteBuilderPage, updateBuilderPage } from "@/lib/api/pages";
import { isApiError } from "@/lib/api/errors";
import { getCmsToken } from "@/lib/cms/auth.server";
import { validateBuilderPath } from "@/lib/page-builder/reserved-paths";
import type { BuilderPageUpdatePayload } from "@/types/api/page-builder";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = (await request.json()) as BuilderPageUpdatePayload;
    if (body.path) {
      const pathError = validateBuilderPath(body.path);
      if (pathError) {
        return NextResponse.json({ error: pathError }, { status: 422 });
      }
    }
    await updateBuilderPage(id, body, token);
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

export async function DELETE(_request: Request, context: RouteContext) {
  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await deleteBuilderPage(id, token);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isApiError(error)) {
      return NextResponse.json(
        { error: error.message, errors: error.errors },
        { status: error.status },
      );
    }
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
