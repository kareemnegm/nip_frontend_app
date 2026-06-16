"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { EditableBlockEditButton } from "@/components/cms/EditableBlockEditButton";
import { useIsAdmin } from "./useIsAdmin";
import type { BlockType } from "@/lib/api/blocks";
import { redirectIfCmsUnauthorized } from "@/lib/cms/redirect.client";

export function EditableImageClient({
  relUrl,
  blockKey,
  locale,
  initialUrl,
}: {
  relUrl: string;
  blockKey: string;
  locale: string;
  initialUrl: string;
}) {
  const [editing, setEditing] = useState(false);
  const [newUrl, setNewUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const saveBlock = async (url = newUrl) => {
    try {
      const res = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relUrl,
          key: blockKey,
          locale,
          content: url,
          blockType: "IMAGE" as BlockType,
        }),
      });

      if (redirectIfCmsUnauthorized(res, locale)) return;

      if (res.ok) {
        setEditing(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  const deleteBlock = async () => {
    if (!confirm("Delete this image block?")) return;

    try {
      const res = await fetch("/api/blocks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relUrl, key: blockKey, locale }),
      });

      if (redirectIfCmsUnauthorized(res, locale)) return;

      if (res.ok) {
        setEditing(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const uploadFile = async (file: File) => {
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "heroes");

      const res = await fetch("/api/cms/media", {
        method: "POST",
        body: formData,
      });
      if (redirectIfCmsUnauthorized(res, locale)) return;

      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setUploadError(data.error ?? "Upload failed");
        return;
      }
      setNewUrl(data.url);
      await saveBlock(data.url);
    } catch {
      setUploadError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const overlay = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Edit image block"
    >
      <div className="relative w-[90%] max-w-md rounded-[var(--radius-card)] bg-white p-4 shadow-xl">
        <p className="mb-2 text-sm font-semibold text-brand">Image URL</p>
        <input
          type="url"
          value={newUrl}
          onChange={(event) => setNewUrl(event.target.value)}
          className="mb-4 h-11 w-full rounded-[var(--radius-field)] border border-line px-3 text-sm outline-none focus:border-brand"
          placeholder="https://cdn.niprealty.com/..."
        />
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void uploadFile(file);
              }
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-9 w-full rounded-[var(--radius-field)] border border-line px-4 text-sm font-medium hover:bg-surface-muted disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          {uploadError ? (
            <p className="mt-2 text-xs text-error" role="alert">
              {uploadError}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => void saveBlock()}
            className="h-9 rounded-[var(--radius-field)] bg-brand px-4 text-sm font-semibold text-white"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="h-9 rounded-[var(--radius-field)] border border-line px-4 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void deleteBlock()}
            className="h-9 rounded-[var(--radius-field)] px-4 text-sm text-error"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <EditableBlockEditButton
        label="Edit this image block"
        className="end-2 top-2"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setNewUrl(initialUrl);
          setUploadError(null);
          setEditing(true);
        }}
      />
      {editing && mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
