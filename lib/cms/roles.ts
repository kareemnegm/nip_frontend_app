export type CmsRole = "admin" | "editor" | "viewer" | "member" | string;

export function canEditCms(role: CmsRole | null | undefined): boolean {
  return role === "admin" || role === "editor";
}
