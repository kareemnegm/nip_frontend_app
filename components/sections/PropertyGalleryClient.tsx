"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { PropertyGalleryImage } from "@/types/api/property";

type GalleryTypeGroup = "interior" | "exterior" | "other";

function GalleryPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-[var(--radius-card)] bg-basalt-100",
        className,
      )}
    >
      <Icon name="home" className="h-[70px] w-[70px] text-white" />
    </div>
  );
}

function normalizeType(type?: string | null): GalleryTypeGroup {
  const value = type?.toLowerCase().trim() ?? "";
  if (value.includes("interior")) return "interior";
  if (value.includes("exterior")) return "exterior";
  return "other";
}

function typeLabel(type: GalleryTypeGroup, t: ReturnType<typeof useTranslations>): string | null {
  if (type === "interior") return t("interior");
  if (type === "exterior") return t("exterior");
  return null;
}

type PropertyGalleryClientProps = {
  images?: PropertyGalleryImage[];
  title?: string;
};

export function PropertyGalleryClient({
  images = [],
  title = "Property",
}: PropertyGalleryClientProps) {
  const t = useTranslations("catalog");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const grouped = useMemo(() => {
    const groups: Record<GalleryTypeGroup, PropertyGalleryImage[]> = {
      interior: [],
      exterior: [],
      other: [],
    };

    for (const image of images) {
      groups[normalizeType(image.type)].push(image);
    }

    return groups;
  }, [images]);

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => (current <= 0 ? images.length - 1 : current - 1));
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current >= images.length - 1 ? 0 : current + 1));
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeLightbox, lightboxOpen, showNext, showPrevious]);

  const [primary, ...rest] = images;
  const extraCount = Math.max(0, images.length - 3);
  const thumbnails = rest.length > 0 ? rest.slice(0, 2) : primary ? [primary, primary] : [];

  if (!primary) {
    return (
      <div className="flex flex-col gap-3 lg:flex-row">
        <GalleryPlaceholder className="h-[280px] w-full lg:h-[460px] lg:max-w-[708px] lg:flex-[708]" />
        <div className="flex w-full flex-col gap-3 lg:w-[360px] lg:shrink-0">
          <GalleryPlaceholder className="h-[224px] w-full" />
          <GalleryPlaceholder className="h-[224px] w-full" />
        </div>
      </div>
    );
  }

  const activeImage = images[activeIndex];
  const activeType = activeImage ? normalizeType(activeImage.type) : "other";
  const activeTypeText = typeLabel(activeType, t);

  const lightbox =
    lightboxOpen && mounted && activeImage
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] flex flex-col bg-black/95"
            role="dialog"
            aria-modal="true"
            aria-label={t("viewAllPhotos")}
            onClick={closeLightbox}
          >
            <div
              className="flex min-h-0 flex-1 flex-col"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <p className="text-sm font-medium text-white/80">
                {t("photoOf", { current: activeIndex + 1, total: images.length })}
                {activeTypeText ? ` · ${activeTypeText}` : ""}
              </p>
              <button
                type="button"
                onClick={closeLightbox}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label={t("closeGallery")}
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
              <button
                type="button"
                onClick={showPrevious}
                className="absolute start-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:start-4"
                aria-label={t("previousPhoto")}
              >
                <Icon name="chevronLeft" className="h-6 w-6" />
              </button>

              <div className="relative h-full max-h-[60vh] w-full max-w-5xl">
                <Image
                  src={activeImage.url}
                  alt={`${title} ${activeIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                />
              </div>

              <button
                type="button"
                onClick={showNext}
                className="absolute end-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:end-4"
                aria-label={t("nextPhoto")}
              >
                <Icon name="chevronRight" className="h-6 w-6" />
              </button>
            </div>

            <div
              className="max-h-[28vh] overflow-y-auto border-t border-white/10 px-4 py-4 sm:px-6"
              onClick={(event) => event.stopPropagation()}
            >
              {(["interior", "exterior", "other"] as const).map((group) => {
                const groupImages = grouped[group];
                const groupTitle = typeLabel(group, t);

                if (groupImages.length === 0) return null;

                return (
                  <div key={group} className="mb-4 last:mb-0">
                    {groupTitle && group !== "other" ? (
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
                        {groupTitle}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      {groupImages.map((image) => {
                        const index = images.findIndex((item) => item.url === image.url);
                        const isActive = index === activeIndex;

                        return (
                          <button
                            key={`${image.url}-${index}`}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                              "relative h-16 w-24 overflow-hidden rounded-md border-2 transition",
                              isActive ? "border-white" : "border-transparent opacity-70 hover:opacity-100",
                            )}
                          >
                            <Image
                              src={image.url}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row">
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="relative h-[280px] w-full cursor-pointer overflow-hidden rounded-[var(--radius-card)] lg:h-[460px] lg:max-w-[708px] lg:flex-[708]"
        >
          <Image
            src={primary.url}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 708px"
            priority
          />
        </button>

        <div className="flex w-full flex-col gap-3 lg:w-[360px] lg:shrink-0">
          {thumbnails.map((image, index) => {
            const imageIndex = index + 1;
            const isLast = index === thumbnails.length - 1;
            const showViewAll = isLast && images.length > 1;

            return (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() => openLightbox(imageIndex)}
                className="relative h-[224px] w-full cursor-pointer overflow-hidden rounded-[var(--radius-card)]"
              >
                <Image
                  src={image.url}
                  alt={`${title} ${index + 2}`}
                  fill
                  className="object-cover"
                  sizes="360px"
                />
                {showViewAll ? (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/45 text-white">
                    {extraCount > 0 ? (
                      <span className="text-lg font-semibold">
                        {t("morePhotos", { count: extraCount })}
                      </span>
                    ) : null}
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                      {t("viewAllPhotos")}
                    </span>
                    <span className="text-xs text-white/80">
                      {t("photosCount", { count: images.length })}
                    </span>
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
      {lightbox}
    </>
  );
}
