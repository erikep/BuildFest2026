import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type FeedbackListItem = {
  id: number;
  rating: number | null;
  comment: string | null;
  createdAt: string;
};

/**
 * GET /api/events/[id]/feedback — list feedback for an event
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
    const rows = await prisma.feedback.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });
    const list: FeedbackListItem[] = rows.map((row) => ({
      id: row.id,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.createdAt.toISOString(),
    }));
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/events/[id]/feedback", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
