"use client";

import { useCanEditCms } from "@/components/cms/CmsAuthProvider";

/** @deprecated Use useCanEditCms().canEdit */
export function useIsAdmin(): boolean {
  const { canEdit } = useCanEditCms();
  return canEdit;
}
