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
  /** Fixed track height — Figma property row h=480px; omit for auto height. */
  trackHeight?: number;
  /** Extend carousel to full viewport width (Figma bleed layout). */
  fullBleed?: boolean;
  /** Snap alignment — center matches Figma insight carousel peek effect. */
  snapAlign?: "start" | "center";
  /** Gentle continuous auto-scroll. Disabled when prefers-reduced-motion. */
  autoPlay?: boolean;
  /** Pixels advanced per animation frame while auto-playing. */
  autoPlaySpeed?: number;
  /** Pause auto-scroll while pointer is over the track. */
  pauseOnHover?: boolean;
  /** Scroll continuously while pointer hovers the left/right edge of the track. */
  hoverEdgeScroll?: boolean;
  /** Pixels advanced per frame during edge-hover scroll. */
  hoverEdgeScrollSpeed?: number;
  /** Scale up hovered or centered slide. */
  focusOnHover?: boolean;
};

function getScrollMetrics(element: HTMLElement, isRtl: boolean) {
  const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth);
  if (maxScroll <= 1) {
    return { canScrollPrev: false, canScrollNext: false };
  }

  const first = element.firstElementChild as HTMLElement | null;
  const last = element.lastElementChild as HTMLElement | null;
  if (!first || !last) {
    return { canScrollPrev: false, canScrollNext: false };
  }

  // Prefer geometry over scrollLeft — RTL scrollLeft signs differ by browser.
  const containerRect = element.getBoundingClientRect();
  const firstRect = first.getBoundingClientRect();
  const lastRect = last.getBoundingClientRect();
  const epsilon = 2;

  if (isRtl) {
    // Start is on the right: next reveals content to the left.
    return {
      canScrollPrev: firstRect.right > containerRect.right + epsilon,
      canScrollNext: lastRect.left < containerRect.left - epsilon,
    };
  }

  return {
    canScrollPrev: firstRect.left < containerRect.left - epsilon,
    canScrollNext: lastRect.right > containerRect.right + epsilon,
  };
}

