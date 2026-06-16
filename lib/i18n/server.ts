import "server-only";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, type Locale } from "./config";
import { resolveLocale } from "./helpers";

/** Resolve active locale on the server (cookie set by middleware). */
export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}
