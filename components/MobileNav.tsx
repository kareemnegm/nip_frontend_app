"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocalizedLink } from "./LocalizedLink";
import { SpeakWithNipButton } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Logo } from "./ui/Logo";
import {
  mainNavItems,
  offPlanDropdownItems,
  propertiesDropdownItems,
} from "@/lib/i18n/nav-config";

const navLinkClass =
  "rounded-[var(--radius-field)] px-3 py-3 text-base font-semibold text-ink hover:bg-sapphire-50 hover:text-brand";

export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? t("closeMenu") : t("openMenu")}
        className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-field)] border border-line text-brand"
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="ms-auto flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-xl rtl:ms-0 rtl:me-auto">
            <div className="flex items-center justify-between">
              <LocalizedLink href="/" onClick={() => setOpen(false)}>
                <Logo />
              </LocalizedLink>
              <button
                type="button"
                aria-label={t("closeMenu")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-field)] border border-line text-brand"
                onClick={() => setOpen(false)}
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-1">
              {mainNavItems.map((item) => {
                if ("dropdown" in item) {
                  const dropdownItems =
                    item.dropdown === "properties"
                      ? propertiesDropdownItems
                      : offPlanDropdownItems;

                  return (
                    <div key={item.key} className="space-y-1">
                      <LocalizedLink
                        href={item.href}
                        className={navLinkClass}
                        onClick={() => setOpen(false)}
                      >
                        {t(item.key)}
                      </LocalizedLink>
                      <div className="ms-3 flex flex-col gap-[2px] border-s border-sapphire-100 ps-3">
                        {dropdownItems.map((link) => (
                          <LocalizedLink
                            key={link.key}
                            href={link.href}
                            className="rounded-[var(--radius-field)] px-2 py-[6px] text-[13px] font-medium text-ink-secondary hover:bg-sapphire-50 hover:text-brand"
                            onClick={() => setOpen(false)}
                          >
                            {t(link.key)}
                          </LocalizedLink>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <LocalizedLink
                    key={item.key}
                    href={item.href}
                    className={navLinkClass}
                    onClick={() => setOpen(false)}
                  >
                    {t(item.key)}
                  </LocalizedLink>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4 border-t border-line pt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Icon name="globe" className="h-[18px] w-[18px] text-brand" />
                <LanguageSwitcher variant="compact" />
              </div>
              <SpeakWithNipButton
                className="w-full"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