function getActiveSlideIndex(
  scroller: HTMLElement,
  slides: HTMLDivElement[],
  snapAlign: "start" | "center",
  isRtl: boolean,
) {
  const scrollerRect = scroller.getBoundingClientRect();
  const anchor =
    snapAlign === "center"
      ? scrollerRect.left + scrollerRect.width / 2
      : isRtl
        ? scrollerRect.right - 16
        : scrollerRect.left + 16;

  let closest = 0;
  let minDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const rect = slide.getBoundingClientRect();
    const slideAnchor =
      snapAlign === "center"
        ? rect.left + rect.width / 2
        : isRtl
          ? rect.right
          : rect.left;
    const distance = Math.abs(anchor - slideAnchor);
    if (distance < minDistance) {
      minDistance = distance;
      closest = index;
    }
  });

  return closest;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CardCarousel({
  children,
  className,
  slideClassName,
  slideWidth = 408,
  gap = 24,
  trackHeight,
  fullBleed = false,
  snapAlign = "start",
  autoPlay = false,
  autoPlaySpeed = 0.5,
  pauseOnHover = true,
  hoverEdgeScroll = true,
  hoverEdgeScrollSpeed = 2,
  focusOnHover = true,
}: CardCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverEdge, setHoverEdge] = useState<"left" | "right" | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && prefersReducedMotion(),
  );

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isVerticalTouch, setIsVerticalTouch] = useState(false);

  const shouldAutoPlay = autoPlay && !reducedMotion;
  const shouldEdgeScroll = hoverEdgeScroll && !reducedMotion;

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const isRtl = document.documentElement.dir === "rtl";
    const metrics = getScrollMetrics(element, isRtl);
    setCanScrollPrev(metrics.canScrollPrev);
    setCanScrollNext(metrics.canScrollNext);

    const slides = slideRefs.current.filter(
      (slide): slide is HTMLDivElement => slide !== null,
    );
    if (slides.length > 0) {
      setActiveIndex(getActiveSlideIndex(element, slides, snapAlign, isRtl));
    }
  }, [snapAlign]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
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

  useEffect(() => {
    if (!shouldAutoPlay || isPaused || isDragging || isVerticalTouch) return;

    const element = scrollRef.current;
    if (!element) return;

    let frameId = 0;

    const tick = () => {
      const isRtl = document.documentElement.dir === "rtl";
      const metrics = getScrollMetrics(element, isRtl);

      if (!metrics.canScrollNext) {
        const slides = slideRefs.current.filter(
          (slide): slide is HTMLDivElement => slide !== null,
        );
        slides[0]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: snapAlign === "center" ? "center" : "start",
        });
      } else {
        element.scrollBy({
          left: isRtl ? -autoPlaySpeed : autoPlaySpeed,
          behavior: "auto",
        });
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [shouldAutoPlay, isPaused, isDragging, isVerticalTouch, autoPlaySpeed, snapAlign]);

  useEffect(() => {
    if (!shouldEdgeScroll || !hoverEdge || isDragging) return;

    const element = scrollRef.current;
    if (!element) return;

    let frameId = 0;

    const tick = () => {
      const isRtl = document.documentElement.dir === "rtl";
      const metrics = getScrollMetrics(element, isRtl);
      const scrollForward = hoverEdge === "right";
      const canScroll = scrollForward ? metrics.canScrollNext : metrics.canScrollPrev;

      if (canScroll) {
        const delta = scrollForward ? hoverEdgeScrollSpeed : -hoverEdgeScrollSpeed;
        element.scrollBy({
          left: isRtl ? -delta : delta,
          behavior: "auto",
        });
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [shouldEdgeScroll, hoverEdge, isDragging, hoverEdgeScrollSpeed]);

  const scroll = (direction: "prev" | "next") => {
    const element = scrollRef.current;
    if (!element) return;

    const slides = slideRefs.current.filter(
      (slide): slide is HTMLDivElement => slide !== null,
    );
    if (slides.length === 0) return;

    const isRtl = document.documentElement.dir === "rtl";
    const currentIndex = getActiveSlideIndex(element, slides, snapAlign, isRtl);
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
  const focusedIndex = hoveredIndex ?? (focusOnHover ? activeIndex : null);

  const updateHoverEdgeFromPointer = (clientX: number, track: HTMLElement) => {
    if (!shouldEdgeScroll || isDragging) {
      setHoverEdge(null);
      return;
    }

    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;

    if (ratio < 0.25) {
      setHoverEdge("left");
    } else if (ratio > 0.75) {
      setHoverEdge("right");
    } else {
      setHoverEdge(null);
    }
  };

  const snapClass = snapAlign === "center" ? "snap-center" : "snap-start";
  const navButtonClass =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-brand shadow-[var(--shadow-card)] transition hover:bg-sapphire-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30";

  return (
    <div
      className={cn(
        /* Scale-on-focus grows past the slide box — clip horizontally only. */
        "relative overflow-x-hidden overflow-y-visible",
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
            fullBleed ? "start-4 sm:start-8" : "start-2 sm:start-3",
          )}
          onClick={() => scroll("prev")}
        >
          <Icon name="arrowRight" className="h-5 w-5 rotate-180 rtl:rotate-0" />
        </button>
      ) : null}
      {canScrollNext ? (
        <button
          type="button"
          aria-label="Next slide"
          className={cn(
            navButtonClass,
            fullBleed ? "end-4 sm:end-8" : "end-2 sm:end-3",
          )}
          onClick={() => scroll("next")}
        >
          <Icon name="arrowRight" className="h-5 w-5 rtl:rotate-180" />
        </button>
      ) : null}
      <div
        ref={scrollRef}
        className={cn(
          "flex scroll-smooth items-start overflow-x-auto overflow-y-visible overscroll-x-contain",
          /* Room for scale(1.04), card lift, and hover shadow so borders never clip. */
          focusOnHover && "py-3 sm:py-4",
          shouldEdgeScroll && hoverEdge === "left" && "cursor-w-resize rtl:cursor-e-resize",
          shouldEdgeScroll && hoverEdge === "right" && "cursor-e-resize rtl:cursor-w-resize",
          shouldAutoPlay && !isPaused && !isDragging && !isVerticalTouch
            ? "snap-none"
            : hoverEdge
              ? "snap-none"
              : "snap-x snap-mandatory",
          /* Do not use touch-pan-x — it blocks vertical page scroll when the finger
             starts on a card (common mobile bug). Pan-y on coarse pointers keeps
             page scroll natural; horizontal swipe still works via overflow-x-auto. */
          "touch-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          trackHeight !== undefined && "h-[var(--carousel-track-height)]",
          // Full-bleed carousels lose the page's ambient gutter — restore it on
          // mobile only so the first/last slide isn't flush against the screen
          // edge (desktop/tablet keep the original edge-to-edge bleed).
          fullBleed && "px-5 sm:px-0",
        )}
        style={{
          gap: `${gap}px`,
          ...(trackHeight !== undefined
            ? ({ ["--carousel-track-height" as string]: `${trackHeight}px` } as React.CSSProperties)
            : {}),
          scrollPaddingInline:
            snapAlign === "center"
              ? `max(1.25rem, calc((100vw - ${slideWidth}px) / 2))`
              : undefined,
        }}
        onMouseEnter={() => {
          if (shouldAutoPlay && pauseOnHover) setIsPaused(true);
        }}
        onMouseLeave={() => {
          if (shouldAutoPlay && pauseOnHover) setIsPaused(false);
          setHoverEdge(null);
        }}
        onMouseMove={(event) => {
          updateHoverEdgeFromPointer(event.clientX, event.currentTarget);
        }}
        onPointerDown={() => {
          setIsDragging(true);
          setHoverEdge(null);
        }}
        onPointerUp={() => setIsDragging(false)}
        onPointerCancel={() => setIsDragging(false)}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          if (touch) {
            touchStartRef.current = { x: touch.clientX, y: touch.clientY };
          }
          setIsVerticalTouch(false);
          setIsDragging(true);
        }}
        onTouchMove={(event) => {
          const start = touchStartRef.current;
          const touch = event.touches[0];
          if (!start || !touch) return;

          const deltaX = Math.abs(touch.clientX - start.x);
          const deltaY = Math.abs(touch.clientY - start.y);

          // Once the gesture is clearly vertical, pause carousel capture so the page scrolls.
          if (deltaY > deltaX + 6) {
            setIsVerticalTouch(true);
            setIsDragging(false);
          }
        }}
        onTouchEnd={() => {
          touchStartRef.current = null;
          setIsVerticalTouch(false);
          setIsDragging(false);
        }}
        onTouchCancel={() => {
          touchStartRef.current = null;
          setIsVerticalTouch(false);
          setIsDragging(false);
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
              ...(trackHeight !== undefined ? { height: `${trackHeight}px` } : {}),
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={cn(
                "flex w-full [&>*]:w-full",
                focusOnHover && "motion-carousel-slide",
                focusOnHover && focusedIndex === index && "is-focused",
                trackHeight !== undefined ? "h-full [&>*]:h-full" : "[&>*]:h-full",
              )}
            >
              {child}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
