import { NextResponse } from "next/server";
import { sendMemberMessage } from "@/lib/api/member";
import { getMemberToken } from "@/lib/member/auth.server";

export async function POST(request: Request) {
  const token = await getMemberToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      subject?: string;
      message?: string;
      locale?: "en" | "ar";
      relatedPropertyId?: number | null;
      relatedProjectId?: number | null;
      relatedCuratedId?: number | null;
    };

    if (!body.subject?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { message: "Subject and message are required" },
        { status: 400 },
      );
    }

    const result = await sendMemberMessage(token, {
      subject: body.subject.trim(),
      message: body.message.trim(),
      locale: body.locale,
      relatedPropertyId: body.relatedPropertyId ?? null,
      relatedProjectId: body.relatedProjectId ?? null,
      relatedCuratedId: body.relatedCuratedId ?? null,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? Number((error as { status: number }).status)
        : 500;
    const payload =
      error && typeof error === "object"
        ? error
        : { message: "Message could not be sent" };
    return NextResponse.json(payload, { status });
  }
}
