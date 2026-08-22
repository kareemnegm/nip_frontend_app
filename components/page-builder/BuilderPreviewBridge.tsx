"use client";

import { useEffect } from "react";

type FocusMessage = {
  source?: string;
  type?: string;
  sectionId?: string;
};

/**
 * Lets the admin builder drive this preview iframe: focusing a section scrolls
 * it into view and flashes an outline so staff can see what they selected.
 */
export function BuilderPreviewBridge() {
  useEffect(() => {
    let clearTimer: ReturnType<typeof setTimeout> | undefined;

    function focusSection(sectionId: string) {
      const target = document.querySelector<HTMLElement>(
        `[data-builder-section="${sectionId}"]`,
      );
      if (!target) return;

      document
        .querySelectorAll<HTMLElement>("[data-builder-section][data-focus='true']")
        .forEach((node) => {
          node.dataset.focus = "false";
        });

      target.dataset.focus = "true";
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (clearTimer) clearTimeout(clearTimer);
      clearTimer = setTimeout(() => {
        target.dataset.focus = "false";
      }, 1800);
    }

    function handleMessage(event: MessageEvent<FocusMessage>) {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || data.source !== "nip-builder") return;
      if (data.type === "focus-section" && data.sectionId) {
        focusSection(data.sectionId);
      }
    }

    window.addEventListener("message", handleMessage);
    window.parent?.postMessage({ source: "nip-preview", type: "ready" }, window.location.origin);

    return () => {
      window.removeEventListener("message", handleMessage);
      if (clearTimer) clearTimeout(clearTimer);
    };
  }, []);

  return null;
}
