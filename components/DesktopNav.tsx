"use client";

import { useState } from "react";
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

const navLinkClass =
  "nav-link inline-flex items-center gap-1 text-[13px] font-medium leading-[18px] text-ink transition-colors duration-200 hover:text-brand";

function NavCaret({ open }: { open: boolean }) {
  return (
    <Icon
      name="chevronDown"
      className={cn(
        "nav-caret h-2.5 w-2.5 shrink-0 transition-transform duration-300 ease-[var(--motion-ease-lux)]",
        open && "rotate-180",
      )}
    />
  );
}

export function DesktopNav() {
  const localeContext = useOptionalLocale();
  const navT = (key: string) => clientT(localeContext?.locale, "nav", key);
  const [openDropdown, setOpenDropdown] = useState<NavDropdownKey | null>(null);

  function openOnly(dropdown: NavDropdownKey) {
    setOpenDropdown(dropdown);
  }

  function closeDropdowns() {
    setOpenDropdown(null);
  }

  return (
    <nav
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
                onFocus={() => openOnly(dropdownKey)}
              >
                {navT(item.key)}
                <NavCaret open={isOpen} />
              </LocalizedLink>
              <div
                className={cn(
                  "nav-dropdown-panel absolute start-1/2 top-full z-30 -translate-x-1/2 pt-3 transition-[opacity,transform] duration-300 ease-[var(--motion-ease-lux)] rtl:translate-x-1/2",
                  isOpen
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0",
                )}
              >
                <div
                  className={cn(
                    "min-w-[180px] rounded-[var(--radius-field)] border border-line bg-white py-3 shadow-[var(--shadow-card)] transition-transform duration-300 ease-[var(--motion-ease-lux)]",
                    isOpen ? "translate-y-0" : "translate-y-1",
                  )}
                >
                  <ul className="flex flex-col gap-1">
                    {dropdownItems.map((link) => (
                      <li key={`${dropdownKey}-${link.key}`}>
                        <LocalizedLink
                          href={link.href}
                          className="block px-5 py-2 text-[13px] leading-[18px] text-ink transition-colors duration-200 hover:bg-sapphire-50 hover:text-brand"
                          onFocus={() => openOnly(dropdownKey)}
                        >
                          {navT(link.key)}
                        </LocalizedLink>
                      </li>
                    ))}
                  </ul>
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
            onMouseEnter={closeDropdowns}
            onFocus={closeDropdowns}
          >
            {navT(item.key)}
          </LocalizedLink>
        );
      })}
    </nav>
  );
}
