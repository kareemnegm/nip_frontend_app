"use client";

import { Fragment, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export type HeroTitleRevealProps = {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

/** Words grouped per authored line, so newlines in the copy still break the title. */
function splitLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim().split(/\s+/).filter(Boolean))
    .filter((words) => words.length > 0);
}

export function HeroTitleReveal({
  children,
  className,
  as: Tag = "h1",
}: HeroTitleRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const lines = splitLines(children);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      el.classList.add("is-hero-visible");
      el.closest("[data-site-hero]")
        ?.querySelectorAll("[data-hero-eyebrow], [data-hero-sub], [data-hero-meta]")
        .forEach((item) => item.classList.add("is-hero-visible"));
      return;
    }

    const frame = requestAnimationFrame(() => {
      el.classList.add("is-hero-visible");
      el.closest("[data-site-hero]")
        ?.querySelectorAll("[data-hero-eyebrow], [data-hero-sub], [data-hero-meta]")
        .forEach((item) => item.classList.add("is-hero-visible"));
    });

    return () => cancelAnimationFrame(frame);
  }, [children]);

  return (
    <Tag ref={ref} data-hero-title className={cn(className)}>
      {lines.map((words, lineIndex) => (
        <Fragment key={`line-${lineIndex}`}>
          {lineIndex > 0 ? <br /> : null}
          {words.map((word, index) => (
            <span key={`${word}-${index}`} className="hero-word">
              <span>{word}</span>
            </span>
          ))}
        </Fragment>
      ))}
    </Tag>
  );
}
