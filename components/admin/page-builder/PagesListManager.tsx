"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminSiteShell } from "@/components/admin/AdminSiteShell";
import { SectionWireframe } from "@/components/admin/page-builder/SectionWireframe";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";
import { getSectionDefinition } from "@/lib/page-builder/registry";
import { normalizeBuilderPath, validateBuilderPath } from "@/lib/page-builder/reserved-paths";
import type { BuilderPage } from "@/types/api/page-builder";

const BREADCRUMBS = [{ label: "Site content", href: "/admin/site" }, { label: "Pages" }];

type StatusFilter = "all" | "published" | "draft";

function slugFromTitle(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug ? `/${slug}` : "";
}

function StatusPill({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-label-semibold font-semibold uppercase",
        published ? "bg-success/10 text-success" : "bg-warning/10 text-warning",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", published ? "bg-success" : "bg-warning")} />
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function PagesListManager() {
  const router = useRouter();
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const doneId = searchParams.get("done");

  const [pages, setPages] = useState<BuilderPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPath, setNewPath] = useState("");
  const [pathTouched, setPathTouched] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const fetchPages = useCallback(async () => {
    const res = await fetch(`/api/pages/admin?locale=${locale}`, { cache: "no-store" });
    const data = (await res.json()) as { pages?: BuilderPage[]; error?: string };
    if (!res.ok) throw new Error(data.error ?? "Failed to load pages");
    return data.pages ?? [];
  }, [locale]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const rows = await fetchPages();
        if (active) setPages(rows);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load pages");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [fetchPages]);

  useEffect(() => {
    if (!doneId || loading) return;
    document
      .getElementById(`page-card-${doneId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [doneId, loading]);

  const handleCreate = useCallback(async () => {
    const title = newTitle.trim();
    const path = normalizeBuilderPath(newPath || slugFromTitle(title));
    if (!title) {
      setError("Give the page a name first.");
      return;
    }
    const pathError = validateBuilderPath(path);
    if (pathError) {
      setError(pathError);
      return;
    }

    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, title, locale, is_published: false }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Create failed");
      if (data.id) {
        router.push(localizedHref(locale, `/admin/site/pages/${data.id}`));
        return;
      }
      setPages(await fetchPages());
      setCreateOpen(false);
      setNewTitle("");
      setNewPath("");
      setPathTouched(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setCreating(false);
    }
  }, [fetchPages, locale, newPath, newTitle, router]);

  const togglePublish = useCallback(async (page: BuilderPage) => {
    const next = !page.is_published;
    setPages((current) =>
      current.map((row) => (row.id === page.id ? { ...row, is_published: next } : row)),
    );
    setError(null);
    try {
      const res = await fetch(`/api/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: next }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Update failed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      setPages((current) =>
        current.map((row) =>
          row.id === page.id ? { ...row, is_published: page.is_published } : row,
        ),
      );
    }
  }, []);

  const handleDelete = useCallback(async (page: BuilderPage) => {
    if (!window.confirm(`Delete "${page.title}" and all of its sections?`)) return;
    const snapshot = pages;
    setPages((current) => current.filter((row) => row.id !== page.id));
    try {
      const res = await fetch(`/api/pages/${page.id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setPages(snapshot);
    }
  }, [pages]);

  const visiblePages = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...pages]
      .filter((page) => {
        if (filter === "published" && !page.is_published) return false;
        if (filter === "draft" && page.is_published) return false;
        if (!term) return true;
        return (
          page.title.toLowerCase().includes(term) || page.path.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title));
  }, [filter, pages, query]);

  const donePage = doneId ? pages.find((page) => page.id === doneId) : undefined;

  const counts = useMemo(
    () => ({
      all: pages.length,
      published: pages.filter((page) => page.is_published).length,
      draft: pages.filter((page) => !page.is_published).length,
    }),
    [pages],
  );

  return (
    <AdminSiteShell
      breadcrumbs={BREADCRUMBS}
      title="Pages"
      titleMeta={
        <p className="max-w-2xl text-body-regular text-ink-secondary">
          Build pages by stacking ready-made sections, preview them, then publish when you are
          happy. Add a menu link in Menu link labels when you want visitors to find the page.
        </p>
      }
      actions={
        <Button size="sm" onClick={() => setCreateOpen((value) => !value)}>
          {createOpen ? "Close" : "New page"}
        </Button>
      }
    >
      {donePage ? (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-[var(--shadow-card)]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
            <Icon name="check" className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-body-sm font-semibold text-ink">
              “{donePage.title}” is saved with {donePage.sections.length}{" "}
              {donePage.sections.length === 1 ? "section" : "sections"}.
            </p>
            <p className="text-body-xs text-ink-tertiary">
              {donePage.is_published
                ? `Live for visitors at ${donePage.path}.`
                : "It is still a draft — publish it to put it on the website."}
            </p>
          </div>
          <Button size="sm" onClick={() => void togglePublish(donePage)}>
            {donePage.is_published ? "Unpublish" : "Publish now"}
          </Button>
        </div>
      ) : null}

      {error ? (
        <p className="mb-4 rounded-[var(--radius-field)] border border-error/30 bg-error/5 px-4 py-3 text-body-sm text-error">
          {error}
        </p>
      ) : null}

      {createOpen ? (
        <div className="mb-6 rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-body-lg font-semibold text-ink">Create a page</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-label-semibold font-semibold text-ink-secondary">
                Page name
              </span>
              <input
                value={newTitle}
                placeholder="Investor Guide"
                onChange={(event) => {
                  setNewTitle(event.target.value);
                  if (!pathTouched) setNewPath(slugFromTitle(event.target.value));
                }}
                className="h-10 w-full rounded-[var(--radius-field)] border border-border-default bg-white px-3 text-body-sm text-ink outline-none transition placeholder:text-text-inactive focus:border-brand focus:ring-2 focus:ring-sapphire-100"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-label-semibold font-semibold text-ink-secondary">
                Web address
              </span>
              <input
                value={newPath}
                placeholder="/investor-guide"
                onChange={(event) => {
                  setPathTouched(true);
                  setNewPath(event.target.value);
                }}
                className="h-10 w-full rounded-[var(--radius-field)] border border-border-default bg-white px-3 text-body-sm text-ink outline-none transition placeholder:text-text-inactive focus:border-brand focus:ring-2 focus:ring-sapphire-100"
              />
            </label>
          </div>
          <p className="mt-2 text-body-xs text-ink-tertiary">
            Visitors will reach it at {locale === "ar" ? "/ar" : "/en"}
            {newPath || "/your-page"}.
          </p>
          <Button className="mt-4" onClick={() => void handleCreate()} disabled={creating}>
            {creating ? "Creating…" : "Create and add sections"}
          </Button>
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {(["all", "published", "draft"] as StatusFilter[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={filter === option}
              className={cn(
                "rounded-full px-3 py-1 text-label-semibold font-semibold capitalize transition-colors",
                filter === option
                  ? "bg-brand text-white"
                  : "bg-sapphire-50 text-ink-tertiary hover:text-brand",
              )}
            >
              {option === "all" ? "All" : option} ({counts[option]})
            </button>
          ))}
        </div>
        <label className="relative flex items-center">
          <Icon name="search" className="absolute start-3 h-4 w-4 text-text-inactive" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages"
            aria-label="Search pages"
            className="h-10 w-56 rounded-[var(--radius-field)] border border-border-default bg-white ps-9 pe-3 text-body-sm text-ink outline-none transition placeholder:text-text-inactive focus:border-brand focus:ring-2 focus:ring-sapphire-100"
          />
        </label>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1].map((key) => (
            <div
              key={key}
              className="h-40 animate-pulse rounded-[var(--radius-card)] border border-line bg-white"
            />
          ))}
        </div>
      ) : visiblePages.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-border-default bg-white p-10 text-center">
          <p className="text-body-lg font-semibold text-ink">
            {pages.length === 0 ? "No pages yet" : "Nothing matches that search"}
          </p>
          <p className="mx-auto mt-2 max-w-md text-body-sm text-ink-secondary">
            {pages.length === 0
              ? "Create your first page, then stack sections like a hero banner, property grid, and call to action."
              : "Try a different name or clear the filter."}
          </p>
          {pages.length === 0 ? (
            <Button className="mt-4" onClick={() => setCreateOpen(true)}>
              New page
            </Button>
          ) : null}
        </div>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {visiblePages.map((page) => (
            <li
              key={page.id}
              id={`page-card-${page.id}`}
              className={cn(
                "flex flex-col rounded-[var(--radius-card)] border bg-white shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5",
                doneId === page.id ? "border-brand" : "border-line",
              )}
            >
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <Link
                    href={localizedHref(locale, `/admin/site/pages/${page.id}`)}
                    className="text-body-lg font-semibold text-ink transition-colors hover:text-brand"
                  >
                    {page.title}
                  </Link>
                  <p className="mt-1 text-body-xs text-ink-tertiary">{page.path}</p>
                </div>
                <StatusPill published={page.is_published} />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto px-4 pb-3">
                {page.sections.length === 0 ? (
                  <span className="text-body-xs text-ink-tertiary">No sections yet</span>
                ) : (
                  page.sections
                    .slice()
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((section) => (
                      <span key={section.id} className="shrink-0" title={getSectionDefinition(section.section_type)?.label}>
                        <SectionWireframe type={section.section_type} className="h-9 w-14" />
                      </span>
                    ))
                )}
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
                <Button size="sm" href={`/admin/site/pages/${page.id}`}>
                  Edit sections
                </Button>
                <Button size="sm" variant="secondary" href={`/admin/site/pages/${page.id}/preview`}>
                  Preview
                </Button>
                <Button size="sm" variant="secondary" onClick={() => void togglePublish(page)}>
                  {page.is_published ? "Unpublish" : "Publish"}
                </Button>
                {page.is_published ? (
                  <Button size="sm" variant="text" href={page.path}>
                    Open live
                  </Button>
                ) : null}
                <span className="flex-1" />
                <button
                  type="button"
                  onClick={() => void handleDelete(page)}
                  className="inline-flex items-center gap-1.5 rounded-[var(--radius-field)] px-2.5 py-1 text-label-semibold font-semibold text-error transition-colors hover:bg-error/10"
                >
                  <Icon name="close" className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminSiteShell>
  );
}
