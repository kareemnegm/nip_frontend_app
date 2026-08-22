"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type PreviewDevice = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<PreviewDevice, number> = {
  desktop: 1440,
  tablet: 834,
  mobile: 390,
};

const DEVICE_LABEL: Record<PreviewDevice, string> = {
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobile",
};

type PreviewFrameProps = {
  src: string;
  title: string;
  /** Bump to force a reload after a change is saved. */
  reloadKey?: number;
  /** Scrolls the preview to this section and flashes an outline. */
  focusSectionId?: string | null;
  /** Visual height of the preview viewport. */
  heightClassName?: string;
  className?: string;
  toolbarExtras?: React.ReactNode;
};

export function PreviewFrame({
  src,
  title,
  reloadKey = 0,
  focusSectionId = null,
  heightClassName = "h-[70vh]",
  className,
  toolbarExtras,
}: PreviewFrameProps) {
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [scale, setScale] = useState(1);
  const [loaded, setLoaded] = useState(false);
  /** Bumped whenever the embedded page announces itself, including after a reload. */
  const [readySignal, setReadySignal] = useState(0);
  const [manualReload, setManualReload] = useState(0);

  const shellRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const deviceWidth = DEVICE_WIDTH[device];

  const measure = useCallback(() => {
    const node = shellRef.current;
    if (!node) return;
    const available = node.clientWidth;
    setScale(available > 0 ? Math.min(1, available / deviceWidth) : 1);
  }, [deviceWidth]);

  useEffect(() => {
    measure();
    const node = shellRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    function handleMessage(event: MessageEvent<{ source?: string; type?: string }>) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.source === "nip-preview" && event.data.type === "ready") {
        setReadySignal((value) => value + 1);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (!focusSectionId || readySignal === 0) return;
    iframeRef.current?.contentWindow?.postMessage(
      { source: "nip-builder", type: "focus-section", sectionId: focusSectionId },
      window.location.origin,
    );
  }, [focusSectionId, readySignal]);

  const frameKey = `${src}-${reloadKey}-${manualReload}`;

  const frameStyle = useMemo(
    () => ({
      width: `${deviceWidth}px`,
      height: `calc(100% / ${scale || 1})`,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
    }),
    [deviceWidth, scale],
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-muted px-3 py-2">
        <div className="flex items-center gap-1 rounded-[var(--radius-field)] border border-line bg-white p-0.5">
          {(Object.keys(DEVICE_WIDTH) as PreviewDevice[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setDevice(option)}
              aria-pressed={device === option}
              className={cn(
                "rounded-[var(--radius-field)] px-3 py-1 text-label-semibold font-semibold transition-colors",
                device === option
                  ? "bg-brand text-white"
                  : "text-ink-tertiary hover:bg-sapphire-50 hover:text-brand",
              )}
            >
              {DEVICE_LABEL[option]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {toolbarExtras}
          <span className="text-body-xs text-ink-tertiary">
            {deviceWidth}px · {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => {
              setLoaded(false);
              setManualReload((value) => value + 1);
            }}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-field)] border border-line bg-white px-2.5 py-1 text-label-semibold font-semibold text-brand transition-colors hover:border-brand"
          >
            <Icon name="arrowRight" className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      <div ref={shellRef} className={cn("relative overflow-hidden bg-surface-muted", heightClassName)}>
        {loaded ? null : (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-muted">
            <span className="text-body-sm text-ink-tertiary">Loading preview…</span>
          </div>
        )}
        <iframe
          key={frameKey}
          ref={iframeRef}
          src={src}
          title={title}
          onLoad={() => setLoaded(true)}
          style={frameStyle}
          className="block border-0 bg-white"
        />
      </div>
    </div>
  );
}
