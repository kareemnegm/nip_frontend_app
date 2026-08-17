import { NextResponse } from "next/server";
import { isApiError } from "@/lib/api/errors";
import { submitInsightSubmission } from "@/lib/api/forms";
import { getFormSubmitLocale } from "@/lib/i18n/form-locale";

/** "Contribute an Insight" → `POST /api/v1/insight-submissions`. */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const locale = await getFormSubmitLocale();
    const result = await submitInsightSubmission(formData, { locale });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    // Build the body field by field — `message` is non-enumerable on Error, so
    // serialising the ApiError itself would send the client an empty envelope
    // and lose the 422 field messages the form needs.
    if (isApiError(error)) {
      return NextResponse.json(
        { message: error.message, errors: error.errors },
        { status: error.status },
      );
    }

    return NextResponse.json({ message: "Submission failed" }, { status: 500 });
  }
}
