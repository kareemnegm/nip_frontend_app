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
  /** When true, reaching the last slide jumps back to the first (and vice versa). Defaults to `autoPlay`. */
  loop?: boolean;
  /** Auto-scroll reverses at each end instead of jumping (marquee-style back-and-forth). */
  autoPlayBounce?: boolean;
  /**
   * `slide` — advance one card every interval (smooth, mobile-friendly).
   * `continuous` — pixel crawl every frame (desktop only).
   */
  autoPlayMode?: "slide" | "continuous";
  /** Milliseconds between auto-advances when `autoPlayMode` is `slide`. */
  autoPlayInterval?: number;
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

function jumpToSlide(
  scroller: HTMLElement,
  slides: HTMLDivElement[],
  index: number,
  snapAlign: "start" | "center",
  behavior: ScrollBehavior = "auto",
) {
  const slide = slides[index];
  if (!slide) return;

  const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  const slideOffset = slide.offsetLeft;
  const slideSize = slide.offsetWidth;
  const containerSize = scroller.clientWidth;

  let targetScroll =
    snapAlign === "center"
      ? slideOffset + slideSize / 2 - containerSize / 2
      : slideOffset;

  targetScroll = Math.max(0, Math.min(maxScroll, targetScroll));

  scroller.scrollTo({
    left: targetScroll,
    behavior,
  });
}

