import { NextResponse } from "next/server";
import { submitContactInquiry } from "@/lib/api/forms";
import { getFormSubmitLocale } from "@/lib/i18n/form-locale";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const locale = await getFormSubmitLocale();
    const result = await submitContactInquiry(body, { locale });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? Number((error as { status: number }).status)
        : 500;
    const payload =
      error && typeof error === "object"
        ? error
        : { message: "Submission failed" };
    return NextResponse.json(payload, { status });
  }
}
