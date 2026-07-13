"use client";

import { useEffect, useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocalizedLink } from "./LocalizedLink";
import { SpeakWithNipButton } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Logo } from "./ui/Logo";
import { cn } from "@/lib/cn";
import { clientT } from "@/lib/i18n/client-messages";
import { useOptionalLocale } from "@/lib/i18n/context";
import {
  getNavDropdownItems,
  mainNavItems,
  type NavDropdownKey,
} from "@/lib/i18n/nav-config";

const navLinkClass =
  "rounded-[var(--radius-field)] px-3 py-3 text-base font-semibold text-ink transition-colors hover:bg-sapphire-50 hover:text-brand";

export function MobileNav() {
  const localeContext = useOptionalLocale();
  const isRtl = localeContext?.locale === "ar";
  const navT = (key: string) => clientT(localeContext?.locale, "nav", key);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpanded = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    if (open) document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Panel is anchored to the start edge (left in EN, right in AR); slide it
  // off toward that same edge when closed.
  const panelTransform = open
    ? "translate-x-0"
    : isRtl
      ? "translate-x-full"
      : "-translate-x-full";

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? navT("closeMenu") : navT("openMenu")}
        className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-field)] border border-line text-brand transition-colors hover:bg-sapphire-50"
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
      </button>

      <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")}>
        <div
          aria-hidden
          onClick={close}
          className={cn(
            "absolute inset-0 bg-sapphire-800/40 backdrop-blur-[2px] transition-opacity duration-300 ease-out motion-reduce:transition-none",
            open ? "opacity-100" : "opacity-0",
          )}
        />

        <aside
          // React 19: removes the panel from tab order + a11y tree while hidden.
          inert={!open}
          aria-label={navT("openMenu")}
          className={cn(
            "absolute inset-y-0 start-0 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-[var(--motion-ease-lux)] motion-reduce:transition-none",
            panelTransform,
          )}
        >
          <div
            dir="ltr"
            className="flex shrink-0 items-center justify-between px-6 py-5"
          >
            <LocalizedLink href="/" onClick={close}>
              <Logo />
            </LocalizedLink>
            <button
              type="button"
              aria-label={navT("closeMenu")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-field)] border border-line text-brand transition-colors hover:bg-sapphire-50"
              onClick={close}
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-4">
            {mainNavItems.map((item) => {
              if ("dropdown" in item) {
                const dropdownItems = getNavDropdownItems(
                  item.dropdown as NavDropdownKey,
                );
                const isExpanded = Boolean(expanded[item.key]);
                const panelId = `mobile-nav-${item.key}`;

                return (
                  <div key={item.key}>
                    <div className="flex items-center">
                      <LocalizedLink
                        href={item.href}
                        className={cn(navLinkClass, "flex-1")}
                        onClick={close}
                      >
                        {navT(item.key)}
                      </LocalizedLink>
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        aria-label={navT(item.key)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-field)] text-brand transition-colors hover:bg-sapphire-50"
                        onClick={() => toggleExpanded(item.key)}
                      >
                        <Icon
                          name="chevronDown"
                          className={cn(
                            "h-5 w-5 transition-transform duration-300 ease-[var(--motion-ease-lux)] motion-reduce:transition-none",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>
                    </div>

                    <div
                      id={panelId}
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-[var(--motion-ease-lux)] motion-reduce:transition-none",
                        isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="ms-3 mt-1 flex flex-col gap-[2px] border-s border-sapphire-100 ps-3">
                          {dropdownItems.map((link) => (
                            <LocalizedLink
                              key={link.key}
                              href={link.href}
                              className="rounded-[var(--radius-field)] px-2 py-[6px] text-[13px] font-medium text-ink-secondary transition-colors hover:bg-sapphire-50 hover:text-brand"
                              onClick={close}
                            >
                              {navT(link.key)}
                            </LocalizedLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <LocalizedLink
                  key={item.key}
                  href={item.href}
                  className={navLinkClass}
                  onClick={close}
                >
                  {navT(item.key)}
                </LocalizedLink>
              );
            })}
          </nav>

          <div className="shrink-0 space-y-4 border-t border-line px-6 py-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Icon name="globe" className="h-[18px] w-[18px] text-brand" />
              <LanguageSwitcher variant="compact" />
            </div>
            <SpeakWithNipButton className="w-full" onClick={close} />
          </div>
        </aside>
      </div>
    </div>
  );
}
