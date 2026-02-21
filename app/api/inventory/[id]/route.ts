import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toItem(row: {
  id: number;
  eventId: number | null;
  name: string;
  quantity: number | null;
  unit: string | null;
  category: string | null;
}) {
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
 * GET /api/inventory/[id]
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
    const item = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(toItem(item));
  } catch (error) {
    console.error("GET /api/inventory/[id]", error);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/inventory/[id]
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
    const body = (await request.json()) as {
      eventId?: number | null;
      name?: string;
      quantity?: number | null;
      unit?: string | null;
      category?: string | null;
    };

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: {
        ...(body.eventId !== undefined && { eventId: body.eventId }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.quantity !== undefined && { quantity: body.quantity }),
        ...(body.unit !== undefined && { unit: body.unit }),
        ...(body.category !== undefined && { category: body.category }),
      },
    });
    return NextResponse.json(toItem(item));
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("PUT /api/inventory/[id]", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/inventory/[id]
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
    await prisma.inventoryItem.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("DELETE /api/inventory/[id]", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
