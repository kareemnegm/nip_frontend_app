"use client";

import { SectionWireframe } from "@/components/admin/page-builder/SectionWireframe";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { SectionDefinition } from "@/lib/page-builder/registry";
import type {
  BuilderPageSection,
  BuilderSectionUpdatePayload,
} from "@/types/api/page-builder";

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "muted" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-label-semibold font-semibold uppercase",
        tone === "neutral" && "bg-sapphire-50 text-brand",
        tone === "accent" && "bg-success/10 text-success",
        tone === "muted" && "bg-basalt-100 text-ink-tertiary",
      )}
    >
      {children}
    </span>
  );
}

function VisibilitySwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2"
    >
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors duration-200",
          checked ? "bg-success" : "bg-platinum-400",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-200",
            checked ? "start-[18px]" : "start-0.5",
          )}
        />
      </span>
      <span className="text-body-sm text-ink-secondary">
        {checked ? "Visible on live page" : "Hidden from visitors"}
      </span>
    </button>
  );
}

type SectionCardProps = {
  /** DOM id so the outline strip can scroll this card into view. */
  domId: string;
  section: BuilderPageSection;
  definition?: SectionDefinition;
  index: number;
  total: number;
  selected: boolean;
  expanded: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  onSelect: () => void;
  onToggleExpanded: () => void;
  onMove: (direction: -1 | 1) => void;
  onPatch: (patch: BuilderSectionUpdatePayload) => void;
  onRemove: () => void;
  onOpenPreview: () => void;
  onDragStart: () => void;
  onDragOver: (event: React.DragEvent<HTMLLIElement>) => void;
  onDrop: () => void;
  onDragEnd: () => void;
};

export function SectionCard({
  domId,
  section,
  definition,
  index,
  total,
  selected,
  expanded,
  isDragging,
  isDropTarget,
  onSelect,
  onToggleExpanded,
  onMove,
  onPatch,
  onRemove,
  onOpenPreview,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: SectionCardProps) {
  const dataSource = section.data_source ?? definition?.dataSource ?? "none";
  const params = (section.data_params ?? {}) as Record<string, unknown>;

  return (
    <li
      id={domId}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        "rounded-[var(--radius-card)] border bg-white transition-all duration-200",
        selected ? "border-brand shadow-[var(--shadow-card)]" : "border-line",
        isDragging && "opacity-40",
        isDropTarget && "border-accent",
        !section.is_visible && "bg-surface-muted",
      )}
    >
      <div className="flex items-start gap-3 p-3">
        <span
          aria-hidden
          title="Drag to reorder"
          className="mt-2 grid shrink-0 cursor-grab grid-cols-2 gap-[3px] active:cursor-grabbing"
        >
          {[0, 1, 2, 3, 4, 5].map((dot) => (
            <span key={dot} className="h-[3px] w-[3px] rounded-full bg-platinum-400" />
          ))}
        </span>

        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-start gap-3 text-start"
        >
          <SectionWireframe type={section.section_type} className="h-11 w-16 shrink-0" />
          <span className="min-w-0">
            <span className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-label-semibold font-semibold text-white">
                {index + 1}
              </span>
              <span className="truncate text-body-sm font-semibold text-ink">
                {definition?.label ?? section.section_type}
              </span>
            </span>
            <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {section.is_visible ? null : <Badge tone="muted">Hidden</Badge>}
              {dataSource !== "none" ? (
                <Badge>
                  {dataSource} · {section.item_limit || definition?.defaultLimit || 6}
                </Badge>
              ) : null}
              {selected ? <Badge tone="accent">In preview</Badge> : null}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          aria-label={expanded ? "Hide settings" : "Show settings"}
          className="shrink-0 rounded-[var(--radius-field)] p-1.5 text-ink-tertiary transition-colors hover:bg-sapphire-50 hover:text-brand"
        >
          <Icon
            name="chevronDown"
            className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")}
          />
        </button>
      </div>

      {expanded ? (
        <div className="border-t border-line p-4">
          <p className="text-body-xs text-ink-tertiary">
            {definition?.description}
          </p>
          <p className="mt-2 text-body-xs text-ink-tertiary">
            <span className="font-semibold text-ink-secondary">Edit text on the live page:</span>{" "}
            {definition?.editableSummary ?? "—"}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {dataSource !== "none" ? (
              <label className="flex flex-col gap-1.5">
                <span className="text-label-semibold font-semibold text-ink-secondary">
                  How many items
                </span>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={section.item_limit || definition?.defaultLimit || 6}
                  onChange={(event) =>
                    onPatch({
                      item_limit:
                        Number(event.target.value) || definition?.defaultLimit || 6,
                    })
                  }
                  className="h-10 w-full rounded-[var(--radius-field)] border border-border-default bg-white px-3 text-body-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-sapphire-100"
                />
              </label>
            ) : null}

            {(definition?.paramFields ?? []).map((field) => {
              const current = typeof params[field.key] === "string" ? String(params[field.key]) : "";
              return (
                <label key={field.key} className="flex flex-col gap-1.5">
                  <span className="text-label-semibold font-semibold text-ink-secondary">
                    {field.label}
                  </span>
                  {field.type === "select" ? (
                    <select
                      value={current}
                      onChange={(event) =>
                        onPatch({
                          data_params: { ...params, [field.key]: event.target.value },
                        })
                      }
                      className="h-10 w-full rounded-[var(--radius-field)] border border-border-default bg-white px-3 text-body-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-sapphire-100"
                    >
                      {(field.options ?? []).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      defaultValue={current}
                      placeholder={field.placeholder}
                      onBlur={(event) =>
                        onPatch({
                          data_params: { ...params, [field.key]: event.target.value.trim() },
                        })
                      }
                      className="h-10 w-full rounded-[var(--radius-field)] border border-border-default bg-white px-3 text-body-sm text-ink outline-none transition placeholder:text-text-inactive focus:border-brand focus:ring-2 focus:ring-sapphire-100"
                    />
                  )}
                </label>
              );
            })}
          </div>

          <div className="mt-4">
            <VisibilitySwitch
              checked={section.is_visible}
              onChange={(next) => onPatch({ is_visible: next })}
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-1.5 border-t border-line px-3 py-2">
        <button
          type="button"
          onClick={onOpenPreview}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-field)] border border-line px-2.5 py-1 text-label-semibold font-semibold text-brand transition-colors hover:border-brand hover:bg-sapphire-50"
        >
          <Icon name="search" className="h-3.5 w-3.5" />
          View section
        </button>
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(-1)}
          aria-label="Move section up"
          className="rounded-[var(--radius-field)] border border-line p-1.5 text-ink-tertiary transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
        >
          <Icon name="chevronDown" className="h-3.5 w-3.5 rotate-180" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(1)}
          aria-label="Move section down"
          className="rounded-[var(--radius-field)] border border-line p-1.5 text-ink-tertiary transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
        >
          <Icon name="chevronDown" className="h-3.5 w-3.5" />
        </button>
        <span className="flex-1" />
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-field)] px-2.5 py-1 text-label-semibold font-semibold text-error transition-colors hover:bg-error/10"
        >
          <Icon name="close" className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>
    </li>
  );
}
