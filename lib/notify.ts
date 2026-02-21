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
 * Send SMS via Twilio. Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env.
 * Twilio trial: $15 credit. Sign up at https://twilio.com
 */
export async function sendEventNotificationSms(
  to: string,
  event: EventInfo
): Promise<{ ok: boolean; error?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token || !from) {
    return {
      ok: false,
      error: "Twilio not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER to .env",
    };
  }

  try {
    const client = Twilio(sid, token);
    const formattedDate = new Date(event.date + "T00:00:00").toLocaleDateString(
      "en-US",
      { weekday: "short", month: "short", day: "numeric" }
    );

    const body = `Tommie Shelf: You're signed up for "${event.title}" on ${formattedDate} at ${event.location}. We'll remind you before the event!`;
    const normalizedPhone = to.replace(/\D/g, "");
    const toE164 = normalizedPhone.length === 10 ? `+1${normalizedPhone}` : `+${normalizedPhone}`;

    await client.messages.create({
      body,
      from,
      to: toE164,
    });
    return { ok: true };
  } catch (err: unknown) {
    const twilioErr = err as { message?: string };
    return { ok: false, error: twilioErr.message ?? String(err) };
  }
}
