import { apiRequest, unwrapData } from "./client";

export type MediaUploadResponse = {
  id: string;
  url: string;
  filename?: string;
  mimeType?: string;
  fileSize?: number;
  width?: number;
  height?: number;
};

export async function uploadMedia(
  formData: FormData,
  token: string,
): Promise<MediaUploadResponse> {
  const response = await apiRequest<MediaUploadResponse | { data: MediaUploadResponse }>(
    "/media",
    {
      method: "POST",
      body: formData,
      token,
      revalidate: false,
    },
  );
  return unwrapData(response);
}
