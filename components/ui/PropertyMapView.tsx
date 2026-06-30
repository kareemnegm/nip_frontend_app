"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CARTO_VOYAGER =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

const BRAND_PIN_COLOR = "#0b3268";
const PIN_PULSE_COLOR = "rgba(220, 53, 69, 0.45)";

function createBrandPinIcon() {
  const svg = `
    <div class="nip-map-pin-wrap">
      <span class="nip-map-pin-pulse" style="--pin-pulse-color: ${PIN_PULSE_COLOR}"></span>
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46" fill="none" aria-hidden="true">
        <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.059 27.941 0 18 0z" fill="${BRAND_PIN_COLOR}"/>
        <circle cx="18" cy="18" r="7" fill="white"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    className: "nip-property-map-pin",
    html: svg,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
  });
}

function MapResizeFix() {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => {
      map.invalidateSize({ animate: false });
    };

    invalidate();

    const timers = [
      window.setTimeout(invalidate, 100),
      window.setTimeout(invalidate, 350),
    ];

    const container = map.getContainer();
    const resizeTarget = container.parentElement ?? container;
    const observer = new ResizeObserver(invalidate);
    observer.observe(resizeTarget);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, [map]);

  return null;
}

function MapViewport({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], 14, { animate: false });
  }, [latitude, longitude, map]);

  return null;
}

type PropertyMapViewProps = {
  latitude: number;
  longitude: number;
};

export function PropertyMapView({ latitude, longitude }: PropertyMapViewProps) {
  const position: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={14}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      className="nip-property-map absolute inset-0 h-full w-full"
    >
      <TileLayer url={CARTO_VOYAGER} />
      <ZoomControl position="bottomright" />
      <MapResizeFix />
      <MapViewport latitude={latitude} longitude={longitude} />
      <Marker position={position} icon={createBrandPinIcon()} />
    </MapContainer>
  );
}
