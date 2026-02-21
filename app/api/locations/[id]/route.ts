import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type LocationItem = {
  id: number;
  name: string;
  type: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  url: string | null;
};

function toItem(r: { id: number; name: string; type: string; address: string | null; latitude: number | null; longitude: number | null; url: string | null }): LocationItem {
  return {
    id: r.id,
    name: r.name,
    type: r.type,
    address: r.address,
    latitude: r.latitude,
    longitude: r.longitude,
    url: r.url,
  };
}

/**
 * GET /api/locations/[id]
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const loc = await prisma.location.findUnique({ where: { id } });
    if (!loc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(toItem(loc));
  } catch (error) {
    console.error("GET /api/locations/[id]", error);
    return NextResponse.json(
      { error: "Failed to fetch location" },
      { status: 500 }
    );
  }
}

type UpdateLocationBody = {
  name?: string;
  type?: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  url?: string | null;
};

/**
 * PUT /api/locations/[id]
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = (await request.json()) as UpdateLocationBody;
    const { name, type, address, latitude, longitude, url } = body;

    const data: { name?: string; type?: string; address?: string | null; latitude?: number | null; longitude?: number | null; url?: string | null } = {};
    if (name !== undefined) data.name = String(name).trim();
    if (type !== undefined) {
      if (type !== "SHELF" && type !== "KITCHEN") {
        return NextResponse.json({ error: "type must be SHELF or KITCHEN" }, { status: 400 });
      }
      data.type = type;
    }
    if (address !== undefined) data.address = address != null ? String(address).trim() || null : null;
    if (latitude !== undefined) data.latitude = latitude != null && !Number.isNaN(Number(latitude)) ? Number(latitude) : null;
    if (longitude !== undefined) data.longitude = longitude != null && !Number.isNaN(Number(longitude)) ? Number(longitude) : null;
    if (url !== undefined) data.url = url != null ? String(url).trim() || null : null;

    if (data.name !== undefined && !data.name) {
      return NextResponse.json({ error: "name cannot be empty" }, { status: 400 });
    }

    const loc = await prisma.location.update({
      where: { id },
      data,
    });
    return NextResponse.json(toItem(loc));
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("PUT /api/locations/[id]", error);
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/locations/[id]
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await prisma.location.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("DELETE /api/locations/[id]", error);
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    );
  }
}
