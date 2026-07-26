"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * App Router client navigations do not reload the page, so GTM/GA4 never see
 * them as pageviews. This pushes an explicit `page_view` into the dataLayer on
 * every route change (skipping the first render, which the tag itself counts).
 *
 * In GTM: create a Custom Event trigger on `page_view` and fire the GA4 event
 * tag with page_path / page_location from the dataLayer variables below.
 */
function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    const w = window as Window & { dataLayer?: Record<string, unknown>[] };
    const dataLayer = (w.dataLayer = w.dataLayer ?? []);
    dataLayer.push({
      event: "page_view",
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsRouteTracker() {
  return (
    <Suspense fallback={null}>
      <RouteTracker />
    </Suspense>
  );
}
