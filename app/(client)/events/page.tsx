"use client";

import { useEffect, useState, useMemo } from "react";
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

import { EventDetailModal } from "@/app/components/EventDetailModal";

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function EventsCalendar({ events, onEventClick }: { events: Event[]; onEventClick: (event: Event) => void }) {
  const [viewDate, setViewDate] = useState(() => new Date());
  useEffect(() => {
    if (events.length > 0) {
      const [y, m] = events[0].date.split("-").map(Number);
      setViewDate(new Date(y, m - 1, 1));
    }
  }, [events]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach((e) => {
      const key = e.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return map;
  }, [events]);

  const { days, month, year } = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startPad = first.getDay();
    const endPad = 6 - last.getDay();
    const days: { date: Date | null; key: string | null }[] = [];
    for (let i = 0; i < startPad; i++) days.push({ date: null, key: null });
    for (let d = 1; d <= last.getDate(); d++) {
      const dt = new Date(y, m, d);
      days.push({ date: dt, key: toDateKey(dt) });
    }
    for (let i = 0; i < endPad; i++) days.push({ date: null, key: null });
    return {
      days,
      month: viewDate.toLocaleDateString("en-US", { month: "long" }),
      year: viewDate.getFullYear(),
    };
  }, [viewDate]);

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "1.25rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>
          {month} {year}
        </h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1))}
            style={{
              padding: "0.35rem 0.6rem",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              background: "#fff",
              cursor: "pointer",
              fontSize: "0.9rem", fontWeight: 600,
            }}
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1))}
            style={{
              padding: "0.35rem 0.6rem",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              background: "#fff",
              cursor: "pointer",
              fontSize: "0.9rem", fontWeight: 600,
            }}
          >
            &rarr;
          </button>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: "2px",
        }}
      >
        {weekdayLabels.map((label) => (
          <div
            key={label}
            style={{
              padding: "0.5rem",
fontSize: "0.7rem",
                fontWeight: 600,
                color: "#64748b",
              textAlign: "center",
            }}
          >
            {label}
          </div>
        ))}
        {days.map((cell, i) => {
          if (!cell.date) {
            return <div key={`empty-${i}`} style={{ aspectRatio: "1", minHeight: 0 }} />;
          }
          const dayEvents = cell.key ? (eventsByDate.get(cell.key) ?? []) : [];
          return (
            <div
              key={cell.key}
              style={{
                aspectRatio: "1",
                minHeight: 0,
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "0.25rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: dayEvents.length > 0 ? "#ede5f2" : "#fff",
                overflow: "hidden",
              }}
            >
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1e293b" }}>
                {cell.date.getDate()}
              </span>
              {dayEvents.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "2px",
                    marginTop: "2px",
                  }}
                >
                  {dayEvents.slice(0, 3).map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onEventClick(e);
                      }}
                      title={e.title}
                      style={{
                        fontSize: "0.6rem",
                        background: "#510C76",
                        color: "#fff",
                        padding: "1px 4px",
                        borderRadius: "4px",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {e.title}
                    </button>
                  ))}
                  {dayEvents.length > 3 && (
                    <span style={{ fontSize: "0.6rem", color: "#64748b" }}>+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ClientEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
    <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "2rem 1.5rem", width: "100%", boxSizing: "border-box", overflowX: "hidden" }}>
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

      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        All Events
      </h1>
      <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: 600 }}>
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
            fontSize: "0.85rem", fontWeight: 600,
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
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
              gap: "1.25rem",
            }}
          >
            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                className="upcoming-event-card"
                onClick={() => setSelectedEvent(event)}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#510C76",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {formatDate(event.date)}
                </span>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>{event.title}</h3>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>
                  {event.location}
                </p>
                {event.description && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#475569",
                      lineHeight: 1.5,
                      marginTop: "0.25rem",
                    }}
                  >
                    {event.description}
                  </p>
                )}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "3rem", width: "100%", minWidth: 0, overflow: "hidden" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
              Calendar
            </h2>
            <p style={{ color: "#64748b", marginBottom: "1rem", fontSize: "0.95rem", fontWeight: 600 }}>
              View events by date.
            </p>
            <EventsCalendar events={events} onEventClick={setSelectedEvent} />
          </div>
        </>
      )}

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {!loading && events.length > 0 && (
        <p style={{ marginTop: "2rem", fontSize: "0.9rem", fontWeight: 600, color: "#64748b" }}>
          Attended an event?{" "}
          <Link href="/feedback" style={{ color: "#510C76", fontWeight: 600 }}>
            Leave feedback
          </Link>
        </p>
      )}
    </div>
  );
}
