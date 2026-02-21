"use client";

import { useState } from "react";
import type { Event } from "@/types/events";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getGoogleCalendarUrl(event: Event): string {
  const [y, m, d] = event.date.split("-");
  const start = `${y}${m}${d}`;
  const endDate = new Date(event.date + "T00:00:00");
  endDate.setDate(endDate.getDate() + 1);
  const end =
    `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, "0")}${String(endDate.getDate()).padStart(2, "0")}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description ?? "",
    location: event.location ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcsContent(event: Event): string {
  const [y, m, d] = event.date.split("-");
  const endDate = new Date(event.date + "T00:00:00");
  endDate.setDate(endDate.getDate() + 1);
  const end = `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, "0")}${String(endDate.getDate()).padStart(2, "0")}`;
  const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tommie Shelf//EN",
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${y}${m}${d}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escape(event.title)}`,
    event.description ? `DESCRIPTION:${escape(event.description)}` : "",
    event.location ? `LOCATION:${escape(event.location)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

/** Returns a data URL for .ics so mobile browsers open the native calendar app. */
function getIcsDataUrl(event: Event): string {
  const ics = buildIcsContent(event);
  const base64 = btoa(unescape(encodeURIComponent(ics)));
  return `data:text/calendar;charset=utf-8;base64,${base64}`;
}

export function EventDetailModal({
  event,
  onClose,
}: {
  event: Event;
  onClose: () => void;
}) {
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: contact }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setMessage({ type: "success", text: data.message ?? "You're signed up! Check your inbox." });
      setContact("");
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "1.5rem",
          maxWidth: "24rem",
          width: "100%",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <h2 id="event-modal-title" style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
            {event.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              fontSize: "1.25rem",
              cursor: "pointer",
              color: "#64748b",
              padding: "0.25rem",
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>
        <p style={{ fontSize: "0.875rem", color: "#7c3aed", fontWeight: 600, marginBottom: "0.5rem" }}>
          {formatDate(event.date)}
        </p>
        <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "0.75rem" }}>
          📍 {event.location}
        </p>
        {event.description && (
          <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.6 }}>
            {event.description}
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem" }}>
            Add to your calendar
          </p>
          <a
            href={getGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: "0.5rem 1rem",
              background: "#7c3aed",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 600,
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Add to Google Calendar
          </a>
          <a
            href={getIcsDataUrl(event)}
            style={{
              display: "block",
              padding: "0.5rem 1rem",
              background: "#fff",
              color: "#7c3aed",
              border: "2px solid #7c3aed",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 600,
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Add to Apple Calendar / Calendar app
          </a>
        </div>

        {/* Notify me */}
        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Notify me
          </p>
          <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.75rem" }}>
            Get a reminder sent to your email.
          </p>
          <form onSubmit={handleNotify}>
            <input
              type="email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                background: loading ? "#a78bfa" : "#7c3aed",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Sending…" : "Notify me"}
            </button>
          </form>
          {message && (
            <p
              style={{
                fontSize: "0.8rem",
                marginTop: "0.5rem",
                color: message.type === "success" ? "#16a34a" : "#dc2626",
              }}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
