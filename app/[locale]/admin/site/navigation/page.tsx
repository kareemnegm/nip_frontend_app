"use client";

import { NavigationManager, isHeaderZone } from "@/components/admin/NavigationManager";

export default function AdminNavigationPage() {
  return (
    <NavigationManager
      title="Menu link labels"
      description="Rename header menu and dropdown labels. URLs stay fixed on the live site. Use SEO to edit meta tags for each destination page."
      zoneFilter={isHeaderZone}
      showParentKey
    />
  );
}
