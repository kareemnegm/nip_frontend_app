"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";
import { getGoogleMapsUrl, resolveCoordinates } from "@/lib/maps/coordinates";
import { Icon } from "./Icon";

const PropertyMapView = dynamic(
  () => import("./PropertyMapView").then((mod) => mod.PropertyMapView),
  {
    ssr: false,
    loading: () => <PropertyMapPlaceholder className="h-full" />,
  },
);

export function PropertyMapPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-basalt-100",
        className,
      )}
      aria-hidden
    >
      <Icon name="mapPin" className="h-[100px] w-[100px] text-white/80" />
    </div>
  );
}

type PropertyMapProps = {
  latitude?: number | null;
  longitude?: number | null;
  label?: string;
  locationName?: string;
  mapsLinkLabel?: string;
  className?: string;
};

export function PropertyMap({
  latitude,
  longitude,
  label,
  locationName,
  mapsLinkLabel,
  className,
}: PropertyMapProps) {
  const coordinates = resolveCoordinates(latitude, longitude);

  if (!coordinates) {
    return <PropertyMapPlaceholder className={className} />;
  }

  const googleMapsUrl = getGoogleMapsUrl(
    coordinates.latitude,
    coordinates.longitude,
  );

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "nip-property-map-frame relative overflow-hidden rounded-[var(--radius-card)] border border-line shadow-[var(--shadow-card)]",
          className,
        )}
        role="region"
        aria-label={label ?? "Property location map"}
      >
        <PropertyMapView
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
        />

        {locationName ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] p-4">
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-[var(--radius-field)] bg-brand/92 px-3 py-2 text-[11px] font-medium leading-[14px] text-white shadow-[var(--shadow-card)] backdrop-blur-sm">
              <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0 text-white" />
              <span className="truncate">{locationName}</span>
            </span>
          </div>
        ) : null}
      </div>

      {mapsLinkLabel ? (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold leading-4 text-accent transition-colors hover:text-accent-hover"
        >
          {mapsLinkLabel}
          <Icon name="arrowRight" className="h-3.5 w-3.5 shrink-0" />
        </a>
      ) : null}
    </div>
  );
}
