import { NextResponse } from "next/server";
import { addBuilderSection } from "@/lib/api/pages";
import { isApiError } from "@/lib/api/errors";
import { getCmsToken } from "@/lib/cms/auth.server";
import { getSectionDefinition } from "@/lib/page-builder/registry";
import type { BuilderSectionCreatePayload } from "@/types/api/page-builder";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = (await request.json()) as BuilderSectionCreatePayload;
    const definition = getSectionDefinition(body.section_type);
    if (!definition) {
      return NextResponse.json({ error: "Unknown section type" }, { status: 422 });
    }

    const payload: BuilderSectionCreatePayload = {
      ...body,
      data_source: body.data_source ?? definition.dataSource,
      item_limit: body.item_limit ?? definition.defaultLimit ?? 0,
      block_prefix: body.block_prefix ?? `sec-${Date.now()}`,
    };

    const result = await addBuilderSection(id, payload, token);
    return NextResponse.json(result);
  } catch (error) {
    if (isApiError(error)) {
      return NextResponse.json(
        { error: error.message, errors: error.errors },
        { status: statusFromError(error) },
      );
    }
    const message = error instanceof Error ? error.message : "Add section failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

function statusFromError(error: { status: number }) {
  return error.status >= 400 && error.status < 600 ? error.status : 502;
}
