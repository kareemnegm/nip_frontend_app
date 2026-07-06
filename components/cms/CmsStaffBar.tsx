"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCanEditCms } from "./CmsAuthProvider";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";

export function CmsStaffBar() {
  const router = useRouter();
  const { locale } = useLocale();
  const { canEdit, user, loading } = useCanEditCms();

  if (loading || !canEdit) {
    return null;
  }

  async function signOut() {
    await fetch("/api/cms/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="fixed bottom-4 end-4 z-50 flex flex-col items-end gap-2">
      <Link
        href={localizedHref(locale, "/admin/site")}
        className="rounded-[var(--radius-field)] border border-line bg-white px-4 py-2 text-[11px] font-semibold text-brand shadow-[var(--shadow-card)] hover:bg-sapphire-50"
      >
        Manage SEO & link labels
      </Link>
      <div className="flex items-center gap-3 rounded-[var(--radius-field)] border border-line bg-white px-4 py-2 shadow-[var(--shadow-card)]">
        <span className="text-[11px] font-medium text-ink-secondary">
          Editing as {user?.name ?? "Staff"}
        </span>
        <button
          type="button"
          onClick={() => void signOut()}
          className="text-[11px] font-semibold text-brand hover:underline"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
