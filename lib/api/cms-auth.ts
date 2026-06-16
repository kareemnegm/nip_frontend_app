import { apiGet, apiPost, unwrapData } from "./client";

export type StaffUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  canEditCms: boolean;
};

export type StaffLoginResponse = {
  token: string;
  token_type: string;
  user: StaffUser;
};

export async function loginStaff(email: string, password: string) {
  const response = await apiPost<StaffLoginResponse>(
    "/auth/login",
    { email, password },
    { revalidate: false },
  );
  return {
    ...response,
    user: unwrapData(response.user as StaffUser | { data: StaffUser }),
  };
}

export async function logoutStaff(token: string) {
  return apiPost<void>("/auth/logout", undefined, {
    token,
    revalidate: false,
  });
}

export async function getStaffProfile(token: string) {
  const response = await apiGet<StaffUser | { data: StaffUser }>("/auth/me", {
    token,
    revalidate: false,
  });
  return unwrapData(response);
}
