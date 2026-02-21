import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type FeedbackResponse = {
  id: number;
  eventId: number | null;
  checkInId: number | null;
  rating: number | null;
  comment: string | null;
  createdAt: string;
};

function toResponse(row: {
  id: number;
  eventId: number | null;
  checkInId: number | null;
  rating: number | null;
  comment: string | null;
  createdAt: Date;
}): FeedbackResponse {
  return {
    id: row.id,
    eventId: row.eventId,
    checkInId: row.checkInId,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.createdAt.toISOString(),
  };
}

/**
 * POST /api/feedback — submit optional feedback (e.g. after an event)
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      eventId?: number | null;
      checkInId?: number | null;
      rating?: number | null;
      comment?: string | null;
    };
    const { eventId, checkInId, rating, comment } = body;

    if (eventId == null && checkInId == null) {
      return NextResponse.json(
        { error: "Either eventId or checkInId is required" },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        eventId: eventId ?? undefined,
        checkInId: checkInId ?? undefined,
        rating: rating != null ? Math.min(5, Math.max(1, Number(rating))) : undefined,
        comment: comment != null ? String(comment).trim() || undefined : undefined,
      },
    });

    return NextResponse.json(toResponse(feedback), { status: 201 });
  } catch (error) {
    console.error("POST /api/feedback", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
