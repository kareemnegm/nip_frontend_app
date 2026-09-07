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
  /** Gentle auto-scroll. Disabled when prefers-reduced-motion. */
  autoPlay?: boolean;
  /** Pixels advanced per animation frame (continuous mode, desktop). */
  autoPlaySpeed?: number;
  /** Pause auto-scroll while pointer is over the track (desktop). */
  pauseOnHover?: boolean;
  /** Scroll continuously while pointer hovers the left/right edge of the track. */
  hoverEdgeScroll?: boolean;
  /** Pixels advanced per frame during edge-hover scroll. */
  hoverEdgeScrollSpeed?: number;
  /** Scale up hovered or centered slide. */
  focusOnHover?: boolean;
  /** Reverse direction at each end instead of jumping to the first slide. */
  autoPlayBounce?: boolean;
  /**
   * `slide` — advance one card on an interval (mobile-friendly).
   * `continuous` — pixel crawl every frame (desktop).
   */
  autoPlayMode?: "slide" | "continuous";
  /** Milliseconds between auto-advances in slide mode. */
  autoPlayInterval?: number;
};

function getScrollMetrics(element: HTMLElement, isRtl: boolean) {
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

  const first = element.firstElementChild as HTMLElement | null;
  const last = element.lastElementChild as HTMLElement | null;
  if (!first || !last) {
    return { canScrollPrev: false, canScrollNext: false, maxScroll };
  }

  const containerRect = element.getBoundingClientRect();
  const firstRect = first.getBoundingClientRect();
  const lastRect = last.getBoundingClientRect();
  const epsilon = 2;

  return {
    canScrollPrev: firstRect.right > containerRect.right + epsilon,
    canScrollNext: lastRect.left < containerRect.left - epsilon,
    maxScroll,
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
  behavior: ScrollBehavior = "smooth",
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
  scroller.scrollTo({ left: targetScroll, behavior });
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
  autoPlayBounce = true,
  autoPlayMode = "slide",
  autoPlayInterval = 4500,
}: CardCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayDirectionRef = useRef(1);
  const activeIndexRef = useRef(0);
  const userInteractingRef = useRef(false);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

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
  const [isTouchScrolling, setIsTouchScrolling] = useState(false);
  const [isVerticalTouch, setIsVerticalTouch] = useState(false);

  const isTouchDevice = !canHover;
  const shouldAutoPlay = autoPlay && !reducedMotion && isInView;
  const shouldEdgeScroll = hoverEdgeScroll && !reducedMotion && canHover;
  const enableFocusEffect = focusOnHover;
  const enableHoverIndex = focusOnHover && canHover;
  const autoPlayPausedByInteraction = isTouchDevice
    ? isTouchScrolling || isVerticalTouch
    : isDragging || isVerticalTouch;
  const effectiveAutoPlayMode =
    autoPlayMode === "continuous" && canHover ? "continuous" : "slide";

  const markUserInteracting = useCallback((pauseMs = 1800) => {
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
    const metrics = getScrollMetrics(element, isRtl);
    setCanScrollPrev(metrics.canScrollPrev);
    setCanScrollNext(metrics.canScrollNext);

    const slides = slideRefs.current.filter(
      (slide): slide is HTMLDivElement => slide !== null,
    );
    if (slides.length > 0) {
      const index = getActiveSlideIndex(element, slides, snapAlign, isRtl);
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  }, [snapAlign]);

  const advanceAutoSlide = useCallback(() => {
    const element = scrollRef.current;
    if (!element || userInteractingRef.current || isPaused) return;

    const slides = slideRefs.current.filter(
      (slide): slide is HTMLDivElement => slide !== null,
    );
    if (slides.length <= 1) return;

    const currentIndex = activeIndexRef.current;

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
      nextIndex = 0;
    } else if (nextIndex < 0) {
      nextIndex = slides.length - 1;
    }

    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
    jumpToSlide(element, slides, nextIndex, snapAlign, "smooth");
  }, [autoPlayBounce, isPaused, snapAlign]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry?.isIntersecting ?? false),
      { rootMargin: "80px", threshold: 0.1 },
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

    element.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  useEffect(() => {
    if (
      !shouldAutoPlay ||
      effectiveAutoPlayMode !== "slide" ||
      autoPlayPausedByInteraction
    ) {
      return;
    }

    const id = window.setInterval(advanceAutoSlide, autoPlayInterval);
    return () => window.clearInterval(id);
  }, [
    shouldAutoPlay,
    effectiveAutoPlayMode,
    autoPlayPausedByInteraction,
    autoPlayInterval,
    advanceAutoSlide,
  ]);

  useEffect(() => {
    if (
      !shouldAutoPlay ||
      effectiveAutoPlayMode !== "continuous" ||
      isPaused ||
      autoPlayPausedByInteraction
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
      const metrics = getScrollMetrics(element, isRtl);

      if (autoPlayBounce) {
        if (!metrics.canScrollNext && autoPlayDirectionRef.current > 0) {
          autoPlayDirectionRef.current = -1;
        } else if (!metrics.canScrollPrev && autoPlayDirectionRef.current < 0) {
          autoPlayDirectionRef.current = 1;
        }

        const delta = autoPlaySpeed * autoPlayDirectionRef.current;
        element.scrollBy({
          left: isRtl ? -delta : delta,
          behavior: "auto",
        });
      } else if (!metrics.canScrollNext) {
        const slides = slideRefs.current.filter(
          (slide): slide is HTMLDivElement => slide !== null,
        );
        if (slides.length > 0) {
          jumpToSlide(element, slides, 0, snapAlign, "smooth");
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
    autoPlayBounce,
    isPaused,
    autoPlayPausedByInteraction,
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

    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
    jumpToSlide(element, slides, nextIndex, snapAlign, "smooth");
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
          enableFocusEffect && "py-3 sm:py-4",
          shouldEdgeScroll && hoverEdge === "left" && "cursor-w-resize rtl:cursor-e-resize",
          shouldEdgeScroll && hoverEdge === "right" && "cursor-e-resize rtl:cursor-w-resize",
          shouldAutoPlay &&
            effectiveAutoPlayMode === "continuous" &&
            !isPaused &&
            !autoPlayPausedByInteraction
            ? "snap-none"
            : hoverEdge
              ? "snap-none"
              : isTouchDevice
                ? "snap-x snap-proximity"
                : "snap-x snap-mandatory",
          "touch-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          trackHeight !== undefined && "h-[var(--carousel-track-height)]",
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
          if (shouldAutoPlay && pauseOnHover && canHover) setIsPaused(true);
        }}
        onMouseLeave={() => {
          if (shouldAutoPlay && pauseOnHover && canHover) setIsPaused(false);
          setHoverEdge(null);
        }}
        onMouseMove={(event) => {
          updateHoverEdgeFromPointer(event.clientX, event.currentTarget);
        }}
        {...(canHover
          ? {
              onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
                if (event.pointerType !== "mouse") return;
                setIsDragging(true);
                setHoverEdge(null);
                markUserInteracting();
              },
              onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => {
                if (event.pointerType !== "mouse") return;
                setIsDragging(false);
              },
              onPointerCancel: (event: React.PointerEvent<HTMLDivElement>) => {
                if (event.pointerType !== "mouse") return;
                setIsDragging(false);
              },
            }
          : {})}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          if (touch) {
            touchStartRef.current = { x: touch.clientX, y: touch.clientY };
          }
          setIsVerticalTouch(false);
          setIsTouchScrolling(false);
        }}
        onTouchMove={(event) => {
          const start = touchStartRef.current;
          const touch = event.touches[0];
          if (!start || !touch) return;

          const deltaX = Math.abs(touch.clientX - start.x);
          const deltaY = Math.abs(touch.clientY - start.y);

          if (deltaX > 8 && deltaX > deltaY) {
            setIsTouchScrolling(true);
            markUserInteracting(1200);
          }

          if (deltaY > deltaX + 10) {
            setIsVerticalTouch(true);
            setIsTouchScrolling(false);
          }
        }}
        onTouchEnd={() => {
          touchStartRef.current = null;
          setIsVerticalTouch(false);
          setIsTouchScrolling(false);
        }}
        onTouchCancel={() => {
          touchStartRef.current = null;
          setIsVerticalTouch(false);
          setIsTouchScrolling(false);
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
                enableFocusEffect && "motion-carousel-slide",
                enableFocusEffect && focusedIndex === index && "is-focused",
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
