"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Event } from "@/types/events";

type InventoryItem = {
  id: number;
  eventId: number | null;
  name: string;
  quantity: number | null;
  unit: string | null;
  category: string | null;
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isUpcoming(dateStr: string): boolean {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d >= today;
}

export default function StaffDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, invRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/inventory"),
        ]);
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data);
        }
        if (invRes.ok) {
          const data = await invRes.json();
          setInventory(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const upcomingEvents = events.filter((e) => isUpcoming(e.date)).slice(0, 5);
  const totalQuantity = inventory.reduce((sum, i) => sum + (i.quantity ?? 0), 0);
  const categories = new Set(inventory.map((i) => i.category || "Other").filter(Boolean)).size;

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1.5rem",
    textDecoration: "none",
    color: "inherit",
    display: "block",
    transition: "box-shadow 0.2s",
  };

  const statCardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1.25rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Event and Inventory Dashboard
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
          Overview of events and inventory at a glance.
        </p>
      </div>

      {loading && (
        <p style={{ color: "#64748b", padding: "2rem 0" }}>Loading dashboard...</p>
      )}

      {!loading && (
        <>
          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div style={statCardStyle}>
              <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.25rem" }}>
                Total Events
              </p>
              <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b" }}>
                {events.length}
              </p>
            </div>
            <div style={statCardStyle}>
              <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.25rem" }}>
                Upcoming
              </p>
              <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#2563eb" }}>
                {events.filter((e) => isUpcoming(e.date)).length}
              </p>
            </div>
            <div style={statCardStyle}>
              <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.25rem" }}>
                Inventory Items
              </p>
              <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b" }}>
                {inventory.length}
              </p>
            </div>
            <div style={statCardStyle}>
              <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.25rem" }}>
                Total Quantity
              </p>
              <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b" }}>
                {totalQuantity}
              </p>
            </div>
            <div style={statCardStyle}>
              <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.25rem" }}>
                Categories
              </p>
              <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b" }}>
                {categories}
              </p>
            </div>
          </div>

          {/* Upcoming events + Inventory summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Upcoming Events</h3>
                <Link
                  href="/staff/events"
                  style={{ fontSize: "0.875rem", color: "#2563eb", fontWeight: 600 }}
                >
                  View all
                </Link>
              </div>
              {upcomingEvents.length === 0 ? (
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No upcoming events</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {upcomingEvents.map((event) => (
                    <li
                      key={event.id}
                      style={{
                        padding: "0.5rem 0",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {formatDate(event.date)}
                        </span>
                        <p style={{ fontWeight: 600, fontSize: "0.95rem", marginTop: "0.125rem" }}>
                          {event.title}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                        <Link
                          href={`/staff/events/${event.id}/inventory`}
                          style={{
                            fontSize: "0.8rem",
                            color: "#2563eb",
                            fontWeight: 500,
                          }}
                        >
                          Inventory
                        </Link>
                        <Link
                          href={`/staff/events/${event.id}/edit`}
                          style={{
                            fontSize: "0.8rem",
                            color: "#475569",
                            fontWeight: 500,
                          }}
                        >
                          Edit
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Inventory Summary</h3>
                <Link
                  href="/staff/inventory"
                  style={{ fontSize: "0.875rem", color: "#2563eb", fontWeight: 600 }}
                >
                  View all
                </Link>
              </div>
              {inventory.length === 0 ? (
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No inventory items yet</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {inventory.slice(0, 5).map((item) => (
                    <li
                      key={item.id}
                      style={{
                        padding: "0.5rem 0",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: "0.9rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      <span style={{ color: "#64748b" }}>
                        {item.quantity != null ? `${item.quantity} ${item.unit || ""}` : "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem" }}>Quick actions</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
              gap: "1rem",
            }}
          >
            <Link href="/staff/events" style={cardStyle}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📅</div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.375rem" }}>
                Events
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.5 }}>
                Create and manage community events.
              </p>
            </Link>
            <Link href="/staff/inventory" style={cardStyle}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📦</div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.375rem" }}>
                Inventory
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.5 }}>
                Track all inventory items across events.
              </p>
            </Link>
            <Link href="/staff/events/new" style={cardStyle}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>➕</div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.375rem" }}>
                New Event
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.5 }}>
                Create a new event for the client landing page.
              </p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
