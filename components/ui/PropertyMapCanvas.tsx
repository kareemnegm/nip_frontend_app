"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import {
  buildGoogleMapsQuery,
  getGoogleMapsDirectionsUrl,
  getGoogleMapsUrl,
} from "@/lib/maps/coordinates";
import { NIP_PROPERTY_MAP_STYLES } from "@/lib/maps/google-map-styles";
import { Icon } from "./Icon";

type GoogleMapsApi = typeof google.maps;

declare global {
  interface Window {
    google?: { maps: GoogleMapsApi };
  }
}

let mapsLoader: Promise<GoogleMapsApi> | null = null;

function loadGoogleMaps(apiKey: string): Promise<GoogleMapsApi> {
  if (typeof window !== "undefined" && window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (!mapsLoader) {
    mapsLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.maps) {
          resolve(window.google.maps);
          return;
        }
        reject(new Error("Google Maps failed to load"));
      };
      script.onerror = () => reject(new Error("Google Maps script failed"));
      document.head.appendChild(script);
    });
  }

  return mapsLoader;
}

function createMapPin(maps: GoogleMapsApi) {
  return {
    path: "M18 0C8.059 0 0 8.059 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.059 27.941 0 18 0z",
    fillColor: "#4a4a4a",
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 1.5,
    scale: 0.9,
    anchor: new maps.Point(18, 46),
  };
}

type PropertyMapCanvasProps = {
  latitude: number;
  longitude: number;
  apiKey: string;
  propertyTitle?: string;
  locationName?: string;
  locale?: string;
};

export function PropertyMapCanvas({
  latitude,
  longitude,
  apiKey,
  propertyTitle,
  locationName,
  locale = "en",
}: PropertyMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardTitle = propertyTitle?.trim() || locationName?.trim() || "Property location";
  const cardSubtitle = locationName?.trim();
  const googleMapsUrl = getGoogleMapsUrl(latitude, longitude);
  const directionsUrl = getGoogleMapsDirectionsUrl({
    latitude,
    longitude,
    propertyTitle,
    locationName,
  });
  const placeQuery = buildGoogleMapsQuery({
    latitude,
    longitude,
    propertyTitle,
    locationName,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let map: google.maps.Map | null = null;
    let marker: google.maps.Marker | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let cancelled = false;

    void loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !containerRef.current) return;

        const center = { lat: latitude, lng: longitude };

        map = new maps.Map(container, {
          center,
          zoom: 14,
          styles: NIP_PROPERTY_MAP_STYLES as google.maps.MapTypeStyle[],
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: maps.ControlPosition.RIGHT_BOTTOM,
          },
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: maps.MapTypeControlStyle.DEFAULT,
            position: maps.ControlPosition.LEFT_BOTTOM,
            mapTypeIds: ["roadmap", "satellite"],
          },
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: maps.ControlPosition.RIGHT_BOTTOM,
          },
          streetViewControl: false,
          clickableIcons: false,
        });

        marker = new maps.Marker({
          map,
          position: center,
          icon: createMapPin(maps),
          title: cardTitle,
        });

        resizeObserver = new ResizeObserver(() => {
          if (!map) return;
          maps.event.trigger(map, "resize");
          map.setCenter(center);
        });
        resizeObserver.observe(container);
      })
      .catch(() => {
        // Keep the info card visible even if the map script fails.
      });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      marker?.setMap(null);
      map = null;
    };
  }, [apiKey, latitude, longitude, cardTitle]);

  return (
    <>
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute inset-0 z-[1] p-3 sm:p-4">
        <div className="pointer-events-auto max-w-[280px] rounded-[10px] bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.25)] sm:max-w-[320px] sm:p-4">
          <p className="text-[13px] font-semibold leading-[18px] text-ink">{cardTitle}</p>
          {cardSubtitle ? (
            <p className="mt-1 text-[11px] leading-4 text-ink-secondary">{cardSubtitle}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-medium leading-4">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent transition-colors hover:text-accent-hover"
            >
              <Icon name="arrowRight" className="h-3.5 w-3.5 rotate-[-45deg]" />
              {locale === "ar" ? "عرض على خرائط Google" : "View on Google Maps"}
            </a>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent transition-colors hover:text-accent-hover"
            >
              <Icon name="mapPin" className="h-3.5 w-3.5" />
              {locale === "ar" ? "الاتجاهات" : "Directions"}
            </a>
          </div>
          <span className="sr-only">{placeQuery}</span>
        </div>
      </div>
    </>
  );
}

export function PropertyMapEmbedFallback({
  embedUrl,
  label,
  className,
}: {
  embedUrl: string;
  label?: string;
  className?: string;
}) {
  return (
    <iframe
      title={label ?? "Property location map"}
      src={embedUrl}
      className={cn(
        "absolute inset-0 h-full w-full border-0",
        "nip-property-map-embed",
        className,
      )}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
