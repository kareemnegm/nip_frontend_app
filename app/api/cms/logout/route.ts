import { NextResponse } from "next/server";
import { logoutStaff } from "@/lib/api/cms-auth";
import { getCmsToken } from "@/lib/cms/auth.server";
import { CMS_TOKEN_COOKIE } from "@/lib/cms/session.client";

export async function POST() {
  const token = await getCmsToken();
  if (token) {
    try {
      await logoutStaff(token);
    } catch {
      /* clear cookie anyway */
    }
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(CMS_TOKEN_COOKIE);
  return response;
}
