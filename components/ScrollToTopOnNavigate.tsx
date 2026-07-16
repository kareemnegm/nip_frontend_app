"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { consumePreserveScrollFlag } from "@/lib/navigation/scroll-preserve";
import { scrollPageToTopReliable } from "@/lib/navigation/scroll-to-top";

/**
 * Lives in the locale layout so it survives page transitions.
 * Per-page shells remount MotionRoot and previously skipped scroll-to-top.
 */
function ScrollToTopInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navKey = `${pathname}?${searchParams.toString()}`;
  const prevNavKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return;

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    const previous = prevNavKeyRef.current;
    prevNavKeyRef.current = navKey;

    // First paint of this persistent layout: still force top so deep links
    // without a hash never open mid-page after a client handoff.
    const shouldScroll = previous === null || previous !== navKey;
    if (!shouldScroll) return;

    if (consumePreserveScrollFlag()) return;
    if (window.location.hash) return;

    return scrollPageToTopReliable();
  }, [navKey]);

  return null;
}

export function ScrollToTopOnNavigate() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopInner />
    </Suspense>
  );
}
