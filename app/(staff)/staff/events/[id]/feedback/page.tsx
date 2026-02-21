"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Event } from "@/types/events";

type FeedbackItem = { id: number; rating: number | null; comment: string | null; createdAt: string };

export default function EventFeedbackPage() {
  const params = useParams();
  const eventId = params.id as string;
  const eventIdNum = parseInt(eventId, 10);

  const [event, setEvent] = useState<Event | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, feedbackRes] = await Promise.all([
          fetch("/api/events"),
          fetch(`/api/events/${eventId}/feedback`),
        ]);
        if (eventsRes.ok) {
          const events: Event[] = await eventsRes.json();
          const found = events.find((e) => e.id === eventIdNum);
          if (found) setEvent(found);
        }
        if (feedbackRes.ok) {
          const data = await feedbackRes.json();
          setFeedback(data);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [eventId, eventIdNum]);

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1.25rem",
    marginBottom: "1rem",
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <Link
          href="/staff/events"
          style={{ fontSize: "0.875rem", color: "#64748b", textDecoration: "none" }}
        >
          ← Back to Events
        </Link>
      </div>

      {loading && (
        <p style={{ color: "#64748b", padding: "2rem 0" }}>Loading...</p>
      )}

      {!loading && event && (
        <>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            Feedback: {event.title}
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            {feedback.length} {feedback.length === 1 ? "response" : "responses"}
          </p>

          {feedback.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "#64748b" }}>No feedback for this event yet.</p>
            </div>
          ) : (
            <div>
              {feedback.map((f) => (
                <div key={f.id} style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ flex: 1 }}>
                      {f.rating != null && (
                        <span style={{ color: "#b45309", fontWeight: 600, fontSize: "0.875rem" }}>
                          ★ {f.rating} / 5
                        </span>
                      )}
                      <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                        {formatDate(f.createdAt)}
                      </p>
                      {f.comment && (
                        <p style={{ fontSize: "0.9375rem", color: "#334155", marginTop: "0.5rem", lineHeight: 1.5 }}>
                          {f.comment}
                        </p>
                      )}
                      {f.rating == null && !f.comment && (
                        <p style={{ fontSize: "0.875rem", color: "#94a3b8", fontStyle: "italic" }}>
                          No rating or comment
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !event && (
        <p style={{ color: "#64748b" }}>Event not found.</p>
      )}
    </div>
  );
}
