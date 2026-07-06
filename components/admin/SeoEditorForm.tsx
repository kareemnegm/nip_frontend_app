"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextInput, Textarea } from "@/components/ui/FormControls";
import type { PageSeoUpsertPayload } from "@/types/api/page-seo";

export type SeoEditorFormProps = {
  path: string;
  locale: string;
  initial?: {
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
  };
  onSaved?: () => void;
  onCancel?: () => void;
};

export function SeoEditorForm({
  path,
  locale,
  initial,
  onSaved,
  onCancel,
}: SeoEditorFormProps) {
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? "");
  const [metaKeywords, setMetaKeywords] = useState(initial?.meta_keywords ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload: PageSeoUpsertPayload = {
      path,
      locale,
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      meta_keywords: metaKeywords.trim() || null,
    };

    try {
      const res = await fetch("/api/page-seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Save failed");
        return;
      }
      onSaved?.();
    } catch {
      setError("Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <p className="text-body-sm text-ink-secondary">
        SEO for <span className="font-semibold text-ink">{path}</span> ({locale})
      </p>
      <TextInput
        label="Meta title"
        value={metaTitle}
        onChange={(e) => setMetaTitle(e.target.value)}
        required
      />
      <Textarea
        label="Meta description"
        value={metaDescription}
        onChange={(e) => setMetaDescription(e.target.value)}
        rows={3}
      />
      <Textarea
        label="Meta keywords"
        value={metaKeywords}
        onChange={(e) => setMetaKeywords(e.target.value)}
        rows={2}
      />
      <p className="text-body-sm text-ink-tertiary">Comma-separated, e.g. NIP Reality, Dubai real estate</p>
      {error ? <p className="text-body-sm text-error">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save SEO"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
