"use client";

import { CmsAuthProvider } from "./CmsAuthProvider";
import { CmsStaffBar } from "./CmsStaffBar";

export function CmsLayoutProviders({ children }: { children: React.ReactNode }) {
  return (
    <CmsAuthProvider>
      {children}
      <CmsStaffBar />
    </CmsAuthProvider>
  );
}
