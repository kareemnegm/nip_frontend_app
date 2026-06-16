export const MEMBER_TOKEN_COOKIE = "member_token";

export function getClientMemberToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(MEMBER_TOKEN_COOKIE);
}

export function setClientMemberToken(token: string) {
  localStorage.setItem(MEMBER_TOKEN_COOKIE, token);
}

export function clearClientMemberToken() {
  localStorage.removeItem(MEMBER_TOKEN_COOKIE);
}
