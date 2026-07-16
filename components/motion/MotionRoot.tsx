"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const REVEAL_SELECTOR = "[data-reveal]";
const COUNT_SELECTOR = "[data-count]";
const PARALLAX_SELECTOR = "[data-parallax]";
const HERO_TITLE_SELECTOR = "[data-hero-title]";
const HERO_EXTRA_SELECTOR = "[data-hero-eyebrow], [data-hero-sub], [data-hero-meta]";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function showImmediately(root: ParentNode, selector: string) {
  root.querySelectorAll(selector).forEach((el) => {
    el.classList.add("is-visible", "is-hero-visible");
  });
}

function revealWhenReady(el: Element) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add("is-visible");
    });
  });
}

function initReveal(root: ParentNode) {
  if (prefersReducedMotion()) {
    showImmediately(root, REVEAL_SELECTOR);
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
  );

  root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
    if (el.classList.contains("is-visible")) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08;

    if (inView) {
      revealWhenReady(el);
      return;
    }

    observer.observe(el);
  });

  return () => observer.disconnect();
}

function initHeroReveal(root: ParentNode) {
  if (prefersReducedMotion()) {
    showImmediately(root, HERO_TITLE_SELECTOR);
    showImmediately(root, HERO_EXTRA_SELECTOR);
    return () => {};
  }

  root.querySelectorAll(HERO_TITLE_SELECTOR).forEach((el) => {
    if (el.classList.contains("is-hero-visible")) return;
    el.classList.add("is-hero-visible");
    el.closest("[data-site-hero]")
      ?.querySelectorAll(HERO_EXTRA_SELECTOR)
      .forEach((item) => item.classList.add("is-hero-visible"));
  });

  return () => {};
}

function formatCount(value: number, decimals: number) {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }
  return Math.floor(value).toLocaleString();
}

function animateCount(el: Element) {
  const target = Number.parseFloat(el.getAttribute("data-count") ?? "0");
  const decimals = Number.parseInt(el.getAttribute("data-count-decimals") ?? "0", 10);
  const suffix = el.getAttribute("data-count-suffix") ?? "";
  const prefix = el.getAttribute("data-count-prefix") ?? "";
  const duration = 2200;
  const start = performance.now();

  function update(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    const value = eased * target;
    el.textContent = `${prefix}${formatCount(value, decimals)}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function initCountUp(root: ParentNode) {
  if (prefersReducedMotion()) {
    root.querySelectorAll(COUNT_SELECTOR).forEach((el) => {
      const target = el.getAttribute("data-count") ?? "0";
      const decimals = el.getAttribute("data-count-decimals") ?? "0";
      const suffix = el.getAttribute("data-count-suffix") ?? "";
      const prefix = el.getAttribute("data-count-prefix") ?? "";
      const value = Number.parseFloat(target);
      el.textContent = `${prefix}${formatCount(value, Number.parseInt(decimals, 10))}${suffix}`;
    });
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  root.querySelectorAll(COUNT_SELECTOR).forEach((el) => {
    observer.observe(el);
  });

  return () => observer.disconnect();
}

function initParallax(root: ParentNode) {
  if (prefersReducedMotion()) {
    return () => {};
  }

  const elements = Array.from(root.querySelectorAll(PARALLAX_SELECTOR));
  if (elements.length === 0) {
    return () => {};
  }

  let frame = 0;

  const update = () => {
    frame = 0;
    const viewportHeight = window.innerHeight;

    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const rect = htmlEl.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewportHeight) {
        return;
      }

      const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const offset = (progress - 0.5) * 60;
      htmlEl.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  };

  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    cancelAnimationFrame(frame);
    elements.forEach((el) => {
      (el as HTMLElement).style.transform = "";
    });
  };
}

function initSmoothAnchors() {
  const onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    const link = target?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href === "#" || href.length < 2) return;

    const section = document.querySelector(href);
    if (!section) return;

    event.preventDefault();
    const header = document.getElementById("site-header");
    const offset = header ? header.offsetHeight : 80;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

function discoverSectionReveals(root: ParentNode) {
  root.querySelectorAll("main section:not([data-site-hero])").forEach((section) => {
    if (section.hasAttribute("data-reveal") || section.querySelector("[data-reveal]")) {
      return;
    }
    section.setAttribute("data-reveal", "");
  });

  root.querySelectorAll("[data-site-hero]").forEach((hero) => {
    if (hero.querySelector("[data-hero-title], [data-hero-eyebrow]")) {
      return;
    }

    const inner = hero.firstElementChild;
    if (
      inner instanceof HTMLElement &&
      !inner.hasAttribute("data-reveal") &&
      !inner.querySelector("[data-reveal]")
    ) {
      inner.setAttribute("data-reveal", "");
    }
  });
}

function initMotion() {
  const root = document;
  discoverSectionReveals(root);
  const cleanups = [
    initReveal(root),
    initHeroReveal(root),
    initCountUp(root),
    initParallax(root),
    initSmoothAnchors(),
  ];

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

export function MotionRoot() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const prevPathnameRef = useRef(pathname);

  // A new page (e.g. clicking any footer/header link) must always open at the
  // top. Only react to real page-to-page navigation — filter/sort/view
  // controls intentionally keep their scroll position by changing just the
  // query string on the same pathname (see PropertyFilterBar / PropertyResultsToolbar),
  // so those must not trigger this. Cross-page links with a `#section` hash
  // are left alone so Next.js can scroll to that section instead of the top.
  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;

    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    let cleanup = initMotion();
    const retry = window.setTimeout(() => {
      cleanup();
      cleanup = initMotion();
    }, 120);

    return () => {
      window.clearTimeout(retry);
      cleanup();
    };
  }, [pathname, searchKey]);

  return null;
}
