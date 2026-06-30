"use client";

import { useEffect, useState } from "react";
import { clientTPath } from "@/lib/i18n/client-messages";
import { useOptionalLocale } from "@/lib/i18n/context";
import { SpeakWithNipButton } from "./ui/Button";
import { Logo } from "./ui/Logo";
import { siteChromeClassName } from "./ui/SiteChrome";

function useStickyCtaVisible() {
  const [pastHero, setPastHero] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const hero = document.querySelector("[data-site-hero]");
    const header = document.getElementById("site-header");
    const observers: IntersectionObserver[] = [];

    if (hero) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry) {
            setPastHero(!entry.isIntersecting);
          }
        },
        { threshold: 0 },
      );

      heroObserver.observe(hero);
      observers.push(heroObserver);
    }

    if (header) {
      const headerObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry) {
            setHeaderVisible(entry.isIntersecting);
          }
        },
        { threshold: 0 },
      );

      headerObserver.observe(header);
      observers.push(headerObserver);
    }

    if (!hero) {
      const onScroll = () => {
        setPastHero(window.scrollY > window.innerHeight * 0.55);
      };

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        observers.forEach((observer) => observer.disconnect());
        window.removeEventListener("scroll", onScroll);
      };
    }

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return pastHero && !headerVisible;
}

export function StickyCta() {
  const visible = useStickyCtaVisible();
  const localeContext = useOptionalLocale();
  const tagline = clientTPath(
    localeContext?.locale,
    "placeholders.global.footer.tagline",
  );

  return (
    <aside
      aria-hidden={!visible}
      className={[
        "fixed inset-x-0 top-0 z-50 bg-sapphire-800 text-white shadow-[0_2px_8px_rgb(7_30_64_/_24%)] transition-transform duration-300 ease-out",
        visible
          ? "pointer-events-auto translate-y-0"
          : "pointer-events-none -translate-y-full",
      ].join(" ")}
    >
      <div
        dir="ltr"
        className={`flex items-center justify-between gap-4 py-5 lg:py-6 ${siteChromeClassName}`}
      >
        <Logo inverted className="shrink-0" />

        <div className="flex items-center gap-5">
          <p className="hidden text-body-sm text-basalt-200 sm:block">{tagline}</p>
          <SpeakWithNipButton className="shrink-0" />
        </div>
      </div>
    </aside>
  );
}
