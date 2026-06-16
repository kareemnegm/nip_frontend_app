import type {
  ApiAdvisorNote,
  ApiCuratedItem,
  ApiMemberLoginResponse,
  ApiMemberMessagePayload,
  ApiMemberUser,
  ApiSavedItem,
  MemberPaginated,
} from "@/types/api";
import { apiDelete, apiGet, apiPost, unwrapData } from "./client";

export async function loginMember(email: string, password: string) {
  return apiPost<ApiMemberLoginResponse>(
    "/auth/member/login",
    { email, password },
    { revalidate: false },
  );
}

export async function logoutMember(token: string) {
  return apiPost<void>("/auth/member/logout", undefined, {
    token,
    revalidate: false,
  });
}

export async function getMemberProfile(token: string) {
  const response = await apiGet<ApiMemberUser | { data: ApiMemberUser }>(
    "/auth/member/me",
    { token, revalidate: false },
  );
  return unwrapData(response);
}

export async function getMemberCurated(
  token: string,
  params: { page?: number; limit?: number } = {},
) {
  return apiGet<MemberPaginated<ApiCuratedItem>>("/member/curated", {
    token,
    params,
    revalidate: false,
  });
}

export async function getMemberSaved(
  token: string,
  params: { page?: number; limit?: number } = {},
) {
  return apiGet<MemberPaginated<ApiSavedItem>>("/member/saved", {
    token,
    params,
    revalidate: false,
  });
}

export async function saveMemberProperty(token: string, propertyId: number) {
  return apiPost<{ id: number; propertyId: number; savedAt: string }>(
    "/member/saved",
    { propertyId },
    { token, revalidate: false },
  );
}

export async function unsaveMemberProperty(token: string, propertyId: number) {
  return apiDelete<void>(`/member/saved/${propertyId}`, {
    token,
    revalidate: false,
  });
}

export async function getMemberNotes(
  token: string,
  params: { page?: number; limit?: number } = {},
) {
  return apiGet<MemberPaginated<ApiAdvisorNote>>("/member/notes", {
    token,
    params,
    revalidate: false,
  });
}

export async function sendMemberMessage(
  token: string,
  payload: ApiMemberMessagePayload,
) {
  return apiPost<{ id: number; message: string }>("/member/message", payload, {
    token,
    revalidate: false,
  });
}
