import { NextResponse } from "next/server";
import { logoutMember } from "@/lib/api/member";
import { getMemberToken } from "@/lib/member/auth.server";
import { MEMBER_TOKEN_COOKIE } from "@/lib/member/session.client";

export async function POST() {
  const token = await getMemberToken();
  if (token) {
    try {
      await logoutMember(token);
    } catch {
      /* clear cookie anyway */
    }
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(MEMBER_TOKEN_COOKIE);
  return response;
}
