"use client";

import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

const DESKTOP_SRC = "/video/home-hero.mp4";
const MOBILE_SRC = "/video/home-hero-mobile.mp4";

const noopSubscribe = () => () => {};

/** False during SSR and hydration, true afterwards — no hydration mismatch. */
function useIsHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Hero background video layered over the still hero image.
 *
 * The source is picked in the browser rather than with <source media> —
 * browsers evaluate those inconsistently and can fetch both files, doubling the
 * cost of the heaviest asset on the page. Rendering nothing until hydration
 * also keeps the video off the critical path, so the still image paints first,
 * and it never downloads at all for reduced-motion or no-JS visitors.
 */
export function HomeHeroVideo() {
  const hydrated = useIsHydrated();
  const [visible, setVisible] = useState(false);

  if (!hydrated) return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  const src = window.matchMedia("(min-width: 768px)").matches
    ? DESKTOP_SRC
    : MOBILE_SRC;

  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={() => setVisible(true)}
      // Fades in over the still image so a slow connection shows the photo
      // rather than an empty sapphire block.
      className={cn(
        "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out",
        visible ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
