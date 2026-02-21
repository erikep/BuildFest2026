"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Event } from "@/types/events";

export default function ClientEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((data: Event[]) => setEvents(data))
      .catch(() => setError("Could not load events. Try again later."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: "42rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          color: "#475569",
          fontSize: "0.875rem",
        }}
      >
        ← Back to home
      </Link>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
        Upcoming events
      </h1>
      {loading && <p style={{ color: "#64748b" }}>Loading…</p>}
      {error && (
        <p style={{ color: "#b91c1c", marginBottom: "1rem" }}>{error}</p>
      )}
      {!loading && !error && events.length === 0 && (
        <p style={{ color: "#64748b" }}>No events yet. Check back soon.</p>
      )}
      {!loading && events.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
          {events.map((e) => (
            <li
              key={e.id}
              style={{
                padding: "1rem",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                background: "#fff",
              }}
            >
              <strong style={{ fontSize: "1rem" }}>{e.title}</strong>
              <div style={{ fontSize: "0.875rem", color: "#475569", marginTop: "0.25rem" }}>
                {e.date} · {e.location}
              </div>
              {e.description ? (
                <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.5rem" }}>
                  {e.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
