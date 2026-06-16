import { NextResponse } from "next/server";
import { getStaffProfile } from "@/lib/api/cms-auth";
import { getCmsToken } from "@/lib/cms/auth.server";
import { canEditCms } from "@/lib/cms/roles";

export async function GET() {
  const token = await getCmsToken();
  if (!token) {
    return NextResponse.json({ user: null, canEdit: false, role: null });
  }

  try {
    const user = await getStaffProfile(token);
    return NextResponse.json({
      user,
      canEdit: user.canEditCms ?? canEditCms(user.role),
      role: user.role,
    });
  } catch {
    return NextResponse.json({ user: null, canEdit: false, role: null });
  }
}
