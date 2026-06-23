"use client";

import { useEffect, useRef } from "react";

function splitWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function applyWordReveal(heading: HTMLHeadingElement) {
  if (heading.dataset.heroProcessed === "true") {
    return;
  }

  const text = heading.textContent ?? "";
  const words = splitWords(text);
  if (words.length === 0) {
    return;
  }

  heading.dataset.heroProcessed = "true";
  heading.dataset.heroTitle = "";
  heading.textContent = "";

  words.forEach((word, index) => {
    const wordWrap = document.createElement("span");
    wordWrap.className = "hero-word";
    const inner = document.createElement("span");
    inner.textContent = word;
    wordWrap.appendChild(inner);
    heading.appendChild(wordWrap);
    if (index < words.length - 1) {
      heading.appendChild(document.createTextNode(" "));
    }
  });
}

function triggerHeroVisible(heading: HTMLHeadingElement) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    heading.classList.add("is-hero-visible");
    heading.closest("[data-site-hero]")
      ?.querySelectorAll("[data-hero-eyebrow], [data-hero-sub], [data-hero-meta]")
      .forEach((item) => item.classList.add("is-hero-visible"));
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heading.classList.add("is-hero-visible");
      heading.closest("[data-site-hero]")
        ?.querySelectorAll("[data-hero-eyebrow], [data-hero-sub], [data-hero-meta]")
        .forEach((item) => item.classList.add("is-hero-visible"));
    });
  });
}

export type HeroTitleRevealSlotProps = {
  children: React.ReactNode;
};

/** Wraps CMS/static hero titles — splits words after render without changing title classes. */
export function HeroTitleRevealSlot({ children }: HeroTitleRevealSlotProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const heading = container.querySelector("h1");
    if (!heading) return;

    applyWordReveal(heading);
    triggerHeroVisible(heading);
  }, []);

  return <div ref={ref}>{children}</div>;
}
