"use client";

import { useEffect, useState } from "react";
import { clientTPath } from "@/lib/i18n/client-messages";
import { useOptionalLocale } from "@/lib/i18n/context";
import { LocalizedLink } from "./LocalizedLink";
import { SpeakWithNipButton } from "./ui/Button";
import { Logo } from "./ui/Logo";
import { siteChromeClassName } from "./ui/SiteChrome";

function useStickyCtaVisible() {
  const [pastHero, setPastHero] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-site-hero]");
    const header = document.getElementById("site-header");
    const footer = document.querySelector("[data-site-footer]");
    const observers: IntersectionObserver[] = [];

    if (hero) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry) setPastHero(!entry.isIntersecting);
        },
        { threshold: 0 },
      );
      heroObserver.observe(hero);
      observers.push(heroObserver);
    }

    if (header) {
      // Require a meaningful chunk of the header on screen before hiding the
      // sticky bar — otherwise a 1px peek while scrolling leaves the bar
      // half-translated and clips the Speak with NIP button.
      const headerObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry) {
            setHeaderVisible(
              entry.isIntersecting && entry.intersectionRatio >= 0.35,
            );
          }
        },
        { threshold: [0, 0.35, 0.5, 1] },
      );
      headerObserver.observe(header);
      observers.push(headerObserver);
    }

    if (footer) {
      const footerObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry) setFooterVisible(entry.isIntersecting);
        },
        { threshold: 0, rootMargin: "0px 0px -40% 0px" },
      );
      footerObserver.observe(footer);
      observers.push(footerObserver);
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

  // Debounce show/hide so fast scroll can’t leave the bar mid-slide (half clipped).
  useEffect(() => {
    const shouldShow = pastHero && !headerVisible && !footerVisible;
    const delay = shouldShow ? 40 : 120;
    const timer = window.setTimeout(() => setVisible(shouldShow), delay);
    return () => window.clearTimeout(timer);
  }, [pastHero, headerVisible, footerVisible]);

  return visible;
}

export function StickyCta() {
  const visible = useStickyCtaVisible();
  const localeContext = useOptionalLocale();
  // Figma Nav / Sticky CTA 1632:14316 — not the footer tagline
  const tagline = clientTPath(
    localeContext?.locale,
    "placeholders.global.stickyCta.tagline",
  );

  return (
    <aside
      aria-hidden={!visible}
      className={[
        "fixed inset-x-0 top-0 z-50 bg-sapphire-800 text-white shadow-[0_2px_8px_rgb(7_30_64_/_24%)] transition-transform duration-300 ease-out will-change-transform",
        // Extra 8px past -100% so subpixel rounding never leaves a sliver on screen.
        visible
          ? "pointer-events-auto translate-y-0"
          : "pointer-events-none -translate-y-[calc(100%+8px)]",
      ].join(" ")}
    >
      <div
        dir="ltr"
        className={`flex items-center justify-between gap-4 py-6 ${siteChromeClassName}`}
      >
        <LocalizedLink
          href="/"
          className="shrink-0 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sapphire-800"
          aria-label="NIP Reality — Home"
        >
          <Logo inverted className="shrink-0" />
        </LocalizedLink>

        <div className="flex items-center gap-5">
          <p className="hidden whitespace-nowrap text-body-sm text-basalt-200 lg:block">
            {tagline}
          </p>
          <SpeakWithNipButton className="shrink-0" />
        </div>
      </div>
    </aside>
  );
}
