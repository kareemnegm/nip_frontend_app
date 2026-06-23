"use client";

import { useEffect, useRef } from "react";

const HOVER_SELECTOR =
  'a, button, [role="button"], input, select, textarea, [data-motion-hover]';

export function ImmersiveLayer() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reducedMotion || !finePointer) {
      return;
    }

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) {
      return;
    }

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
      cursor.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
    };

    const animateRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      frame = requestAnimationFrame(animateRing);
    };

    const onEnter = () => {
      cursor.classList.add("is-hover");
      ring.classList.add("is-hover");
    };

    const onLeave = () => {
      cursor.classList.remove("is-hover");
      ring.classList.remove("is-hover");
    };

    const bindHoverTargets = () => {
      document.querySelectorAll(HOVER_SELECTOR).forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    const unbindHoverTargets = () => {
      document.querySelectorAll(HOVER_SELECTOR).forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };

    document.addEventListener("mousemove", onMove);
    document.body.classList.add("motion-cursor-active");
    bindHoverTargets();
    frame = requestAnimationFrame(animateRing);

    const observer = new MutationObserver(() => {
      unbindHoverTargets();
      bindHoverTargets();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.body.classList.remove("motion-cursor-active");
      unbindHoverTargets();
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="motion-cursor" aria-hidden />
      <div ref={ringRef} className="motion-cursor-ring" aria-hidden />
      <div className="motion-noise" aria-hidden />
    </>
  );
}
