import "server-only";

import { cookies } from "next/headers";
import { CMS_TOKEN_COOKIE } from "./session.client";

export async function getCmsToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CMS_TOKEN_COOKIE)?.value ?? null;
}
