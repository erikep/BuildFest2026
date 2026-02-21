import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CreateEventInput, Event } from "@/types/events";

function toEventResponse(row: {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  foodDistributedAmount?: string | null;
  foodWastePrevented?: string | null;
}): Event {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    location: row.location,
    description: row.description,
    foodDistributedAmount: row.foodDistributedAmount ?? null,
    foodWastePrevented: row.foodWastePrevented ?? null,
  };
}

/**
 * GET /api/events — list events (Client frontend). FIRSTTASK Person B.
 */
export async function GET() {
  try {
    const rows = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
    const events: Event[] = rows.map(toEventResponse);
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/events", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events — create event (Staff frontend). FIRSTTASK Person B.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateEventInput;
    const { title, date, location, description } = body;

    if (!title || !date || !location) {
      return NextResponse.json(
        { error: "title, date, and location are required" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title: String(title),
        date: String(date),
        location: String(location),
        description: description == null ? "" : String(description),
      },
    });

    return NextResponse.json(toEventResponse(event), { status: 201 });
  } catch (error) {
    console.error("POST /api/events", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
