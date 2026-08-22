"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSiteShell } from "@/components/admin/AdminSiteShell";
import { PreviewFrame } from "@/components/admin/page-builder/PreviewFrame";
import { SectionCard } from "@/components/admin/page-builder/SectionCard";
import { SectionPalette } from "@/components/admin/page-builder/SectionPalette";
import { SectionPreviewOverlay } from "@/components/admin/page-builder/SectionPreviewOverlay";
import { PageNavPlacementPanel } from "@/components/admin/page-builder/PageNavPlacementPanel";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";
import { SECTION_REGISTRY, getSectionDefinition } from "@/lib/page-builder/registry";
import { normalizeBuilderPath, validateBuilderPath } from "@/lib/page-builder/reserved-paths";
import type { PageNavPlacementState } from "@/lib/page-builder/nav-placement";
import { readNavPlacementFromPage } from "@/lib/page-builder/nav-placement";
import type {
  BuilderPage,
  BuilderPageSection,
  BuilderSectionUpdatePayload,
} from "@/types/api/page-builder";

const BREADCRUMBS = [
  { label: "Site content", href: "/admin/site" },
  { label: "Pages", href: "/admin/site/pages" },
];

async function sendJson(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Something went wrong");
  return data;
}

function nextBlockPrefix(sections: BuilderPageSection[]) {
  const highest = sections.reduce((max, section) => {
    const match = /^sec-(\d+)$/.exec(section.block_prefix);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `sec-${highest + 1}`;
}

function StatusPill({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-label-semibold font-semibold uppercase",
        published ? "bg-success/10 text-success" : "bg-warning/10 text-warning",
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", published ? "bg-success" : "bg-warning")}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function PageBuilderEditor({ pageId }: { pageId: string }) {
  const router = useRouter();
  const { locale } = useLocale();

  const [page, setPage] = useState<BuilderPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addingType, setAddingType] = useState<string | null>(null);
  const [pending, setPending] = useState(0);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [overlaySectionId, setOverlaySectionId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [pathDraft, setPathDraft] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [navPlacement, setNavPlacement] = useState<PageNavPlacementState | null>(null);

  const reloadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPage = useCallback(async () => {
    const res = await fetch(`/api/pages/admin?locale=${locale}`, { cache: "no-store" });
    const data = (await res.json()) as { pages?: BuilderPage[]; error?: string };
    if (!res.ok) throw new Error(data.error ?? "Failed to load page");
    return (data.pages ?? []).find((row) => row.id === pageId) ?? null;
  }, [locale, pageId]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const match = await fetchPage();
        if (!active) return;
        setPage(match);
        setTitleDraft(match?.title ?? "");
        setPathDraft(match?.path ?? "");
        setNavPlacement(match ? readNavPlacementFromPage(match) : null);
        setSelectedId(match?.sections[0]?.id ?? null);
        if (!match) setError("Page not found.");
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load page");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [fetchPage]);

  useEffect(() => {
    return () => {
      if (reloadTimer.current) clearTimeout(reloadTimer.current);
    };
  }, []);

  const schedulePreviewReload = useCallback(() => {
    if (reloadTimer.current) clearTimeout(reloadTimer.current);
    reloadTimer.current = setTimeout(() => setReloadKey((value) => value + 1), 700);
  }, []);

  const run = useCallback(
    async (task: () => Promise<void>) => {
      setPending((value) => value + 1);
      setError(null);
      try {
        await task();
        setSavedAt(Date.now());
        schedulePreviewReload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Save failed");
        try {
          const fresh = await fetchPage();
          setPage(fresh);
        } catch {
          // keep the current view; the error message already explains the failure
        }
      } finally {
        setPending((value) => value - 1);
      }
    },
    [fetchPage, schedulePreviewReload],
  );

  const sections = useMemo(
    () => [...(page?.sections ?? [])].sort((a, b) => a.sort_order - b.sort_order),
    [page],
  );

  const selectedIndex = sections.findIndex((section) => section.id === selectedId);

  const selectSection = useCallback((sectionId: string, scrollCard = false) => {
    setSelectedId(sectionId);
    if (scrollCard) {
      document
        .getElementById(`builder-card-${sectionId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const persistOrder = useCallback(
    (ordered: BuilderPageSection[]) => {
      const renumbered = ordered.map((section, index) => ({
        ...section,
        sort_order: index + 1,
      }));
      setPage((prev) => (prev ? { ...prev, sections: renumbered } : prev));
      void run(async () => {
        await sendJson("/api/pages/sections/reorder", "POST", {
          items: renumbered.map((section) => ({
            id: section.id,
            sort_order: section.sort_order,
          })),
        });
      });
    },
    [run],
  );

  const moveSection = useCallback(
    (section: BuilderPageSection, direction: -1 | 1) => {
      const index = sections.findIndex((row) => row.id === section.id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= sections.length) return;
      const next = [...sections];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      persistOrder(next);
    },
    [persistOrder, sections],
  );

  const patchSection = useCallback(
    (section: BuilderPageSection, patch: BuilderSectionUpdatePayload) => {
      setPage((prev) =>
        prev
          ? {
              ...prev,
              sections: prev.sections.map((row) =>
                row.id === section.id ? ({ ...row, ...patch } as BuilderPageSection) : row,
              ),
            }
          : prev,
      );
      void run(async () => {
        await sendJson(`/api/pages/sections/${section.id}`, "PATCH", patch);
      });
    },
    [run],
  );

  const addSection = useCallback(
    async (type: string) => {
      const definition = getSectionDefinition(type);
      setAddingType(type);
      await run(async () => {
        await sendJson(`/api/pages/${pageId}/sections`, "POST", {
          section_type: type,
          block_prefix: nextBlockPrefix(sections),
          sort_order: sections.length + 1,
          is_visible: true,
          item_limit: definition?.defaultLimit ?? 6,
          data_source: definition?.dataSource ?? "none",
        });
        const fresh = await fetchPage();
        setPage(fresh);
        const added = [...(fresh?.sections ?? [])].sort(
          (a, b) => a.sort_order - b.sort_order,
        )[(fresh?.sections.length ?? 1) - 1];
        if (added) {
          setSelectedId(added.id);
          setExpandedId(added.id);
        }
      });
      setAddingType(null);
    },
    [fetchPage, pageId, run, sections],
  );

  const removeSection = useCallback(
    (section: BuilderPageSection) => {
      const definition = getSectionDefinition(section.section_type);
      const label = definition?.label ?? section.section_type;
      if (!window.confirm(`Remove the "${label}" section from this page?`)) return;
      setPage((prev) =>
        prev
          ? { ...prev, sections: prev.sections.filter((row) => row.id !== section.id) }
          : prev,
      );
      if (selectedId === section.id) setSelectedId(null);
      void run(async () => {
        await sendJson(`/api/pages/sections/${section.id}`, "DELETE");
      });
    },
    [run, selectedId],
  );

  const togglePublish = useCallback(() => {
    if (!page) return;
    const next = !page.is_published;
    setPage((prev) => (prev ? { ...prev, is_published: next } : prev));
    void run(async () => {
      await sendJson(`/api/pages/${page.id}`, "PATCH", { is_published: next });
    });
  }, [page, run]);

  const savePageSettings = useCallback(() => {
    if (!page) return;
    const nextTitle = titleDraft.trim();
    const nextPath = normalizeBuilderPath(pathDraft);
    if (!nextTitle) {
      setError("Give the page a title.");
      return;
    }
    if (nextPath !== page.path) {
      const pathError = validateBuilderPath(nextPath);
      if (pathError) {
        setError(pathError);
        return;
      }
      if (
        !window.confirm(
          `Change the address from ${page.path} to ${nextPath}? Existing links to the old address will stop working.`,
        )
      ) {
        return;
      }
    }
    setPage((prev) => (prev ? { ...prev, title: nextTitle, path: nextPath } : prev));
    void run(async () => {
      await sendJson(`/api/pages/${page.id}`, "PATCH", { title: nextTitle, path: nextPath });
    });
  }, [page, pathDraft, run, titleDraft]);

  const previewSrc = localizedHref(locale, `/admin/site/pages/${pageId}/preview`);
  const overlaySection = sections.find((section) => section.id === overlaySectionId);

  if (loading) {
    return (
      <AdminSiteShell title="Page builder" breadcrumbs={BREADCRUMBS}>
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((key) => (
            <div
              key={key}
              className="h-24 animate-pulse rounded-[var(--radius-card)] border border-line bg-white"
            />
          ))}
        </div>
      </AdminSiteShell>
    );
  }

  if (!page) {
    return (
      <AdminSiteShell title="Page builder" breadcrumbs={BREADCRUMBS}>
        <p className="text-body-sm text-error">{error ?? "Page not found."}</p>
        <Button className="mt-4" href="/admin/site/pages" variant="secondary">
          Back to pages
        </Button>
      </AdminSiteShell>
    );
  }

  return (
    <AdminSiteShell
      width="wide"
      stickyHeader
      breadcrumbs={[...BREADCRUMBS, { label: page.title }]}
      title={page.title}
      titleMeta={
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="rounded-[var(--radius-field)] bg-sapphire-50 px-2 py-0.5 text-body-xs text-brand">
            {page.path}
          </span>
          <StatusPill published={page.is_published} />
          {navPlacement?.headerEnabled ? (
            <span className="rounded-full bg-sapphire-50 px-2 py-0.5 text-label-semibold font-semibold uppercase text-brand">
              Header
            </span>
          ) : null}
          {navPlacement?.footerEnabled ? (
            <span className="rounded-full bg-sapphire-50 px-2 py-0.5 text-label-semibold font-semibold uppercase text-brand">
              Footer
            </span>
          ) : null}
          <span className="text-body-xs text-ink-tertiary">
            {sections.length} {sections.length === 1 ? "section" : "sections"}
          </span>
          <span className="text-body-xs text-ink-tertiary">
            {pending > 0
              ? "Saving…"
              : savedAt
                ? "All changes saved"
                : "Changes save automatically"}
          </span>
        </div>
      }
      actions={
        <>
          {page.is_published ? (
            <Button variant="text" size="sm" href={page.path}>
              Open live page
            </Button>
          ) : null}
          <Button variant="secondary" size="sm" onClick={togglePublish}>
            {page.is_published ? "Unpublish" : "Publish now"}
          </Button>
          <Button
            size="sm"
            onClick={() =>
              router.push(localizedHref(locale, `/admin/site/pages?done=${page.id}`))
            }
          >
            Finish
          </Button>
        </>
      }
    >
      {error ? (
        <p className="mb-4 rounded-[var(--radius-field)] border border-error/30 bg-error/5 px-4 py-3 text-body-sm text-error">
          {error}
        </p>
      ) : null}

      {sections.length > 0 ? (
        <div className="mb-4 flex items-center gap-2 overflow-x-auto rounded-[var(--radius-card)] border border-line bg-white px-3 py-2">
          <span className="shrink-0 text-label-semibold font-semibold uppercase text-ink-tertiary">
            Jump to
          </span>
          {sections.map((section, index) => {
            const definition = getSectionDefinition(section.section_type);
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => selectSection(section.id, true)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-label-semibold font-semibold transition-colors",
                  selectedId === section.id
                    ? "bg-brand text-white"
                    : "bg-sapphire-50 text-ink-tertiary hover:text-brand",
                )}
              >
                {index + 1}. {definition?.label ?? section.section_type}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <section className="rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
            <button
              type="button"
              onClick={() => setSettingsOpen((value) => !value)}
              aria-expanded={settingsOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start"
            >
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sapphire-50 text-brand">
                  <Icon name="pencil" className="h-3.5 w-3.5" />
                </span>
                <span className="text-body-sm font-semibold text-ink">
                  Page name and address
                </span>
              </span>
              <Icon
                name="chevronDown"
                className={cn(
                  "h-4 w-4 text-ink-tertiary transition-transform duration-200",
                  settingsOpen && "rotate-180",
                )}
              />
            </button>
            {settingsOpen ? (
              <div className="border-t border-line p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-label-semibold font-semibold text-ink-secondary">
                      Page title
                    </span>
                    <input
                      value={titleDraft}
                      onChange={(event) => setTitleDraft(event.target.value)}
                      className="h-10 w-full rounded-[var(--radius-field)] border border-border-default bg-white px-3 text-body-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-sapphire-100"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-label-semibold font-semibold text-ink-secondary">
                      Web address
                    </span>
                    <input
                      value={pathDraft}
                      onChange={(event) => setPathDraft(event.target.value)}
                      className="h-10 w-full rounded-[var(--radius-field)] border border-border-default bg-white px-3 text-body-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-sapphire-100"
                    />
                  </label>
                </div>
                <Button className="mt-3" size="sm" variant="secondary" onClick={savePageSettings}>
                  Save details
                </Button>
              </div>
            ) : null}
          </section>

          <PageNavPlacementPanel
            pageId={page.id}
            locale={locale}
            page={page}
            onError={setError}
            onSaved={(next) => {
              setNavPlacement(next);
              setPage((prev) =>
                prev
                  ? {
                      ...prev,
                      nav_header_enabled: next.headerEnabled,
                      nav_footer_enabled: next.footerEnabled,
                      nav_footer_zone_key: next.footerZoneKey,
                      nav_label: next.linkLabel,
                    }
                  : prev,
              );
            }}
          />

          <SectionPalette onAdd={(type) => void addSection(type)} addingType={addingType} />

          {sections.length === 0 ? (
            <div className="rounded-[var(--radius-card)] border border-dashed border-border-default bg-white p-8 text-center">
              <p className="text-body-lg font-semibold text-ink">This page is empty</p>
              <p className="mx-auto mt-2 max-w-sm text-body-sm text-ink-secondary">
                Pick a section above to start. Most pages open with a hero banner, then a
                content block, and finish with a call to action.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {sections.map((section, index) => (
                <SectionCard
                  key={section.id}
                  domId={`builder-card-${section.id}`}
                  section={section}
                  definition={SECTION_REGISTRY[section.section_type]}
                  index={index}
                  total={sections.length}
                  selected={selectedId === section.id}
                  expanded={expandedId === section.id}
                  isDragging={dragId === section.id}
                  isDropTarget={dragOverId === section.id && dragId !== section.id}
                  onSelect={() => selectSection(section.id)}
                  onToggleExpanded={() =>
                    setExpandedId((current) => (current === section.id ? null : section.id))
                  }
                  onMove={(direction) => moveSection(section, direction)}
                  onPatch={(patch) => patchSection(section, patch)}
                  onRemove={() => removeSection(section)}
                  onOpenPreview={() => setOverlaySectionId(section.id)}
                  onDragStart={() => setDragId(section.id)}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverId(section.id);
                  }}
                  onDrop={() => {
                    if (!dragId || dragId === section.id) return;
                    const from = sections.findIndex((row) => row.id === dragId);
                    const to = sections.findIndex((row) => row.id === section.id);
                    if (from < 0 || to < 0) return;
                    const next = [...sections];
                    const [moved] = next.splice(from, 1);
                    next.splice(to, 0, moved);
                    persistOrder(next);
                    setDragId(null);
                    setDragOverId(null);
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    setDragOverId(null);
                  }}
                />
              ))}
            </ul>
          )}
        </div>

        <div className="xl:sticky xl:top-[168px]">
          <PreviewFrame
            src={previewSrc}
            title={`${page.title} preview`}
            reloadKey={reloadKey}
            focusSectionId={selectedId}
            heightClassName="h-[calc(100vh-260px)] min-h-[520px]"
            toolbarExtras={
              sections.length > 0 ? (
                <span className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Previous section"
                    disabled={selectedIndex <= 0}
                    onClick={() => selectSection(sections[selectedIndex - 1].id, true)}
                    className="rounded-[var(--radius-field)] border border-line bg-white p-1 text-ink-tertiary transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
                  >
                    <Icon name="chevronDown" className="h-3.5 w-3.5 rotate-90" />
                  </button>
                  <span className="text-body-xs text-ink-tertiary">
                    {selectedIndex >= 0 ? selectedIndex + 1 : "–"} / {sections.length}
                  </span>
                  <button
                    type="button"
                    aria-label="Next section"
                    disabled={selectedIndex < 0 || selectedIndex >= sections.length - 1}
                    onClick={() => selectSection(sections[selectedIndex + 1].id, true)}
                    className="rounded-[var(--radius-field)] border border-line bg-white p-1 text-ink-tertiary transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
                  >
                    <Icon name="chevronDown" className="h-3.5 w-3.5 -rotate-90" />
                  </button>
                </span>
              ) : null
            }
          />
          <p className="mt-2 text-body-xs text-ink-tertiary">
            This preview includes draft sections. Headings, paragraphs, and images are edited
            with the inline Edit buttons on the live page.
          </p>
        </div>
      </div>

      {overlaySection ? (
        <SectionPreviewOverlay
          title={
            getSectionDefinition(overlaySection.section_type)?.label ??
            overlaySection.section_type
          }
          src={`${previewSrc}?section=${overlaySection.id}`}
          onClose={() => setOverlaySectionId(null)}
        />
      ) : null}
    </AdminSiteShell>
  );
}
