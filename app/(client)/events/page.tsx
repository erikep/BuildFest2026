"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Event } from "@/types/events";

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Food Drive",
    date: "2026-03-10",
    location: "Community Center",
    description: "Help us collect non-perishable food items for families in need.",
  },
  {
    id: 2,
    title: "Clothing Swap",
    date: "2026-03-22",
    location: "Main Hall",
    description: "Bring gently used clothing and pick up something new to you.",
  },
  {
    id: 3,
    title: "Volunteer Orientation",
    date: "2026-04-05",
    location: "Room 201",
    description: "Learn about upcoming volunteer opportunities in your neighborhood.",
  },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ClientEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("API error"))))
      .then((data: Event[]) => {
        if (data.length > 0) {
          setEvents(data);
        } else {
          setEvents(mockEvents);
          setUsingMock(true);
        }
      })
      .catch(() => {
        setEvents(mockEvents);
        setUsingMock(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          color: "#7c3aed",
          fontSize: "0.875rem",
          fontWeight: 500,
        }}
      >
        &larr; Back to home
      </Link>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        All Events
      </h1>
      <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Browse community events and find ways to get involved.
      </p>

      {usingMock && (
        <div
          style={{
            background: "#fefce8",
            border: "1px solid #fde68a",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
            fontSize: "0.85rem",
            color: "#92400e",
          }}
        >
          Showing sample events. Live data will appear once the backend is connected.
        </div>
      )}

      {loading && (
        <p style={{ color: "#94a3b8", padding: "2rem 0" }}>Loading events...</p>
      )}

      {!loading && events.length === 0 && (
        <p style={{ color: "#94a3b8", padding: "2rem 0" }}>
          No events scheduled yet. Check back soon!
        </p>
      )}

      {!loading && events.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
            gap: "1.25rem",
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#7c3aed",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {formatDate(event.date)}
              </span>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>{event.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                {event.location}
              </p>
              {event.description && (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#475569",
                    lineHeight: 1.5,
                    marginTop: "0.25rem",
                  }}
                >
                  {event.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
