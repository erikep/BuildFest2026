import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEventNotificationEmail } from "@/lib/notify";

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * POST /api/events/[id]/notify
 * Body: { email: string }
 * Subscribes user and sends immediate confirmation email.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const body = await request.json();
    const email = (body as { email?: string }).email;
    const contact = (email ?? "").trim().toLowerCase();

    if (!contact) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    if (!validEmail(contact)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const eventInfo = {
      title: event.title,
      date: event.date,
      location: event.location,
    };

    const channel = "EMAIL";
    await prisma.eventNotificationSubscription.upsert({
      where: {
        eventId_channel_contact: { eventId: id, channel, contact },
      },
      create: { eventId: id, channel, contact },
      update: {},
    });

    const result = await sendEventNotificationEmail(contact, eventInfo);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "You're signed up! Check your email for a confirmation.",
    });
  } catch (err) {
    console.error("POST /api/events/[id]/notify", err);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
