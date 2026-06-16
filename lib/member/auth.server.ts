import "server-only";

import { cookies } from "next/headers";
import { MEMBER_TOKEN_COOKIE } from "./session.client";

export async function getMemberToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(MEMBER_TOKEN_COOKIE)?.value ?? null;
}