function getScrollBounds(element: HTMLElement, isRtl: boolean) {
  const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth);
  if (maxScroll <= 1) {
    return { canScrollPrev: false, canScrollNext: false, maxScroll };
  }

  if (!isRtl) {
    const left = element.scrollLeft;
    return {
      canScrollPrev: left > 2,
      canScrollNext: left < maxScroll - 2,
      maxScroll,
    };
  }

  return { ...getScrollMetrics(element, isRtl), maxScroll };
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
  loop,
  autoPlayBounce = true,
  autoPlayMode = "slide",
  autoPlayInterval = 4500,
}: CardCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayDirectionRef = useRef(1);
  const userInteractingRef = useRef(false);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollStateRafRef = useRef(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverEdge, setHoverEdge] = useState<"left" | "right" | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [isInView, setIsInView] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && prefersReducedMotion(),
  );

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isVerticalTouch, setIsVerticalTouch] = useState(false);

  const shouldAutoPlay = autoPlay && !reducedMotion && isInView;
  const shouldEdgeScroll = hoverEdgeScroll && !reducedMotion && canHover;
  const shouldLoop = loop ?? autoPlay;
  const enableFocusEffect = focusOnHover;
  const enableHoverIndex = focusOnHover && canHover;
  const effectiveAutoPlayMode =
    autoPlayMode === "continuous" && canHover ? "continuous" : "slide";
  const centerSpacerWidth = `max(1.25rem, calc(50vw - clamp(140px, 42.5vw, ${slideWidth / 2}px)))`;

  const markUserInteracting = useCallback((pauseMs = 2500) => {
    userInteractingRef.current = true;
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      userInteractingRef.current = false;
      interactionTimeoutRef.current = null;
    }, pauseMs);
  }, []);

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const isRtl = document.documentElement.dir === "rtl";
    const metrics = getScrollBounds(element, isRtl);
    setCanScrollPrev(metrics.canScrollPrev);
    setCanScrollNext(metrics.canScrollNext);

    if (!enableFocusEffect) return;

    const slides = slideRefs.current.filter(
      (slide): slide is HTMLDivElement => slide !== null,
    );
    if (slides.length > 0) {
      setActiveIndex(getActiveSlideIndex(element, slides, snapAlign, isRtl));
    }
  }, [snapAlign, enableFocusEffect]);

  const scheduleScrollStateUpdate = useCallback(() => {
    if (scrollStateRafRef.current) return;
    scrollStateRafRef.current = requestAnimationFrame(() => {
      scrollStateRafRef.current = 0;
      updateScrollState();
    });
  }, [updateScrollState]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry?.isIntersecting ?? false),
      { rootMargin: "80px", threshold: 0.15 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    setReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = () => setCanHover(media.matches);
    setCanHover(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(
    () => () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    updateScrollState();
  }, [updateScrollState, children]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const onScroll = () => scheduleScrollStateUpdate();
    element.addEventListener("scroll", onScroll, { passive: true });
    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, [scheduleScrollStateUpdate]);

  const snapToNearestSlide = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const element = scrollRef.current;
      if (!element || snapAlign !== "center") return;

      const slides = slideRefs.current.filter(
        (slide): slide is HTMLDivElement => slide !== null,
      );
      if (slides.length === 0) return;

      const isRtl = document.documentElement.dir === "rtl";
      const index = getActiveSlideIndex(element, slides, snapAlign, isRtl);
      jumpToSlide(element, slides, index, snapAlign, behavior);
    },
    [snapAlign],
  );

  const advanceAutoSlide = useCallback(() => {
    const element = scrollRef.current;
    if (!element || userInteractingRef.current) return;

    const slides = slideRefs.current.filter(
      (slide): slide is HTMLDivElement => slide !== null,
    );
    if (slides.length <= 1) return;

    const isRtl = document.documentElement.dir === "rtl";
    const currentIndex = getActiveSlideIndex(element, slides, snapAlign, isRtl);

    if (autoPlayBounce) {
      if (currentIndex >= slides.length - 1) {
        autoPlayDirectionRef.current = -1;
      } else if (currentIndex <= 0) {
        autoPlayDirectionRef.current = 1;
      }
    } else if (currentIndex >= slides.length - 1) {
      autoPlayDirectionRef.current = 1;
    }

    const direction = autoPlayDirectionRef.current;
    let nextIndex = currentIndex + direction;

    if (autoPlayBounce) {
      nextIndex = Math.max(0, Math.min(slides.length - 1, nextIndex));
    } else if (nextIndex >= slides.length) {
      nextIndex = shouldLoop ? 0 : slides.length - 1;
    } else if (nextIndex < 0) {
      nextIndex = shouldLoop ? slides.length - 1 : 0;
    }

    jumpToSlide(element, slides, nextIndex, snapAlign, "smooth");
  }, [autoPlayBounce, shouldLoop, snapAlign]);

  useEffect(() => {
    if (
      !shouldAutoPlay ||
      effectiveAutoPlayMode !== "slide" ||
      isPaused ||
      isDragging ||
      isVerticalTouch
    ) {
      return;
    }

    const id = window.setInterval(advanceAutoSlide, autoPlayInterval);
    return () => window.clearInterval(id);
  }, [
    shouldAutoPlay,
    effectiveAutoPlayMode,
    isPaused,
    isDragging,
    isVerticalTouch,
    autoPlayInterval,
    advanceAutoSlide,
  ]);

  useEffect(() => {
    if (
      !shouldAutoPlay ||
      effectiveAutoPlayMode !== "continuous" ||
      isPaused ||
      isDragging ||
      isVerticalTouch
    ) {
      return;
    }

    const element = scrollRef.current;
    if (!element) return;

    let frameId = 0;

    const tick = () => {
      if (userInteractingRef.current) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      const isRtl = document.documentElement.dir === "rtl";
      const metrics = getScrollBounds(element, isRtl);

      if (autoPlayBounce) {
        if (!metrics.canScrollNext && autoPlayDirectionRef.current > 0) {
          autoPlayDirectionRef.current = -1;
        } else if (!metrics.canScrollPrev && autoPlayDirectionRef.current < 0) {
          autoPlayDirectionRef.current = 1;
        }

        const direction = autoPlayDirectionRef.current;
        const delta = autoPlaySpeed * direction;
        element.scrollBy({
          left: isRtl ? -delta : delta,
          behavior: "auto",
        });
      } else if (!metrics.canScrollNext) {
        const slides = slideRefs.current.filter(
          (slide): slide is HTMLDivElement => slide !== null,
        );
        if (shouldLoop && slides.length > 1) {
          jumpToSlide(element, slides, 0, snapAlign);
          autoPlayDirectionRef.current = 1;
        }
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
  }, [
    shouldAutoPlay,
    effectiveAutoPlayMode,
    shouldLoop,
    autoPlayBounce,
    isPaused,
    isDragging,
    isVerticalTouch,
    autoPlaySpeed,
    snapAlign,
  ]);

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
      const slides = slideRefs.current.filter(
        (slide): slide is HTMLDivElement => slide !== null,
      );

      if (canScroll) {
        const delta = scrollForward ? hoverEdgeScrollSpeed : -hoverEdgeScrollSpeed;
        element.scrollBy({
          left: isRtl ? -delta : delta,
          behavior: "auto",
        });
      } else if (shouldLoop && slides.length > 1) {
        jumpToSlide(element, slides, scrollForward ? 0 : slides.length - 1, snapAlign);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [shouldEdgeScroll, shouldLoop, hoverEdge, isDragging, hoverEdgeScrollSpeed, snapAlign]);

  const scroll = (direction: "prev" | "next") => {
    const element = scrollRef.current;
    if (!element) return;

    const slides = slideRefs.current.filter(
      (slide): slide is HTMLDivElement => slide !== null,
    );
    if (slides.length === 0) return;

    const isRtl = document.documentElement.dir === "rtl";
    const currentIndex = getActiveSlideIndex(element, slides, snapAlign, isRtl);
    let nextIndex: number;

    if (direction === "next") {
      nextIndex =
        currentIndex >= slides.length - 1
          ? shouldLoop
            ? 0
            : slides.length - 1
          : currentIndex + 1;
    } else {
      nextIndex =
        currentIndex <= 0
          ? shouldLoop
            ? slides.length - 1
            : 0
          : currentIndex - 1;
    }

    const isWrapping =
      shouldLoop &&
      ((direction === "next" && currentIndex >= slides.length - 1) ||
        (direction === "prev" && currentIndex <= 0));

    jumpToSlide(element, slides, nextIndex, snapAlign, isWrapping ? "auto" : "smooth");
  };

  const items = Children.toArray(children);
  const focusedIndex = enableHoverIndex
    ? (hoveredIndex ?? activeIndex)
    : enableFocusEffect
      ? activeIndex
      : null;

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
      ref={rootRef}
      className={cn(
        /* Scale-on-focus grows past the slide box — clip horizontally only. */
        "relative overflow-x-hidden overflow-y-visible",
        fullBleed && "left-1/2 w-screen max-w-[100vw] -translate-x-1/2",
        className,
      )}
    >
      {canScrollPrev || shouldLoop ? (
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
      {canScrollNext || shouldLoop ? (
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
          "flex items-start overflow-x-auto overflow-y-visible overscroll-x-contain",
          /* Room for scale(1.04), card lift, and hover shadow so borders never clip. */
          enableFocusEffect && "py-3 sm:py-4",
          shouldEdgeScroll && hoverEdge === "left" && "cursor-w-resize rtl:cursor-e-resize",
          shouldEdgeScroll && hoverEdge === "right" && "cursor-e-resize rtl:cursor-w-resize",
          shouldAutoPlay &&
            effectiveAutoPlayMode === "continuous" &&
            !isPaused &&
            !isDragging &&
            !isVerticalTouch
            ? "snap-none"
            : hoverEdge
              ? "snap-none"
              : snapAlign === "center"
                ? "snap-x snap-mandatory"
                : "snap-x snap-proximity",
          "[overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
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
            snapAlign === "center" ? centerSpacerWidth : undefined,
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
          markUserInteracting();
        }}
        onPointerUp={() => setIsDragging(false)}
        onPointerCancel={() => setIsDragging(false)}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          if (touch) {
            touchStartRef.current = { x: touch.clientX, y: touch.clientY };
          }
          setIsVerticalTouch(false);
          markUserInteracting(3500);
        }}
        onTouchMove={(event) => {
          const start = touchStartRef.current;
          const touch = event.touches[0];
          if (!start || !touch) return;

          const deltaX = Math.abs(touch.clientX - start.x);
          const deltaY = Math.abs(touch.clientY - start.y);

          if (deltaX > deltaY + 4) {
            markUserInteracting(3500);
          }

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
          markUserInteracting(3500);
          window.requestAnimationFrame(() => snapToNearestSlide("smooth"));
        }}
        onTouchCancel={() => {
          touchStartRef.current = null;
          setIsVerticalTouch(false);
          setIsDragging(false);
          markUserInteracting(3500);
          window.requestAnimationFrame(() => snapToNearestSlide("smooth"));
        }}
      >
        {snapAlign === "center" ? (
          <div
            aria-hidden
            className="shrink-0"
            style={{ width: centerSpacerWidth, minWidth: centerSpacerWidth }}
          />
        ) : null}
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
                enableFocusEffect && "motion-carousel-slide",
                enableFocusEffect && focusedIndex === index && "is-focused",
                trackHeight !== undefined ? "h-full [&>*]:h-full" : "[&>*]:h-full",
              )}
            >
              {child}
            </div>
          </div>
        ))}
        {snapAlign === "center" ? (
          <div
            aria-hidden
            className="shrink-0"
            style={{ width: centerSpacerWidth, minWidth: centerSpacerWidth }}
          />
        ) : null}
      </div>
    </div>
  );
}
