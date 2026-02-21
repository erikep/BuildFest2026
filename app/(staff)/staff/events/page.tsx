"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Event } from "@/types/events";

export default function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      } else {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1.25rem",
    marginBottom: "1rem",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Events</h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Manage your community events</p>
        </div>
        <Link
          href="/staff/events/new"
          style={{
            ...buttonStyle,
            background: "#2563eb",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          + New Event
        </Link>
      </div>

      {loading && (
        <p style={{ color: "#64748b", padding: "2rem 0" }}>Loading events...</p>
      )}

      {!loading && events.length === 0 && (
        <div style={{ ...cardStyle, textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "#64748b", marginBottom: "1rem" }}>No events yet</p>
          <Link
            href="/staff/events/new"
            style={{
              color: "#2563eb",
              fontWeight: 600,
            }}
          >
            Create your first event →
          </Link>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div>
          {events.map((event) => (
            <div key={event.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#2563eb",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {formatDate(event.date)}
                  </span>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginTop: "0.25rem" }}>
                    {event.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>
                    📍 {event.location}
                  </p>
                  {event.description && (
                    <p style={{ fontSize: "0.875rem", color: "#475569", marginTop: "0.5rem", lineHeight: 1.5 }}>
                      {event.description}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <Link
                    href={`/staff/events/${event.id}/edit`}
                    style={{
                      ...buttonStyle,
                      background: "#f1f5f9",
                      color: "#475569",
                      textDecoration: "none",
                    }}
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/staff/events/${event.id}/check-in`}
                    style={{
                      ...buttonStyle,
                      background: "#ecfdf5",
                      color: "#047857",
                      textDecoration: "none",
                    }}
                  >
                    Check-in
                  </Link>
                  <Link
                    href={`/staff/events/${event.id}/inventory`}
                    style={{
                      ...buttonStyle,
                      background: "#dbeafe",
                      color: "#1d4ed8",
                      textDecoration: "none",
                    }}
                  >
                    Inventory
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={deleting === event.id}
                    style={{
                      ...buttonStyle,
                      background: "#fef2f2",
                      color: "#dc2626",
                      opacity: deleting === event.id ? 0.5 : 1,
                    }}
                  >
                    {deleting === event.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
