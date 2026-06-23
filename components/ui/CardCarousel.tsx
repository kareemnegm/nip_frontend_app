"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type CardCarouselProps = {
  children: ReactNode;
  className?: string;
  slideClassName?: string;
  /** Slide width in px — matches Figma card widths (408 property, 480 insight). */
  slideWidth?: number;
  gap?: number;
  /** Extend carousel to full viewport width (Figma bleed layout). */
  fullBleed?: boolean;
  /** Snap alignment — center matches Figma insight carousel peek effect. */
  snapAlign?: "start" | "center";
};

function getScrollMetrics(element: HTMLElement, isRtl: boolean) {
  const { scrollLeft, scrollWidth, clientWidth } = element;
  const maxScroll = Math.max(0, scrollWidth - clientWidth);

  if (maxScroll <= 1) {
    return { canScrollPrev: false, canScrollNext: false };
  }

  if (isRtl) {
    const normalizedLeft = Math.abs(scrollLeft);
    return {
      canScrollPrev: normalizedLeft < maxScroll - 1,
      canScrollNext: normalizedLeft > 1,
    };
  }

  return {
    canScrollPrev: scrollLeft > 1,
    canScrollNext: scrollLeft < maxScroll - 1,
  };
}

function getActiveSlideIndex(
  scroller: HTMLElement,
  slides: HTMLDivElement[],
  snapAlign: "start" | "center",
) {
  const anchor =
    snapAlign === "center"
      ? scroller.scrollLeft + scroller.clientWidth / 2
      : scroller.scrollLeft + 16;

  let closest = 0;
  let minDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const slideAnchor =
      snapAlign === "center"
        ? slide.offsetLeft + slide.offsetWidth / 2
        : slide.offsetLeft;
    const distance = Math.abs(anchor - slideAnchor);
    if (distance < minDistance) {
      minDistance = distance;
      closest = index;
    }
  });

  return closest;
}

export function CardCarousel({
  children,
  className,
  slideClassName,
  slideWidth = 408,
  gap = 24,
  fullBleed = false,
  snapAlign = "start",
}: CardCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const isRtl = document.documentElement.dir === "rtl";
    const metrics = getScrollMetrics(element, isRtl);
    setCanScrollPrev(metrics.canScrollPrev);
    setCanScrollNext(metrics.canScrollNext);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [updateScrollState, children]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (direction: "prev" | "next") => {
    const element = scrollRef.current;
    if (!element) return;

    const slides = slideRefs.current.filter(
      (slide): slide is HTMLDivElement => slide !== null,
    );
    if (slides.length === 0) return;

    const currentIndex = getActiveSlideIndex(element, slides, snapAlign);
    const nextIndex =
      direction === "next"
        ? Math.min(currentIndex + 1, slides.length - 1)
        : Math.max(currentIndex - 1, 0);

    slides[nextIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: snapAlign === "center" ? "center" : "start",
    });
  };

  const items = Children.toArray(children);

  const snapClass = snapAlign === "center" ? "snap-center" : "snap-start";
  const navButtonClass =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-brand shadow-[var(--shadow-card)] transition hover:bg-sapphire-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30";

  return (
    <div
      className={cn(
        "relative",
        fullBleed && "left-1/2 w-screen max-w-[100vw] -translate-x-1/2",
        className,
      )}
    >
      {canScrollPrev ? (
        <button
          type="button"
          aria-label="Previous slide"
          className={cn(
            navButtonClass,
            fullBleed ? "start-4 sm:start-8" : "start-0 -translate-x-1/2 sm:start-2 sm:translate-x-0",
          )}
          onClick={() => scroll("prev")}
        >
          <Icon name="chevronLeft" className="h-5 w-5 rtl:rotate-180" />
        </button>
      ) : null}
      {canScrollNext ? (
        <button
          type="button"
          aria-label="Next slide"
          className={cn(
            navButtonClass,
            fullBleed ? "end-4 sm:end-8" : "end-0 translate-x-1/2 sm:end-2 sm:translate-x-0",
          )}
          onClick={() => scroll("next")}
        >
          <Icon name="chevronRight" className="h-5 w-5 rtl:rotate-180" />
        </button>
      ) : null}
      <div
        ref={scrollRef}
        className={cn(
          "flex snap-x snap-mandatory scroll-smooth items-stretch overflow-x-auto overscroll-x-contain pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        style={{
          gap: `${gap}px`,
          scrollPaddingInline:
            snapAlign === "center"
              ? `max(1.25rem, calc((100vw - ${slideWidth}px) / 2))`
              : undefined,
        }}
      >
        {items.map((child, index) => (
          <div
            key={index}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
            className={cn("flex shrink-0", snapClass, slideClassName)}
            style={{
              width: `clamp(280px, 85vw, ${slideWidth}px)`,
              minWidth: `clamp(280px, 85vw, ${slideWidth}px)`,
            }}
          >
            <div className="flex h-full w-full [&>*]:h-full [&>*]:w-full">{child}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
