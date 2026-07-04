export function resolveCoordinates(
  latitude?: number | null,
  longitude?: number | null,
): { latitude: number; longitude: number } | null {
  if (
    latitude == null ||
    longitude == null ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return { latitude, longitude };
}

export function hasValidCoordinates(
  latitude?: number | null,
  longitude?: number | null,
): boolean {
  return resolveCoordinates(latitude, longitude) != null;
}

export function getGoogleMapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

export function getGoogleMapsDirectionsUrl(options: {
  latitude: number;
  longitude: number;
  propertyTitle?: string | null;
  locationName?: string | null;
}): string {
  const destination = encodeURIComponent(buildGoogleMapsQuery(options));
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

export function buildGoogleMapsQuery(options: {
  latitude: number;
  longitude: number;
  propertyTitle?: string | null;
  locationName?: string | null;
}): string {
  const title = options.propertyTitle?.trim();
  const location = options.locationName?.trim();

  if (title && location) return `${title}, ${location}`;
  if (title) return title;
  if (location) return location;
  return `${options.latitude},${options.longitude}`;
}

export function getGoogleMapsEmbedUrl(options: {
  latitude: number;
  longitude: number;
  propertyTitle?: string | null;
  locationName?: string | null;
  locale?: string;
}): string {
  const { latitude, longitude, locale = "en" } = options;
  const query = encodeURIComponent(buildGoogleMapsQuery(options));

  return `https://maps.google.com/maps?q=${query}&ll=${latitude},${longitude}&hl=${locale}&z=14&output=embed`;
}
