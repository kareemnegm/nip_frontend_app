import { NextResponse } from "next/server";
import {
  getMemberSavedStatus,
  saveMemberProperty,
  unsaveMemberProperty,
} from "@/lib/api/member";
import { isApiError } from "@/lib/api/errors";
import { getMemberToken } from "@/lib/member/auth.server";

function parsePropertyId(value: unknown): number | null {
  const id = typeof value === "string" ? Number.parseInt(value, 10) : Number(value);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function GET(request: Request) {
  const token = await getMemberToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const propertyId = parsePropertyId(
    new URL(request.url).searchParams.get("propertyId"),
  );
  if (propertyId == null) {
    return NextResponse.json({ message: "propertyId is required" }, { status: 400 });
  }

  try {
    const result = await getMemberSavedStatus(token, propertyId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ saved: false });
  }
}

export async function POST(request: Request) {
  const token = await getMemberToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { propertyId?: number | string };
    const propertyId = parsePropertyId(body.propertyId);
    if (propertyId == null) {
      return NextResponse.json({ message: "propertyId is required" }, { status: 400 });
    }

    const result = await saveMemberProperty(token, propertyId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (isApiError(error) && error.status === 409) {
      return NextResponse.json({ ok: true, alreadySaved: true });
    }

    const status = isApiError(error) ? error.status : 500;
    const message = isApiError(error) ? error.message : "Could not save property";
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(request: Request) {
  const token = await getMemberToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const propertyId = parsePropertyId(
    new URL(request.url).searchParams.get("propertyId"),
  );
  if (propertyId == null) {
    return NextResponse.json({ message: "propertyId is required" }, { status: 400 });
  }

  try {
    await unsaveMemberProperty(token, propertyId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return new NextResponse(null, { status: 204 });
    }

    const status = isApiError(error) ? error.status : 500;
    const message = isApiError(error) ? error.message : "Could not remove saved property";
    return NextResponse.json({ message }, { status });
  }
}
