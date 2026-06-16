import { NextResponse } from "next/server";
import { loginMember } from "@/lib/api/member";
import { MEMBER_TOKEN_COOKIE } from "@/lib/member/session.client";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const result = await loginMember(body.email, body.password);
    const response = NextResponse.json(result);
    response.cookies.set(MEMBER_TOKEN_COOKIE, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? Number((error as { status: number }).status)
        : 500;
    const message =
      error && typeof error === "object" && "message" in error
        ? String((error as { message: string }).message)
        : "Login failed";
    return NextResponse.json({ message }, { status });
  }
}
