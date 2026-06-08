"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Logo } from "./ui/Logo";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Insights", href: "/insights" },
  { label: "Properties", href: "/properties" },
  { label: "Off-Plan", href: "/off-plan" },
  { label: "Areas", href: "/areas" },
  { label: "Developers", href: "/developers" },
  { label: "Concierge", href: "/concierge" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-field)] border border-line text-brand"
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="ml-auto flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-field)] border border-line text-brand"
                onClick={() => setOpen(false)}
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-[var(--radius-field)] px-3 py-3 text-base font-semibold text-ink hover:bg-sapphire-50 hover:text-brand"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto space-y-4 border-t border-line pt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Icon name="globe" className="h-4 w-4 text-brand" />
                <span>EN | AR</span>
              </div>
              <Button href="/contact" className="w-full" onClick={() => setOpen(false)}>
                Speak with NIP
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
