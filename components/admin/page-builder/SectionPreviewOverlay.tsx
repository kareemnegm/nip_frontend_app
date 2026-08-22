"use client";

import { useEffect } from "react";
import { PreviewFrame } from "@/components/admin/page-builder/PreviewFrame";
import { Icon } from "@/components/ui/Icon";

type SectionPreviewOverlayProps = {
  title: string;
  src: string;
  onClose: () => void;
};

export function SectionPreviewOverlay({ title, src, onClose }: SectionPreviewOverlayProps) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} preview`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-basalt-600/70 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative z-10 flex w-full max-w-[1200px] flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-body-lg font-semibold text-white">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-field)] bg-white px-3 py-1.5 text-label-semibold font-semibold text-brand transition-colors hover:bg-sapphire-50"
          >
            <Icon name="close" className="h-3.5 w-3.5" />
            Close
          </button>
        </div>
        <PreviewFrame src={src} title={`${title} preview`} heightClassName="h-[72vh]" />
      </div>
    </div>
  );
}
