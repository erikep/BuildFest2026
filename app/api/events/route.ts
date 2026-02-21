import { NextResponse } from "next/server";
import type { CreateEventInput } from "@/types/events";

/**
 * Mock POST /api/events for Staff frontend (Person C).
 * Replace with real DB-backed implementation when Person B's API is ready.
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

    // Mock: return 201 with a fake id. Real API will persist via Prisma.
    const mockEvent = {
      id: Date.now(),
      title: String(title),
      date: String(date),
      location: String(location),
      description: description == null ? "" : String(description),
    };

    return NextResponse.json(mockEvent, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
