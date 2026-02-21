import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type CheckInListItem = {
  id: number;
  firstName: string;
  lastName: string | null;
  householdSize: number | null;
  zipCode: string | null;
  firstTimeVisitor: boolean;
  foodReceivedAmount: string | null;
  createdAt: string;
};

/**
 * GET /api/events/[id]/check-ins — list check-ins for an event
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
    const rows = await prisma.checkIn.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });
    const list: CheckInListItem[] = rows.map((row) => ({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      householdSize: row.householdSize,
      zipCode: row.zipCode,
      firstTimeVisitor: row.firstTimeVisitor,
      foodReceivedAmount: row.foodReceivedAmount,
      createdAt: row.createdAt.toISOString(),
    }));
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/events/[id]/check-ins", error);
    return NextResponse.json(
      { error: "Failed to fetch check-ins" },
      { status: 500 }
    );
  }
}
