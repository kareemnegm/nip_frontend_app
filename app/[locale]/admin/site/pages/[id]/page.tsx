"use client";

import { use } from "react";
import { PageBuilderEditor } from "@/components/admin/page-builder/PageBuilderEditor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function AdminPageEditorPage({ params }: PageProps) {
  const { id } = use(params);
  return <PageBuilderEditor pageId={id} />;
}
