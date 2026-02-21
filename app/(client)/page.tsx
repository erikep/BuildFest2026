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
    description: "Let us know how you'd like to help.",
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
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [actionItems, setActionItems] = useState<ActionItem[]>(mockActionItems);
  const [loading, setLoading] = useState(true);
  const [actionItemsOpen, setActionItemsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/events").then((res) => (res.ok ? res.json() : [])).catch(() => []),
      fetch("/api/resources").then((res) => (res.ok ? res.json() : [])).catch(() => []),
      fetch("/api/action-items").then((res) => (res.ok ? res.json() : [])).catch(() => []),
    ]).then(([eventsData, resourcesData, actionItemsData]) => {
      setEvents(Array.isArray(eventsData) && eventsData.length > 0 ? eventsData : mockEvents);
      setResources(Array.isArray(resourcesData) && resourcesData.length > 0 ? resourcesData : mockResources);
      setActionItems(Array.isArray(actionItemsData) && actionItemsData.length > 0 ? actionItemsData : mockActionItems);
    }).finally(() => setLoading(false));
  }, []);

  const upcoming = events.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          backgroundImage: "linear-gradient(rgba(131, 72, 173, 0.7), rgba(100, 55, 133, 0.7)), url(/school.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          padding: "4rem 1.5rem",
          textAlign: "center",
          borderTop: "6px solid #510C76",
          borderBottom: "6px solid #510C76",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.75rem" }}>
          Welcome to <span style={{ color: "#94d500" }}>Tommie</span>{" "}
          <span style={{ color: "#94d500" }}>Shelf</span>
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            maxWidth: "36rem",
            margin: "0 auto 2rem",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          Events and resources for our community. Find upcoming events, volunteer, and make an impact.
        </p>
        <Link
          href="/events"
          className="browse-events-cta"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            background: "#fff",
            color: "#510C76",
            borderRadius: "9999px",
            fontWeight: 700,
            fontSize: "1rem",
          }}
        >
          Browse all events
        </Link>
      </section>

      {/* Hours, contact & donate — Tommie Shelf info */}
      <section
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          Hours, contact & support
        </h2>
        <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          Campus hours, how to reach us, and how to give.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
            gap: "1.25rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "1.25rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: "#510C76" }}>
              Hours of operation
            </h3>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem" }}>
              St. Paul Campus
            </p>
            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.5, marginBottom: "0.75rem" }}>
              First Tuesday of every month, 10:00 a.m.–12:00 p.m., at the Iversen Center for Faith turnaround.
            </p>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem" }}>
              Minneapolis Campus
            </p>
            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.5 }}>
              Third Wednesday of every month, 3:00–5:00 p.m., Terrence Murphy Hall, Room 252 (September–May).
            </p>
          </div>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "1.25rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: "#510C76" }}>
              Contact Tommie Shelf
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.5, marginBottom: "0.5rem" }}>
              Questions about accessing groceries or supporting Tommie Shelf?
            </p>
            <a
              href="mailto:tommieshelf@stthomas.edu"
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "#510C76",
              }}
            >
              tommieshelf@stthomas.edu
            </a>
          </div>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "1.25rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: "#510C76" }}>
              Donate
            </h3>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem" }}>
              Donate food
            </p>
            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.5, marginBottom: "0.75rem" }}>
              Non-perishable groceries may be dropped off during the school year at Anderson Student Center, Room 207.
            </p>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem" }}>
              Donate money
            </p>
            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.5, marginBottom: "0.75rem" }}>
              Your support helps ensure access to quality, healthy food for our community.
            </p>
            <a
              href="https://donorbox.org/tommieshelfdonation"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                background: "#510C76",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Make a monetary donation
            </a>
          </div>
        </div>
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
        <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: 600 }}>
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
                      fontSize: "0.85rem", fontWeight: 600,
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
                color: "#510C76",
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
        <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: 600 }}>
          Helpful links for food assistance, housing, and community services.
        </p>
        <p style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/find-food"
            className="header-nav-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#510C76",
            }}
          >
            📍 Find Food shelves and kitchens near you
          </Link>
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
            gap: "1.25rem",
          }}
        >
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="external-resource-card"
              style={{
                display: "block",
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.25rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#510C76", marginBottom: "0.5rem" }}>
                {resource.title}
              </h3>
              {resource.description && (
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569", lineHeight: 1.5 }}>
                  {resource.description}
                </p>
              )}
              <span style={{ fontSize: "0.8rem", color: "#510C76", fontWeight: 600, marginTop: "0.5rem", display: "inline-block" }}>
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
            <p style={{ color: "#64748b", marginTop: "0.25rem", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: 600 }}>
              Things you might want to check out.
            </p>
            <ul
              id="action-items-list"
              style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              {actionItems.map((item) => (
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
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", marginTop: "0.25rem", lineHeight: 1.4 }}>
                        {item.description}
                      </p>
                    )}
                    {item.dueDate && !item.completed && (
                      <p style={{ fontSize: "0.8rem", color: "#510C76", marginTop: "0.35rem", fontWeight: 600 }}>
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
    </div>
  );
}
