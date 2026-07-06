"use client";

import { NavigationManager, isFooterZone } from "@/components/admin/NavigationManager";

export default function AdminFooterPage() {
  return (
    <NavigationManager
      title="Footer link labels"
      description="Rename footer column titles and link text. URLs stay fixed on the live site. Use SEO to edit meta tags for each destination page."
      zoneFilter={isFooterZone}
    />
  );
}
