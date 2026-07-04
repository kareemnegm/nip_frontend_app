import { cn } from "@/lib/cn";
import { getGoogleMapsEmbedUrl, resolveCoordinates } from "@/lib/maps/coordinates";
import { Icon } from "./Icon";
import { PropertyMapCanvas, PropertyMapEmbedFallback } from "./PropertyMapCanvas";

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
  propertyTitle?: string;
  locale?: string;
  className?: string;
};

export function PropertyMap({
  latitude,
  longitude,
  label,
  locationName,
  propertyTitle,
  locale = "en",
  className,
}: PropertyMapProps) {
  const coordinates = resolveCoordinates(latitude, longitude);
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();

  if (!coordinates) {
    return <PropertyMapPlaceholder className={className} />;
  }

  const embedUrl = getGoogleMapsEmbedUrl({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    propertyTitle,
    locationName,
    locale,
  });

  return (
    <div
      className={cn(
        "nip-property-map-frame relative overflow-hidden rounded-[var(--radius-card)] border border-line shadow-[var(--shadow-card)]",
        !mapsApiKey && "nip-property-map-frame--embed",
        className,
      )}
      role="region"
      aria-label={label ?? "Property location map"}
    >
      {mapsApiKey ? (
        <PropertyMapCanvas
          apiKey={mapsApiKey}
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
          propertyTitle={propertyTitle}
          locationName={locationName}
          locale={locale}
        />
      ) : (
        <PropertyMapEmbedFallback embedUrl={embedUrl} label={label} />
      )}
    </div>
  );
}
