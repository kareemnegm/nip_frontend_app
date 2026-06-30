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
