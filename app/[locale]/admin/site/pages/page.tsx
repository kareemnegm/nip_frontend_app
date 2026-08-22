"use client";

import { Suspense } from "react";
import { PagesListManager } from "@/components/admin/page-builder/PagesListManager";

export default function AdminPagesPage() {
  return (
    <Suspense fallback={null}>
      <PagesListManager />
    </Suspense>
  );
}
