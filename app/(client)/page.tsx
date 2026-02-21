"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Event } from "@/types/events";
import { EventDetailModal } from "@/app/components/EventDetailModal";

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

type Resource = { id: number; title: string; url: string; description?: string };
const mockResources: Resource[] = [
  {
    id: 1,
    title: "SNAP Benefits",
    url: "https://www.benefits.gov/benefit/361",
    description: "Apply for Supplemental Nutrition Assistance Program (SNAP) to help buy groceries.",
  },
  {
    id: 2,
    title: "211 Helpline",
    url: "https://www.211.org",
    description: "Free referral service for food, housing, health care, and more. Call 211 or search online.",
  },
  {
    id: 3,
    title: "Local Food Banks",
    url: "https://www.feedingamerica.org/find-your-local-foodbank",
    description: "Find food banks and pantries near you through Feeding America.",
  },
];

type ActionItem = { id: number; title: string; description?: string; dueDate?: string; completed: boolean };
const mockActionItems: ActionItem[] = [
  {
    id: 1,
    title: "Update contact info",
    description: "Ensure we have your current phone and email for event reminders.",
    dueDate: "2026-03-01",
    completed: false,
  },
  {
    id: 2,
    title: "Complete volunteer interest form",
    description: "Let us know how you’d like to help.",
    dueDate: "2026-03-15",
    completed: false,
  },
  {
    id: 3,
    title: "Review notification preferences",
    description: "Choose how you want to receive alerts (email, SMS, or push).",
    completed: true,
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
  const [actionItemsOpen, setActionItemsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedEvent(event)}
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
                  cursor: "pointer",
                  textAlign: "left",
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
              </button>
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

      {/* External Resources */}
      <section
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          External Resources
        </h2>
        <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          Helpful links for food assistance, housing, and community services.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
            gap: "1.25rem",
          }}
        >
          {mockResources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.25rem",
                textDecoration: "none",
                color: "inherit",
                transition: "box-shadow 0.2s, border-color 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#7c3aed", marginBottom: "0.5rem" }}>
                {resource.title}
              </h3>
              {resource.description && (
                <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.5 }}>
                  {resource.description}
                </p>
              )}
              <span style={{ fontSize: "0.8rem", color: "#7c3aed", fontWeight: 500, marginTop: "0.5rem", display: "inline-block" }}>
                Visit link &rarr;
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Next Steps */}
      <section
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <button
          type="button"
          onClick={() => setActionItemsOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1e293b",
          }}
          aria-expanded={actionItemsOpen}
          aria-controls="action-items-list"
        >
          Next Steps
          <span
            style={{
              display: "inline-block",
              transition: "transform 0.2s",
              transform: actionItemsOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▾
          </span>
        </button>
        {actionItemsOpen && (
          <>
            <p style={{ color: "#64748b", marginTop: "0.25rem", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
              Things you might want to check out.
            </p>
            <ul
              id="action-items-list"
              style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              {mockActionItems.map((item) => (
                <li
                  key={item.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    opacity: item.completed ? 0.75 : 1,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: "1.25rem",
                      height: "1.25rem",
                      borderRadius: "4px",
                      border: "2px solid",
                      borderColor: item.completed ? "#22c55e" : "#e2e8f0",
                      background: item.completed ? "#22c55e" : "transparent",
                    }}
                    aria-hidden
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        textDecoration: item.completed ? "line-through" : "none",
                        color: item.completed ? "#94a3b8" : "#1e293b",
                      }}
                    >
                      {item.title}
                    </h3>
                    {item.description && (
                      <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.25rem", lineHeight: 1.4 }}>
                        {item.description}
                      </p>
                    )}
                    {item.dueDate && !item.completed && (
                      <p style={{ fontSize: "0.8rem", color: "#7c3aed", marginTop: "0.35rem", fontWeight: 500 }}>
                        Due {formatDate(item.dueDate)}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
}
