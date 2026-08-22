"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import {
  PAGE_FOOTER_ZONE_OPTIONS,
  readNavPlacementFromPage,
  type PageNavPlacementState,
} from "@/lib/page-builder/nav-placement";
import type { BuilderPage } from "@/types/api/page-builder";

type PageNavPlacementPanelProps = {
  pageId: string;
  locale: Locale;
  page: BuilderPage;
  onError: (message: string | null) => void;
  onSaved?: (state: PageNavPlacementState) => void;
};

export function PageNavPlacementPanel({
  pageId,
  locale,
  page,
  onError,
  onSaved,
}: PageNavPlacementPanelProps) {
  const [open, setOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<PageNavPlacementState>(() =>
    readNavPlacementFromPage(page),
  );

  const savePlacement = useCallback(async () => {
    setSaving(true);
    onError(null);

    const label = state.linkLabel.trim() || page.title.trim() || "Page";
    const payload = {
      locale,
      nav_header_enabled: state.headerEnabled,
      nav_footer_enabled: state.footerEnabled,
      nav_footer_zone_key: state.footerZoneKey,
      nav_label: label,
    };

    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to save menu settings");

      const nextState: PageNavPlacementState = { ...state, linkLabel: label };
      setState(nextState);
      onSaved?.(nextState);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to save menu settings");
    } finally {
      setSaving(false);
    }
  }, [locale, onError, onSaved, page.title, pageId, state]);

  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start"
      >
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sapphire-50 text-brand">
            <Icon name="menu" className="h-3.5 w-3.5" />
          </span>
          <span>
            <span className="block text-body-sm font-semibold text-ink">
              Header &amp; footer links
            </span>
            <span className="block text-body-xs text-ink-tertiary">
              Optional — leave both off if visitors should not see this page in the menu
            </span>
          </span>
        </span>
        <span className="flex items-center gap-2">
          {state.headerEnabled || state.footerEnabled ? (
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-label-semibold font-semibold uppercase text-success">
              Active
            </span>
          ) : null}
          <Icon
            name="chevronDown"
            className={cn(
              "h-4 w-4 text-ink-tertiary transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </span>
      </button>

      {open ? (
        <div className="border-t border-line p-4">
          <p className="text-body-xs text-ink-secondary">
            Choose where this page appears in the site navigation. You can turn both off.
            Fine-tune labels and order later in{" "}
            <Link
              href={localizedHref(locale, "/admin/site/navigation")}
              className="font-semibold text-brand hover:underline"
            >
              Menu link labels
            </Link>{" "}
            or{" "}
            <Link
              href={localizedHref(locale, "/admin/site/footer")}
              className="font-semibold text-brand hover:underline"
            >
              Footer link labels
            </Link>
            .
          </p>

          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-label-semibold font-semibold text-ink-secondary">
              Link label
            </span>
            <input
              value={state.linkLabel}
              onChange={(event) =>
                setState((current) => ({ ...current, linkLabel: event.target.value }))
              }
              placeholder={page.title}
              className="h-10 w-full rounded-[var(--radius-field)] border border-border-default bg-white px-3 text-body-sm text-ink outline-none transition placeholder:text-text-inactive focus:border-brand focus:ring-2 focus:ring-sapphire-100"
            />
          </label>

          <div className="mt-4 space-y-3">
            <label className="flex items-start gap-3 rounded-[var(--radius-field)] border border-line bg-surface-muted px-3 py-3">
              <input
                type="checkbox"
                checked={state.headerEnabled}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    headerEnabled: event.target.checked,
                  }))
                }
                className="mt-0.5"
              />
              <span>
                <span className="block text-body-sm font-semibold text-ink">
                  Show in top menu (header)
                </span>
                <span className="block text-body-xs text-ink-tertiary">
                  Adds a link to the main navigation bar
                </span>
              </span>
            </label>

            <div className="rounded-[var(--radius-field)] border border-line bg-surface-muted px-3 py-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={state.footerEnabled}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      footerEnabled: event.target.checked,
                    }))
                  }
                  className="mt-0.5"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-body-sm font-semibold text-ink">
                    Show in website footer
                  </span>
                  <span className="block text-body-xs text-ink-tertiary">
                    Pick which footer column should list this page
                  </span>
                </span>
              </label>

              {state.footerEnabled ? (
                <label className="mt-3 flex flex-col gap-1.5 ps-7">
                  <span className="text-label-semibold font-semibold text-ink-secondary">
                    Footer column
                  </span>
                  <select
                    value={state.footerZoneKey}
                    onChange={(event) =>
                      setState((current) => ({
                        ...current,
                        footerZoneKey: event.target.value as PageNavPlacementState["footerZoneKey"],
                      }))
                    }
                    className="h-10 w-full rounded-[var(--radius-field)] border border-border-default bg-white px-3 text-body-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-sapphire-100"
                  >
                    {PAGE_FOOTER_ZONE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
            </div>
          </div>

          <p className="mt-3 text-body-xs text-ink-tertiary">
            Visitors only see the link after this page is published. Unpublish to hide the
            page while keeping the menu setting ready.
          </p>

          <Button
            className="mt-4"
            size="sm"
            variant="secondary"
            disabled={saving}
            onClick={() => void savePlacement()}
          >
            {saving ? "Saving…" : "Save menu settings"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
