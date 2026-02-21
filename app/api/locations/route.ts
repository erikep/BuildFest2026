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

/** Haversine distance in km */
function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * GET /api/locations
 * Query: type=SHELF|KITCHEN (optional), lat=number (optional), lng=number (optional)
 * If lat/lng provided, sorts by distance (nearest first). Only locations with lat/lng are included when sorting by distance.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type");
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    const where: { type?: string } = {};
    if (typeParam === "SHELF" || typeParam === "KITCHEN") {
      where.type = typeParam;
    }

    const rows = await prisma.location.findMany({
      where,
      orderBy: { name: "asc" },
    });

    let list: (LocationItem & { distanceKm?: number })[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      address: r.address,
      latitude: r.latitude,
      longitude: r.longitude,
      url: r.url,
    }));

    const lat = latParam != null ? parseFloat(latParam) : NaN;
    const lng = lngParam != null ? parseFloat(lngParam) : NaN;
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      list = list
        .filter((loc) => loc.latitude != null && loc.longitude != null)
        .map((loc) => ({
          ...loc,
          distanceKm: distanceKm(lat, lng, loc.latitude!, loc.longitude!),
        }))
        .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/locations", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

type CreateLocationBody = {
  name: string;
  type: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  url?: string | null;
};

/**
 * POST /api/locations — create a location (staff)
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateLocationBody;
    const { name, type, address, latitude, longitude, url } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }
    if (type !== "SHELF" && type !== "KITCHEN") {
      return NextResponse.json(
        { error: "type must be SHELF or KITCHEN" },
        { status: 400 }
      );
    }

    const loc = await prisma.location.create({
      data: {
        name: name.trim(),
        type,
        address: address != null ? String(address).trim() || null : null,
        latitude: latitude != null && !Number.isNaN(Number(latitude)) ? Number(latitude) : null,
        longitude: longitude != null && !Number.isNaN(Number(longitude)) ? Number(longitude) : null,
        url: url != null ? String(url).trim() || null : null,
      },
    });

    const item: LocationItem = {
      id: loc.id,
      name: loc.name,
      type: loc.type,
      address: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude,
      url: loc.url,
    };
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/locations", error);
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 }
    );
  }
}
