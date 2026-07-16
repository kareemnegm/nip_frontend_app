"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type SavePropertyButtonLabels = {
  save: string;
  saved: string;
  remove: string;
};

type SavePropertyButtonProps = {
  propertyId: number;
  initialSaved: boolean;
  labels: SavePropertyButtonLabels;
  className?: string;
};

export function SavePropertyButton({
  propertyId,
  initialSaved,
  labels,
  className,
}: SavePropertyButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function toggleSaved() {
    if (pending) return;

    const nextSaved = !saved;
    setSaved(nextSaved);
    setPending(true);

    try {
      const response = await fetch(
        nextSaved
          ? "/api/member/saved"
          : `/api/member/saved?propertyId=${propertyId}`,
        {
          method: nextSaved ? "POST" : "DELETE",
          headers: nextSaved ? { "Content-Type": "application/json" } : undefined,
          body: nextSaved ? JSON.stringify({ propertyId }) : undefined,
        },
      );

      if (!response.ok && response.status !== 204) {
        throw new Error("Save toggle failed");
      }
    } catch {
      setSaved(!nextSaved);
    } finally {
      setPending(false);
    }
  }

  const ariaLabel = saved ? labels.remove : labels.save;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={saved}
      disabled={pending}
      onClick={toggleSaved}
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-field)] border border-line bg-white text-brand transition-colors hover:bg-sapphire-50 disabled:opacity-60",
        saved && "border-accent bg-sapphire-50 text-accent",
        className,
      )}
    >
      <Icon
        name="heart"
        className={cn("h-5 w-5", saved && "fill-current")}
      />
      <span className="sr-only">{saved ? labels.saved : labels.save}</span>
    </button>
  );
}
