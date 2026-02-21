import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type InventoryItemResponse = {
  id: number;
  eventId: number | null;
  name: string;
  quantity: number | null;
  unit: string | null;
  category: string | null;
};

function toItem(row: {
  id: number;
  eventId: number | null;
  name: string;
  quantity: number | null;
  unit: string | null;
  category: string | null;
}): InventoryItemResponse {
  return {
    id: row.id,
    eventId: row.eventId,
    name: row.name,
    quantity: row.quantity,
    unit: row.unit,
    category: row.category,
  };
}

/**
 * GET /api/inventory — list all inventory items
 */
export async function GET() {
  try {
    const rows = await prisma.inventoryItem.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(rows.map(toItem));
  } catch (error) {
    console.error("GET /api/inventory", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inventory — create inventory item (optional eventId)
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      eventId?: number;
      name: string;
      quantity?: number | null;
      unit?: string | null;
      category?: string | null;
    };
    const { eventId, name, quantity, unit, category } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const item = await prisma.inventoryItem.create({
      data: {
        eventId: eventId ?? undefined,
        name: name.trim(),
        quantity: quantity ?? undefined,
        unit: unit ?? undefined,
        category: category ?? undefined,
      },
    });

    return NextResponse.json(toItem(item), { status: 201 });
  } catch (error) {
    console.error("POST /api/inventory", error);
    return NextResponse.json(
      { error: "Failed to create inventory item" },
      { status: 500 }
    );
  }
}
