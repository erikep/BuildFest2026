import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/notifications/preferences
 * Body: { preferences: { channel: "EMAIL" | "SMS" | "PUSH"; value: string; enabled: boolean }[] }
 * Creates notification preference records (no auth; userId null).
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      preferences?: { channel?: string; value?: string; enabled?: boolean }[];
    };

    const prefs = body.preferences;
    if (!Array.isArray(prefs) || prefs.length === 0) {
      return NextResponse.json(
        { error: "preferences array is required and must not be empty" },
        { status: 400 }
      );
    }

    const validChannels = ["EMAIL", "SMS", "PUSH"];
    for (const p of prefs) {
      const channel = p.channel && validChannels.includes(String(p.channel)) ? String(p.channel) : null;
      const value = p.value != null ? String(p.value).trim() : "";
      const enabled = Boolean(p.enabled);

      if (!channel || !value) continue;

      await prisma.notificationPreference.create({
        data: {
          userId: null,
          channel,
          value,
          enabled,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Preferences saved." });
  } catch (error) {
    console.error("POST /api/notifications/preferences", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}
