import { Resend } from "resend";
import Twilio from "twilio";

type EventInfo = { title: string; date: string; location: string };

/**
 * Send email via Resend. Requires RESEND_API_KEY in .env.
 * Resend free tier: 100 emails/day, 3000/month.
 * Sign up at https://resend.com
 */
export async function sendEventNotificationEmail(
  to: string,
  event: EventInfo
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY not configured. Add it to .env" };
  }

  try {
    const resend = new Resend(apiKey);
    const formattedDate = new Date(event.date + "T00:00:00").toLocaleDateString(
      "en-US",
      { weekday: "long", month: "long", day: "numeric", year: "numeric" }
    );

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Tommie Shelf <onboarding@resend.dev>",
      to,
      subject: `You're signed up: ${event.title}`,
      html: `
        <h2>You'll be notified about: ${event.title}</h2>
        <p><strong>When:</strong> ${formattedDate}</p>
        <p><strong>Where:</strong> ${event.location}</p>
        <p>We'll send you a reminder before the event. See you there!</p>
        <p style="color:#64748b;font-size:14px;">— Tommie Shelf</p>
      `,
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}

/**
 * Send SMS via Twilio. Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and either
 * TWILIO_PHONE_NUMBER or TWILIO_MESSAGING_SERVICE_SID in .env.
 * Twilio trial: $15 credit. Sign up at https://twilio.com
 */
export async function sendEventNotificationSms(
  to: string,
  event: EventInfo
): Promise<{ ok: boolean; error?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

  if (!sid || !token) {
    return {
      ok: false,
      error: "Twilio not configured. Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to .env",
    };
  }

  if (!from && !messagingServiceSid) {
    return {
      ok: false,
      error: "Add TWILIO_PHONE_NUMBER or TWILIO_MESSAGING_SERVICE_SID to .env",
    };
  }

  try {
    const client = Twilio(sid, token);
    const formattedDate = new Date(event.date + "T00:00:00").toLocaleDateString(
      "en-US",
      { weekday: "short", month: "short", day: "numeric" }
    );

    const body = `Tommie Shelf: You're signed up for "${event.title}" on ${formattedDate} at ${event.location}. We'll remind you before the event!`;
    const normalizedPhone = to.trim().replace(/\D/g, "");
    const toE164 = normalizedPhone.length === 10 ? `+1${normalizedPhone}` : `+${normalizedPhone}`;

    const params: { body: string; to: string; from?: string; messagingServiceSid?: string } = {
      body,
      to: toE164,
    };
    if (messagingServiceSid) {
      params.messagingServiceSid = messagingServiceSid;
    } else if (from) {
      params.from = from;
    }

    await client.messages.create(params);
    return { ok: true };
  } catch (err: unknown) {
    const twilioErr = err as { message?: string; code?: number };
    const msg = twilioErr.message ?? String(err);
    if (
      msg.toLowerCase().includes("unverified") ||
      msg.toLowerCase().includes("authenticate") ||
      msg.toLowerCase().includes("verified")
    ) {
      return {
        ok: false,
        error: "This number must be verified in your Twilio trial. Add it at console.twilio.com → Phone Numbers → Verified Caller IDs.",
      };
    }
    return { ok: false, error: msg };
  }
}
