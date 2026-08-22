"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";

const SAMPLE_WIDTH = 1440;
/** Crop height inside the iframe — shows the top of each real section. */
const SAMPLE_HEIGHT = 720;

type SectionSamplePreviewProps = {
  type: string;
  locale: Locale;
  label: string;
  className?: string;
};

export function SectionSamplePreview({
  type,
  locale,
  label,
  className,
}: SectionSamplePreviewProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.2);
  const [loaded, setLoaded] = useState(false);

  const src = localizedHref(locale, `/admin/site/pages/section-samples/${type}`);

  const measure = useCallback(() => {
    const node = shellRef.current;
    if (!node) return;
    const available = node.clientWidth;
    setScale(available > 0 ? available / SAMPLE_WIDTH : 0.2);
  }, []);

  useEffect(() => {
    measure();
    const node = shellRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure]);

  const frameStyle = useMemo(
    () => ({
      width: `${SAMPLE_WIDTH}px`,
      height: `${SAMPLE_HEIGHT}px`,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
    }),
    [scale],
  );

  const shellHeight = Math.max(96, Math.round(SAMPLE_HEIGHT * scale));

  return (
    <div
      ref={shellRef}
      aria-hidden
      className={cn(
        "relative w-full overflow-hidden rounded-[var(--radius-field)] border border-line bg-white",
        className,
      )}
      style={{ height: `${shellHeight}px` }}
    >
      {loaded ? null : (
        <div className="absolute inset-0 z-10 animate-pulse bg-surface-muted" />
      )}
      <iframe
        src={src}
        title={`${label} preview`}
        loading="lazy"
        tabIndex={-1}
        onLoad={() => setLoaded(true)}
        style={frameStyle}
        className="pointer-events-none block border-0 bg-white"
      />
    </div>
  );
}
