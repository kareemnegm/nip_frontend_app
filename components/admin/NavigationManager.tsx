"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminSiteShell } from "@/components/admin/AdminSiteShell";
import { SeoEditorForm } from "@/components/admin/SeoEditorForm";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/FormControls";
import { useLocale } from "@/lib/i18n/context";
import { NAV_ZONE_KEYS } from "@/lib/navigation/zone-keys";
import { getZoneItems } from "@/lib/navigation/defaults";
import { resolveSeoPath } from "@/lib/navigation/seo-path";
import type {
  NavigationItem,
  NavigationPayload,
  NavigationZone,
} from "@/types/api/navigation";
import type { PageSeo } from "@/types/api/page-seo";

type NavigationManagerProps = {
  title: string;
  description: string;
  zoneFilter: (zone: NavigationZone) => boolean;
  showParentKey?: boolean;
};

export function NavigationManager({
  title,
  description,
  zoneFilter,
  showParentKey = false,
}: NavigationManagerProps) {
  const { locale } = useLocale();
  const [payload, setPayload] = useState<NavigationPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seoPath, setSeoPath] = useState<string | null>(null);
  const [seoInitial, setSeoInitial] = useState<PageSeo | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/navigation/admin?locale=${locale}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as NavigationPayload & { error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load navigation");
        }
        if (active) {
          setPayload(data);
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

  const zones = useMemo(
    () =>
      (payload?.zones ?? [])
        .filter(zoneFilter)
        .sort((a, b) => a.sort_order - b.sort_order),
    [payload, zoneFilter],
  );

  async function reloadNavigation() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/navigation/admin?locale=${locale}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as NavigationPayload & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to load navigation");
      }
      setPayload(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function saveZoneTitle(zone: NavigationZone, title: string) {
    const res = await fetch(`/api/navigation/zones/${encodeURIComponent(zone.key)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale, title }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      alert(data.error ?? "Failed to save header");
      return;
    }
    void reloadNavigation();
  }

  async function saveItem(item: NavigationItem, updates: Partial<NavigationItem>) {
    const res = await fetch(`/api/navigation/items/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: updates.label ?? item.label,
        href: updates.href ?? item.href,
        seo_path: updates.seo_path ?? item.seo_path,
        sort_order: updates.sort_order ?? item.sort_order,
        is_visible: updates.is_visible ?? item.is_visible,
      }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      alert(data.error ?? "Failed to save link");
      return;
    }
    void reloadNavigation();
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this link?")) return;
    const res = await fetch(`/api/navigation/items/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      alert(data.error ?? "Failed to delete");
      return;
    }
    void reloadNavigation();
  }

  async function addItem(zoneKey: string) {
    const label = prompt("Link label");
    if (!label?.trim()) return;
    const href = prompt("Link URL (e.g. /about)");
    if (!href?.trim()) return;

    const res = await fetch("/api/navigation/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zone_key: zoneKey,
        locale,
        label: label.trim(),
        href: href.trim(),
        seo_path: resolveSeoPath(href.trim()),
        sort_order: 99,
      }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      alert(data.error ?? "Failed to add link");
      return;
    }
    void reloadNavigation();
  }

  async function moveItem(item: NavigationItem, direction: -1 | 1) {
    if (!payload) return;
    const siblings = getZoneItems(payload, item.zone_key, {
      includeHidden: true,
      parentKey: item.parent_key ?? null,
    });
    const index = siblings.findIndex((row) => row.id === item.id);
    const swapIndex = index + direction;
    if (index < 0 || swapIndex < 0 || swapIndex >= siblings.length) return;

    const reordered = [...siblings];
    const [removed] = reordered.splice(index, 1);
    reordered.splice(swapIndex, 0, removed);

    const res = await fetch("/api/navigation/items/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: reordered.map((row, sort_order) => ({ id: row.id, sort_order: sort_order + 1 })),
      }),
    });
    if (!res.ok) {
      alert("Failed to reorder");
      return;
    }
    void reloadNavigation();
  }

  async function openSeoEditor(path: string) {
    setSeoPath(path);
    try {
      const res = await fetch(
        `/api/page-seo?path=${encodeURIComponent(path)}&locale=${locale}`,
        { cache: "no-store" },
      );
      const data = (await res.json()) as PageSeo | null;
      setSeoInitial(data);
    } catch {
      setSeoInitial(null);
    }
  }

  return (
    <AdminSiteShell title={title}>
      <p className="max-w-2xl text-body-regular text-ink-secondary">{description}</p>
      <p className="mt-2 text-body-sm text-ink-tertiary">
        Editing locale: <strong>{locale}</strong>
      </p>

      {loading ? <p className="mt-8 text-body-sm text-ink-secondary">Loading…</p> : null}
      {error ? <p className="mt-8 text-body-sm text-error">{error}</p> : null}

      {!loading && payload ? (
        <div className="mt-8 space-y-8">
          {zones.map((zone) => {
            const items = getZoneItems(payload, zone.key, { includeHidden: true });
            return (
              <section
                key={zone.id}
                className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)]"
              >
                <ZoneTitleEditor key={zone.id} zone={zone} onSave={saveZoneTitle} />
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col gap-3 border-b border-line pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-end"
                    >
                      <div className="grid flex-1 gap-3 sm:grid-cols-2">
                        <TextInput
                          label="Label"
                          value={item.label}
                          onChange={(e) => {
                            setPayload((current) =>
                              current
                                ? {
                                    ...current,
                                    items: current.items.map((row) =>
                                      row.id === item.id
                                        ? { ...row, label: e.target.value }
                                        : row,
                                    ),
                                  }
                                : current,
                            );
                          }}
                        />
                        <TextInput
                          label="URL"
                          value={item.href}
                          onChange={(e) => {
                            setPayload((current) =>
                              current
                                ? {
                                    ...current,
                                    items: current.items.map((row) =>
                                      row.id === item.id
                                        ? {
                                            ...row,
                                            href: e.target.value,
                                            seo_path: resolveSeoPath(e.target.value),
                                          }
                                        : row,
                                    ),
                                  }
                                : current,
                            );
                          }}
                        />
                      </div>
                      {showParentKey && item.parent_key ? (
                        <p className="text-body-sm text-ink-tertiary">
                          Dropdown: {item.parent_key}
                        </p>
                      ) : null}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => void moveItem(item, -1)}
                        >
                          ↑
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => void moveItem(item, 1)}
                        >
                          ↓
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() =>
                            void saveItem(item, {
                              label: item.label,
                              href: item.href,
                              seo_path: item.seo_path,
                            })
                          }
                        >
                          Save
                        </Button>
                        {item.seo_path ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => void openSeoEditor(item.seo_path!)}
                          >
                            SEO
                          </Button>
                        ) : null}
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => void deleteItem(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  className="mt-4"
                  variant="secondary"
                  size="sm"
                  onClick={() => void addItem(zone.key)}
                >
                  Add link
                </Button>
              </section>
            );
          })}
        </div>
      ) : null}

      {seoPath ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
            <SeoEditorForm
              path={seoPath}
              locale={locale}
              initial={seoInitial ?? undefined}
              onSaved={() => {
                setSeoPath(null);
                setSeoInitial(null);
              }}
              onCancel={() => {
                setSeoPath(null);
                setSeoInitial(null);
              }}
            />
          </div>
        </div>
      ) : null}
    </AdminSiteShell>
  );
}

function ZoneTitleEditor({
  zone,
  onSave,
}: {
  zone: NavigationZone;
  onSave: (zone: NavigationZone, title: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(zone.title);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <TextInput
        label="Column header"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
      />
      <Button type="button" size="sm" onClick={() => void onSave(zone, title)}>
        Save header
      </Button>
    </div>
  );
}

export function isFooterZone(zone: NavigationZone) {
  return zone.key.startsWith("footer_");
}

export function isHeaderZone(zone: NavigationZone) {
  return zone.key === NAV_ZONE_KEYS.HEADER_MAIN;
}
