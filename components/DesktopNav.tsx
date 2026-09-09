"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LocalizedLink } from "./LocalizedLink";
import { Icon } from "./ui/Icon";
import { cn } from "@/lib/cn";
import { clientT } from "@/lib/i18n/client-messages";
import { useOptionalLocale } from "@/lib/i18n/context";
import {
  getNavDropdownItems,
  mainNavItems,
  type NavDropdownKey,
} from "@/lib/i18n/nav-config";
import type { ExtraNavLink } from "@/lib/page-builder/nav-placement";

const navLinkClass =
  "nav-link inline-flex items-center gap-1 text-label font-medium text-ink transition-colors duration-150 hover:text-brand";

const menuItemClass =
  "block px-5 py-2 text-label text-ink transition-colors duration-150 hover:bg-sapphire-50 hover:text-brand";

function NavCaret({ open }: { open: boolean }) {
  return (
    <Icon
      name="chevronDown"
      className={cn(
        "nav-caret h-2.5 w-2.5 shrink-0 transition-transform duration-150",
        open && "rotate-180",
      )}
    />
  );
}

export function DesktopNav({ extraLinks = [] }: { extraLinks?: ExtraNavLink[] }) {
  const localeContext = useOptionalLocale();
  const navT = (key: string) => clientT(localeContext?.locale, "nav", key);
  const navId = useId();
  const navRef = useRef<HTMLElement>(null);
  const [openDropdown, setOpenDropdown] = useState<NavDropdownKey | null>(null);
  const [openSubKey, setOpenSubKey] = useState<string | null>(null);

  function openOnly(dropdown: NavDropdownKey) {
    if (dropdown !== openDropdown) setOpenSubKey(null);
    setOpenDropdown(dropdown);
  }

  function closeDropdowns() {
    setOpenDropdown(null);
    setOpenSubKey(null);
  }

  useEffect(() => {
    if (!openDropdown) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeDropdowns();
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (target && !navRef.current?.contains(target)) {
        closeDropdowns();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openDropdown]);

  return (
    <nav
      ref={navRef}
      className="hidden items-center gap-5 lg:flex lg:justify-self-center xl:gap-[28px]"
      aria-label="Main"
      onMouseLeave={closeDropdowns}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          closeDropdowns();
        }
      }}
    >
      {mainNavItems.map((item) => {
        if ("dropdown" in item) {
          const dropdownKey = item.dropdown as NavDropdownKey;
          const dropdownItems = getNavDropdownItems(dropdownKey);
          const isOpen = openDropdown === dropdownKey;
          const panelId = `${navId}-${dropdownKey}-panel`;

          return (
            <div
              key={item.key}
              className="nav-dropdown relative"
              onMouseEnter={() => openOnly(dropdownKey)}
            >
              <LocalizedLink
                href={item.href}
                className={navLinkClass}
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-haspopup="menu"
                onFocus={() => openOnly(dropdownKey)}
              >
                {navT(item.key)}
                <NavCaret open={isOpen} />
              </LocalizedLink>
              {isOpen ? (
                <div
                  id={panelId}
                  role="menu"
                  aria-hidden={false}
                  data-open="true"
                  className="nav-dropdown-panel pointer-events-auto visible absolute start-1/2 top-full z-30 -translate-x-1/2 overflow-visible pt-3 opacity-100 rtl:translate-x-1/2"
                >
                  <div className="min-w-[180px] overflow-visible rounded-[var(--radius-field)] border border-line bg-white py-3 shadow-[var(--shadow-card)]">
                    <ul className="flex flex-col gap-1">
                      {dropdownItems.map((link) => {
                        const hasChildren = Boolean(link.children?.length);
                        const isSubOpen = openSubKey === link.key;

                        if (!hasChildren) {
                          return (
                            <li
                              key={`${dropdownKey}-${link.key}`}
                              role="none"
                              onMouseEnter={() => setOpenSubKey(null)}
                            >
                              <LocalizedLink
                                href={link.href}
                                role="menuitem"
                                className={menuItemClass}
                                onFocus={() => {
                                  openOnly(dropdownKey);
                                  setOpenSubKey(null);
                                }}
                              >
                                {navT(link.key)}
                              </LocalizedLink>
                            </li>
                          );
                        }

                        return (
                          <li
                            key={`${dropdownKey}-${link.key}`}
                            role="none"
                            className="relative"
                            onMouseEnter={() => setOpenSubKey(link.key)}
                          >
                            <LocalizedLink
                              href={link.href}
                              role="menuitem"
                              aria-haspopup="menu"
                              aria-expanded={isSubOpen}
                              className={cn(
                                "flex items-center justify-between gap-3 px-5 py-2 text-label text-ink transition-colors duration-150 hover:bg-sapphire-50 hover:text-brand",
                                isSubOpen && "bg-sapphire-50 text-brand",
                              )}
                              onFocus={() => {
                                openOnly(dropdownKey);
                                setOpenSubKey(link.key);
                              }}
                            >
                              <span>{navT(link.key)}</span>
                              <Icon
                                name="chevronDown"
                                className="h-2.5 w-2.5 shrink-0 -rotate-90 rtl:rotate-90"
                              />
                            </LocalizedLink>
                            {isSubOpen ? (
                              <div className="absolute top-0 start-full z-50 ps-1">
                                <ul className="min-w-[150px] rounded-[var(--radius-field)] border border-line bg-white py-2 shadow-[var(--shadow-card)]">
                                  {link.children!.map((child) => (
                                    <li
                                      key={`${dropdownKey}-${link.key}-${child.key}`}
                                      role="none"
                                    >
                                      <LocalizedLink
                                        href={child.href}
                                        role="menuitem"
                                        className={menuItemClass}
                                        onFocus={() => {
                                          openOnly(dropdownKey);
                                          setOpenSubKey(link.key);
                                        }}
                                      >
                                        {navT(child.key)}
                                      </LocalizedLink>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          );
        }

        return (
          <LocalizedLink
            key={item.key}
            href={item.href}
            className={navLinkClass}
            onMouseEnter={closeDropdowns}
            onFocus={closeDropdowns}
          >
            {navT(item.key)}
          </LocalizedLink>
        );
      })}
      {extraLinks.map((link) => (
        <LocalizedLink
          key={`builder-${link.href}`}
          href={link.href}
          className={navLinkClass}
          onMouseEnter={closeDropdowns}
          onFocus={closeDropdowns}
        >
          {link.label}
        </LocalizedLink>
      ))}
    </nav>
  );
}
