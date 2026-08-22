"use client";

import { useMemo, useState } from "react";
import { SectionSamplePreview } from "@/components/admin/page-builder/SectionSamplePreview";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n/context";
import {
  SECTION_GROUP_LABELS,
  SECTION_REGISTRY,
  type SectionGroup,
} from "@/lib/page-builder/registry";

const TABS: Array<{ value: SectionGroup | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "opening", label: SECTION_GROUP_LABELS.opening },
  { value: "content", label: SECTION_GROUP_LABELS.content },
  { value: "conversion", label: SECTION_GROUP_LABELS.conversion },
];

type SectionPaletteProps = {
  onAdd: (type: string) => void;
  addingType: string | null;
};

export function SectionPalette({ onAdd, addingType }: SectionPaletteProps) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<SectionGroup | "all">("all");

  const definitions = useMemo(() => {
    const all = Object.values(SECTION_REGISTRY);
    return tab === "all" ? all : all.filter((item) => item.group === tab);
  }, [tab]);

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
            <Icon name="plus" className="h-4 w-4" />
          </span>
          <span className="text-body-sm font-semibold text-ink">Add a section</span>
        </span>
        <Icon
          name="chevronDown"
          className={cn(
            "h-4 w-4 text-ink-tertiary transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="border-t border-line p-4">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTab(option.value)}
                aria-pressed={tab === option.value}
                className={cn(
                  "rounded-full px-3 py-1 text-label-semibold font-semibold transition-colors",
                  tab === option.value
                    ? "bg-brand text-white"
                    : "bg-sapphire-50 text-ink-tertiary hover:text-brand",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {definitions.map((definition) => {
              const busy = addingType === definition.type;
              return (
                <button
                  key={definition.type}
                  type="button"
                  disabled={Boolean(addingType)}
                  onClick={() => onAdd(definition.type)}
                  className={cn(
                    "group flex flex-col gap-2.5 rounded-[var(--radius-card)] border border-line p-3 text-start transition-all duration-200",
                    "hover:-translate-y-0.5 hover:border-brand hover:shadow-[var(--shadow-card)]",
                    "disabled:pointer-events-none disabled:opacity-60",
                    busy && "border-brand bg-sapphire-50",
                  )}
                >
                  <SectionSamplePreview
                    type={definition.type}
                    locale={locale}
                    label={definition.label}
                  />
                  <span className="flex items-center gap-2">
                    <Icon name={definition.icon} className="h-4 w-4 text-accent" />
                    <span className="text-body-sm font-semibold text-ink">
                      {definition.label}
                    </span>
                  </span>
                  <span className="text-body-xs text-ink-tertiary">
                    {definition.description}
                  </span>
                  <span className="text-label-semibold font-semibold uppercase text-brand opacity-0 transition-opacity group-hover:opacity-100">
                    {busy ? "Adding…" : "Add to page"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
