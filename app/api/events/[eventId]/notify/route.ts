import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEventNotificationEmail, sendEventNotificationSms } from "@/lib/notify";

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10;
}

/**
 * POST /api/events/[eventId]/notify
 * Body: { channel: "EMAIL" | "SMS", email?: string, phone?: string }
 * Subscribes user and sends immediate confirmation.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const id = parseInt(eventId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const body = await request.json();
    const { channel, email, phone } = body as {
      channel?: string;
      email?: string;
      phone?: string;
    };

    if (channel !== "EMAIL" && channel !== "SMS") {
      return NextResponse.json(
        { error: "channel must be EMAIL or SMS" },
        { status: 400 }
      );
    }

    const contact =
      channel === "EMAIL"
        ? (email ?? "").trim().toLowerCase()
        : (phone ?? "").trim();

    if (!contact) {
      return NextResponse.json(
        { error: channel === "EMAIL" ? "email is required" : "phone is required" },
        { status: 400 }
      );
    }

    if (channel === "EMAIL" && !validEmail(contact)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (channel === "SMS" && !validPhone(contact)) {
      return NextResponse.json(
        { error: "Invalid phone number (need at least 10 digits)" },
        { status: 400 }
      );
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

    await prisma.eventNotificationSubscription.upsert({
      where: {
        eventId_channel_contact: { eventId: id, channel, contact },
      },
      create: { eventId: id, channel, contact },
      update: {},
    });

    if (channel === "EMAIL") {
      const result = await sendEventNotificationEmail(contact, eventInfo);
      if (!result.ok) {
        return NextResponse.json(
          { error: result.error ?? "Failed to send email" },
          { status: 500 }
        );
      }
    } else {
      const result = await sendEventNotificationSms(contact, eventInfo);
      if (!result.ok) {
        return NextResponse.json(
          { error: result.error ?? "Failed to send SMS" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `You're signed up! Check your ${channel === "EMAIL" ? "email" : "phone"} for a confirmation.`,
    });
  } catch (err) {
    console.error("POST /api/events/[eventId]/notify", err);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
