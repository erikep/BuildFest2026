import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type CheckInResponse = {
  id: number;
  eventId: number;
  firstName: string;
  lastName: string | null;
  householdSize: number | null;
  zipCode: string | null;
  firstTimeVisitor: boolean;
  foodReceivedAmount: string | null;
  createdAt: string;
};

function toResponse(row: {
  id: number;
  eventId: number;
  firstName: string;
  lastName: string | null;
  householdSize: number | null;
  zipCode: string | null;
  firstTimeVisitor: boolean;
  foodReceivedAmount: string | null;
  createdAt: Date;
}): CheckInResponse {
  return {
    id: row.id,
    eventId: row.eventId,
    firstName: row.firstName,
    lastName: row.lastName,
    householdSize: row.householdSize,
    zipCode: row.zipCode,
    firstTimeVisitor: row.firstTimeVisitor,
    foodReceivedAmount: row.foodReceivedAmount,
    createdAt: row.createdAt.toISOString(),
  };
}

/**
 * POST /api/check-ins — create a check-in (demographic data for first-timers)
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      eventId: number;
      firstName: string;
      lastName?: string | null;
      householdSize?: number | null;
      zipCode?: string | null;
      firstTimeVisitor?: boolean;
      foodReceivedAmount?: string | null;
    };
    const { eventId, firstName, lastName, householdSize, zipCode, firstTimeVisitor, foodReceivedAmount } = body;

    if (!eventId || typeof eventId !== "number") {
      return NextResponse.json(
        { error: "eventId is required and must be a number" },
        { status: 400 }
      );
    }
    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
      return NextResponse.json(
        { error: "firstName is required" },
        { status: 400 }
      );
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        eventId,
        firstName: firstName.trim(),
        lastName: lastName != null ? String(lastName).trim() || undefined : undefined,
        householdSize: householdSize ?? undefined,
        zipCode: zipCode != null ? String(zipCode).trim() || undefined : undefined,
        firstTimeVisitor: firstTimeVisitor ?? true,
        foodReceivedAmount: foodReceivedAmount != null ? String(foodReceivedAmount).trim() || undefined : undefined,
      },
    });

    return NextResponse.json(toResponse(checkIn), { status: 201 });
  } catch (error) {
    console.error("POST /api/check-ins", error);
    return NextResponse.json(
      { error: "Failed to create check-in" },
      { status: 500 }
    );
  }
}
