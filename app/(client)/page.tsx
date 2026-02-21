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

export default function ClientLandingPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("API error"))))
      .then((data: Event[]) => setEvents(data.length > 0 ? data : mockEvents))
      .catch(() => setEvents(mockEvents))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = events.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4c1d95 100%)",
          color: "#fff",
          padding: "4rem 1.5rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.75rem" }}>
          Welcome to Tommie Shelf
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            maxWidth: "36rem",
            margin: "0 auto 2rem",
            opacity: 0.9,
          }}
        >
          Events and resources for our community. Find upcoming events, volunteer, and make an impact.
        </p>
        <Link
          href="/events"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            background: "#fff",
            color: "#7c3aed",
            borderRadius: "9999px",
            fontWeight: 700,
            fontSize: "1rem",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
        >
          Browse all events
        </Link>
      </section>

      {/* Upcoming Events */}
      <section
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "3rem 1.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.25rem",
          }}
        >
          Upcoming Events
        </h2>
        <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          See what&apos;s happening soon in the community.
        </p>

        {loading && (
          <p style={{ color: "#94a3b8", padding: "2rem 0" }}>Loading events...</p>
        )}

        {!loading && upcoming.length === 0 && (
          <p style={{ color: "#94a3b8", padding: "2rem 0" }}>
            No upcoming events right now. Check back soon!
          </p>
        )}

        {!loading && upcoming.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
              gap: "1.25rem",
            }}
          >
            {upcoming.map((event) => (
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
                  transition: "box-shadow 0.2s",
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

        {!loading && events.length > 3 && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link
              href="/events"
              style={{
                color: "#7c3aed",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              View all {events.length} events &rarr;
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
