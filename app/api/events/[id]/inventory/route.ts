import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/events/[id]/inventory — list inventory items for an event
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const eventId = parseInt((await params).id, 10);
  if (Number.isNaN(eventId)) {
    return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
  }
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { eventId },
      orderBy: { name: "asc" },
    });
    const list = items.map((row) => ({
      id: row.id,
      name: row.name,
      quantity: row.quantity,
      unit: row.unit,
      category: row.category,
    }));
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/events/[id]/inventory", error);
    return NextResponse.json(
      { error: "Failed to fetch event inventory" },
      { status: 500 }
    );
  }
}
