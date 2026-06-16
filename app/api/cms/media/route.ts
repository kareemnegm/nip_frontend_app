import { NextResponse } from "next/server";
import { uploadMedia } from "@/lib/api/media";
import { isApiError } from "@/lib/api/errors";
import { getCmsToken } from "@/lib/cms/auth.server";

export async function POST(request: Request) {
  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const incoming = await request.formData();
    const file = incoming.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const formData = new FormData();
    formData.append("file", file);
    const alt = incoming.get("alt");
    const folder = incoming.get("folder");
    if (typeof alt === "string" && alt) {
      formData.append("alt", alt);
    }
    if (typeof folder === "string" && folder) {
      formData.append("folder", folder);
    }

    const media = await uploadMedia(formData, token);
    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    if (isApiError(error)) {
      return NextResponse.json(
        { error: error.message, errors: error.errors },
        { status: error.status },
      );
    }
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
