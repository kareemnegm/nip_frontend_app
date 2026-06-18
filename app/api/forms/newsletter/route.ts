import { NextResponse } from "next/server";
import { submitNewsletter } from "@/lib/api/forms";
import { getFormSubmitLocale } from "@/lib/i18n/form-locale";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const locale = await getFormSubmitLocale();
    const result = await submitNewsletter(body, { locale });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? Number((error as { status: number }).status)
        : 500;
    const payload =
      error && typeof error === "object"
        ? error
        : { message: "Subscription failed" };
    return NextResponse.json(payload, { status });
  }
}
