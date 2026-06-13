import { NextResponse } from "next/server";
import { deleteBlock, saveBlock, type BlockType } from "@/lib/api/blocks";

type SaveBody = {
  relUrl: string;
  key: string;
  content: string;
  blockType: BlockType;
  elementTag?: string;
};

type DeleteBody = {
  relUrl: string;
  key: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SaveBody;
    await saveBlock({
      relUrl: body.relUrl,
      key: body.key,
      content: body.content,
      blockType: body.blockType ?? "TEXT",
      elementTag: body.elementTag,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as DeleteBody;
    await deleteBlock({ relUrl: body.relUrl, key: body.key });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
