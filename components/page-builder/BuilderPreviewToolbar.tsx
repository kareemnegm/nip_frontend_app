"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const isStandalone = () => window.self === window.top;
const serverSnapshot = () => false;

type BuilderPreviewToolbarProps = {
  title: string;
  editHref: string;
  pagesHref: string;
  published: boolean;
};

/**
 * Navigation for the preview when it is opened as its own page. Stays hidden
 * inside the builder's iframe, where the surrounding admin chrome already
 * provides these links.
 */
export function BuilderPreviewToolbar({
  title,
  editHref,
  pagesHref,
  published,
}: BuilderPreviewToolbarProps) {
  const standalone = useSyncExternalStore(noopSubscribe, isStandalone, serverSnapshot);

  if (!standalone) return null;

  return (
    <div className="fixed bottom-4 start-1/2 z-50 -translate-x-1/2 rtl:translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full border border-line bg-white px-4 py-2 shadow-[var(--shadow-card)]">
        <span className="flex items-center gap-2">
          <span className="text-body-xs font-semibold text-ink">{title}</span>
          <span className="text-body-xs text-ink-tertiary">
            {published ? "Published" : "Draft preview"}
          </span>
        </span>
        <Link
          href={editHref}
          className="text-body-xs font-semibold text-brand transition-colors hover:text-accent"
        >
          Edit sections
        </Link>
        <Link
          href={pagesHref}
          className="text-body-xs font-semibold text-brand transition-colors hover:text-accent"
        >
          All pages
        </Link>
      </div>
    </div>
  );
}
