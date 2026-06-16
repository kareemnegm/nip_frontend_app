import { NextResponse } from "next/server";
import {
  deleteBlock,
  saveBlock,
  type BlockType,
} from "@/lib/api/blocks";
import { isApiError } from "@/lib/api/errors";
import { getCmsToken } from "@/lib/cms/auth.server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

type SaveBody = {
  relUrl: string;
  key: string;
  locale?: string;
  content: string;
  blockType: BlockType;
  elementTag?: string;
};

type DeleteBody = {
  relUrl: string;
  key: string;
  locale?: string;
};

function resolveBodyLocale(value: string | undefined) {
  if (value && isLocale(value)) {
    return value;
  }
  return defaultLocale;
}

export async function POST(request: Request) {
  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SaveBody;
    await saveBlock(
      {
        relUrl: body.relUrl,
        key: body.key,
        locale: resolveBodyLocale(body.locale),
        content: body.content,
        blockType: body.blockType ?? "TEXT",
        elementTag: body.elementTag,
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
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE(request: Request) {
  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as DeleteBody;
    await deleteBlock(
      {
        relUrl: body.relUrl,
        key: body.key,
        locale: resolveBodyLocale(body.locale),
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
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
