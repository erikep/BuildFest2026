"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Event } from "@/types/events";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ClientFeedbackPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [eventId, setEventId] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch("/api/events")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Event[]) => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!eventId) return;
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: parseInt(eventId, 10),
          rating: rating ? parseInt(rating, 10) : null,
          comment: comment.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit feedback");
      }
      setStatus("success");
      setEventId("");
      setRating("");
      setComment("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: "0.625rem 0.875rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    background: "#fff",
    fontSize: "1rem",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "0.5rem",
  };

  return (
    <div style={{ maxWidth: "32rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          color: "#510C76",
          fontSize: "0.875rem",
          fontWeight: 500,
        }}
      >
        &larr; Back to home
      </Link>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Share feedback
      </h1>
      <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
        Your feedback is optional but helps us improve. Choose an event and share your experience.
      </p>

      {loading && <p style={{ color: "#64748b" }}>Loading events...</p>}

      {!loading && events.length === 0 && (
        <p style={{ color: "#64748b" }}>
          No events available yet. Check back after events are posted.
        </p>
      )}

      {!loading && events.length > 0 && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ marginBottom: "1.25rem" }}>
            <label htmlFor="eventId" style={labelStyle}>
              Event *
            </label>
            <select
              id="eventId"
              required
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select an event</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} — {formatDate(ev.date)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label htmlFor="rating" style={labelStyle}>
              Rating (optional)
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={inputStyle}
            >
              <option value="">No rating</option>
              <option value="5">5 — Excellent</option>
              <option value="4">4 — Good</option>
              <option value="3">3 — Okay</option>
              <option value="2">2 — Fair</option>
              <option value="1">1 — Poor</option>
            </select>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label htmlFor="comment" style={labelStyle}>
              Comment (optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Anything you'd like to share..."
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: "6rem",
              }}
            />
          </div>

          {status === "error" && (
            <p style={{ color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>
              {errorMessage}
            </p>
          )}
          {status === "success" && (
            <p style={{ color: "#16a34a", fontSize: "0.875rem", marginBottom: "1rem" }}>
              Thank you for your feedback.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting" || !eventId}
            style={{
              padding: "0.75rem 1.5rem",
              background: status === "submitting" || !eventId ? "#cbd5e1" : "#510C76",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: status === "submitting" || !eventId ? "not-allowed" : "pointer",
            }}
          >
            {status === "submitting" ? "Submitting…" : "Submit feedback"}
          </button>
        </form>
      )}
    </div>
  );
}
