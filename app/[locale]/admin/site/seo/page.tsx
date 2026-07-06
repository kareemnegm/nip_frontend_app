"use client";

import { useEffect, useState } from "react";
import { AdminSiteShell } from "@/components/admin/AdminSiteShell";
import { SeoEditorForm } from "@/components/admin/SeoEditorForm";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/context";
import type { PageSeo } from "@/types/api/page-seo";

export default function AdminSeoLibraryPage() {
  const { locale } = useLocale();
  const [rows, setRows] = useState<PageSeo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<PageSeo | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/page-seo?locale=${locale}`, { cache: "no-store" });
        const data = (await res.json()) as PageSeo[] & { error?: string };
        if (!res.ok) {
          throw new Error((data as { error?: string }).error ?? "Failed to load");
        }
        if (active) {
          setRows(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [locale]);

  async function reloadSeoRows() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/page-seo?locale=${locale}`, { cache: "no-store" });
      const data = (await res.json()) as PageSeo[] & { error?: string };
      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? "Failed to load");
      }
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminSiteShell title="Page SEO library">
      <p className="max-w-2xl text-body-regular text-ink-secondary">
        Set meta title, description, and keywords for marketing pages — including About, Home,
        Properties, and more. Slug pages (individual listings, blog posts) use catalog data.
      </p>
      <p className="mt-2 text-body-sm text-ink-tertiary">
        Editing locale: <strong>{locale}</strong>
      </p>

      {loading ? <p className="mt-8 text-body-sm text-ink-secondary">Loading…</p> : null}
      {error ? <p className="mt-8 text-body-sm text-error">{error}</p> : null}

      {!loading && rows.length > 0 ? (
        <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[640px] text-left text-body-sm">
            <thead className="border-b border-line bg-sapphire-50 text-overline font-semibold uppercase text-ink-secondary">
              <tr>
                <th className="px-4 py-3">Path</th>
                <th className="px-4 py-3">Meta title</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{row.path}</td>
                  <td className="px-4 py-3 text-ink-secondary">{row.meta_title ?? "—"}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-ink-secondary">
                    {row.meta_description ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Button type="button" size="sm" onClick={() => setEditing(row)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
            <SeoEditorForm
              path={editing.path}
              locale={locale}
              initial={editing}
              onSaved={() => {
                setEditing(null);
                void reloadSeoRows();
              }}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      ) : null}
    </AdminSiteShell>
  );
}
