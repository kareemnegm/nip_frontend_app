"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

/** Figma filter/sort chevron — 10×10, stroke ink-secondary */
function SelectChevron({ open, className }: { open?: boolean; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className={cn(
        "size-2.5 shrink-0 aspect-square text-ink-secondary transition-transform duration-300 ease-[var(--motion-ease-lux)]",
        open && "rotate-180",
        className,
      )}
      aria-hidden
    >
      <path
        d="M8.33317 3.33332L4.99984 6.66666L1.6665 3.33332"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Matches DesktopNav dropdown panel (Properties / Off-Plan menus). */
const menuPanelClassName =
  "rounded-[var(--radius-field)] border border-line bg-white py-3 shadow-[var(--shadow-card)]";

const menuItemClassName =
  "block w-full px-5 py-2 text-start text-[13px] leading-[18px] text-ink transition-colors duration-200 hover:bg-sapphire-50 hover:text-brand";

const menuItemSelectedClassName = "bg-sapphire-50 font-medium text-brand";

export type LabeledSelectOption = {
  label: string;
  value: string;
};

export type LabeledSelectProps = {
  "aria-label": string;
  options: LabeledSelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Figma filter width = 110px; sort uses auto width */
  widthClassName?: string;
  heightClassName?: string;
  borderClassName?: string;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
};

/**
 * Custom select styled like the header nav dropdown — white panel, shadow,
 * sapphire hover/selected states with brand text. Menu renders in a portal so
 * it is never clipped by the hero/filter bar layout.
 */
export function LabeledSelect({
  "aria-label": ariaLabel,
  options,
  value,
  onChange,
  className,
  widthClassName = "w-full min-w-0 flex-1 sm:max-w-[140px] lg:w-[110px] lg:max-w-[110px] lg:flex-none",
  heightClassName = "py-1.5",
  borderClassName = "border-line",
}: LabeledSelectProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [mounted, setMounted] = useState(false);

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];
  const displayLabel = selectedOption?.label ?? "";
  const hasSelection = value !== "";

  /** Placeholder rows (empty value) stay on the trigger label only — not in the menu. */
  const menuOptions = options.filter(
    (option) => option.value !== "" || options.every((item) => item.value === ""),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  function updateMenuPosition() {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  }

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();

    function onReposition() {
      updateMenuPosition();
    }

    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (target && !rootRef.current?.contains(target)) {
        const menu = document.getElementById(listboxId);
        if (menu?.contains(target)) return;
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, listboxId]);

  function selectOption(nextValue: string) {
    onChange(nextValue);
    setOpen(false);
  }

  const menu =
    open && menuPosition && mounted ? (
      <ul
        id={listboxId}
        role="listbox"
        aria-label={ariaLabel}
        style={{
          position: "fixed",
          top: menuPosition.top,
          left: menuPosition.left,
          width: menuPosition.width,
          zIndex: 1000,
        }}
        className={cn(menuPanelClassName, "flex max-h-[min(320px,70vh)] flex-col gap-1 overflow-y-auto")}
      >
        {menuOptions.map((option) => {
          const isSelected = option.value === value;

          return (
            <li key={option.value || option.label} role="none">
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(option.value)}
                className={cn(
                  menuItemClassName,
                  isSelected && menuItemSelectedClassName,
                )}
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>
    ) : null;

  return (
    <>
      <div ref={rootRef} className={cn("relative", widthClassName, className)}>
        <button
          ref={triggerRef}
          type="button"
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "flex w-full items-center gap-1.5 overflow-hidden rounded-[var(--radius-field)] border bg-white pl-3.5 pr-3 text-start outline-none transition-colors duration-200 focus:outline-none focus-visible:outline-none",
            heightClassName,
            borderClassName,
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-label font-medium",
              hasSelection ? "text-brand" : "text-ink-secondary",
            )}
          >
            {displayLabel}
          </span>
          <SelectChevron open={open} />
        </button>
      </div>
      {mounted && menu ? createPortal(menu, document.body) : null}
    </>
  );
}
