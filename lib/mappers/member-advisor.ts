import { resolveMediaUrl } from "@/lib/api/media-url";

/** API may send camelCase or snake_case advisor photo paths. */
export type AdvisorPhotoFields = {
  photoUrl?: string | null;
  photo_url?: string | null;
};

export function resolveAdvisorPhotoUrl(
  advisor?: AdvisorPhotoFields | null,
): string | undefined {
  return resolveMediaUrl(advisor?.photoUrl ?? advisor?.photo_url);
}
