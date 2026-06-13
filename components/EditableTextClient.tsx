"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useIsAdmin } from "./useIsAdmin";
import type { BlockType } from "@/lib/api/blocks";

const TAGS = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "div",
  "span",
  "small",
  "blockquote",
  "ul",
  "ol",
  "li",
] as const;

export type EditableTag = (typeof TAGS)[number];

export function EditableTextClient({
  relUrl,
  blockKey,
  initialContent,
  initialTag = "p",
}: {
  relUrl: string;
  blockKey: string;
  initialContent: string;
  initialTag?: EditableTag;
}) {
  const [editing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState(initialContent ?? "");
  const [tag, setTag] = useState<EditableTag>(initialTag ?? "p");
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const openEditor = () => {
    setNewContent(initialContent ?? "");
    setEditing(true);
  };

  const closeEditor = () => {
    setEditing(false);
  };

  const saveBlock = async () => {
    try {
      const res = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relUrl,
          key: blockKey,
          content: newContent,
          blockType: "TEXT" as BlockType,
          elementTag: tag,
        }),
      });

      if (res.ok) {
        closeEditor();
        router.refresh();
      } else {
        console.error(await res.text());
      }
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  const deleteBlock = async () => {
    if (!confirm("Delete this block? This cannot be undone.")) return;

    try {
      const res = await fetch("/api/blocks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relUrl, key: blockKey }),
      });

      if (res.ok) {
        closeEditor();
        router.refresh();
      } else {
        console.error(await res.text());
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const overlay = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Edit text block"
    >
      <div className="relative flex h-[50vh] w-[90%] max-w-md flex-col rounded-[var(--radius-card)] bg-white p-4 shadow-xl">
        <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
          <select
            value={tag}
            onChange={(event) => setTag(event.target.value as EditableTag)}
            className="h-9 rounded-[var(--radius-field)] border border-line px-2 text-sm"
          >
            {TAGS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={saveBlock}
            className="h-9 rounded-[var(--radius-field)] bg-brand px-4 text-sm font-semibold text-white"
          >
            Save
          </button>
          <button
            type="button"
            onClick={closeEditor}
            className="h-9 rounded-[var(--radius-field)] border border-line px-4 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={deleteBlock}
            className="h-9 rounded-[var(--radius-field)] px-4 text-sm text-error"
          >
            Delete
          </button>
        </div>
        <textarea
          rows={10}
          value={newContent}
          onChange={(event) => setNewContent(event.target.value)}
          className="min-h-0 flex-1 resize-none rounded-[var(--radius-field)] border border-line p-3 text-sm outline-none focus:border-brand"
        />
      </div>
    </div>
  );

  return (
    <>
      {!editing && isAdmin ? (
        <button
          type="button"
          aria-label="Edit this text block"
          className="absolute right-1 top-1 z-10 rounded bg-white/90 px-1.5 py-0.5 text-xs shadow-sm ring-1 ring-line hover:bg-white"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            openEditor();
          }}
        >
          Edit
        </button>
      ) : null}
      {editing && mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
