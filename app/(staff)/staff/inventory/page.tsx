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

const categories = [
  "All Categories",
  "Produce",
  "Dairy",
  "Meat & Protein",
  "Canned Goods",
  "Dry Goods",
  "Frozen",
  "Beverages",
  "Bakery",
  "Other",
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, invRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/inventory"),
        ]);

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData);
        }

        if (invRes.ok) {
          const invData = await invRes.json();
          setItems(invData);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function getEventTitle(eventId: number | null): string {
    if (!eventId) return "Unassigned";
    const event = events.find((e) => e.id === eventId);
    return event?.title || "Unknown Event";
  }

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedByCategory = filteredItems.reduce((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  const totalItems = filteredItems.length;
  const totalQuantity = filteredItems.reduce((sum, i) => sum + (i.quantity || 0), 0);

  if (loading) {
    return (
      <div style={{ padding: "2rem 0" }}>
        <p style={{ color: "#64748b" }}>Loading inventory...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          Inventory Overview
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
          View all inventory items across events
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "1.25rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.25rem" }}>
            Total Items
          </p>
          <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b" }}>
            {totalItems}
          </p>
        </div>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "1.25rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.25rem" }}>
            Total Quantity
          </p>
          <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b" }}>
            {totalQuantity}
          </p>
        </div>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "1.25rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.25rem" }}>
            Categories
          </p>
          <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b" }}>
            {Object.keys(groupedByCategory).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "0.625rem 1rem",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            background: "#fff",
            fontSize: "0.9rem",
            minWidth: "12rem",
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "0.625rem 1rem",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            background: "#fff",
            fontSize: "0.9rem",
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "3rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#64748b", marginBottom: "1rem" }}>
            No inventory items yet
          </p>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Add inventory items from individual event pages
          </p>
          <Link
            href="/staff/events"
            style={{
              display: "inline-block",
              marginTop: "1rem",
              color: "#2563eb",
              fontWeight: 600,
            }}
          >
            Go to Events →
          </Link>
        </div>
      )}

      {/* Filtered Empty */}
      {items.length > 0 && filteredItems.length === 0 && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#64748b" }}>No items match your filters</p>
        </div>
      )}

      {/* Inventory Table */}
      {filteredItems.length > 0 && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>
                  Item
                </th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>
                  Event
                </th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>
                  Quantity
                </th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "0.875rem 1rem", fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    {item.eventId ? (
                      <Link
                        href={`/staff/events/${item.eventId}/inventory`}
                        style={{ color: "#2563eb", fontSize: "0.9rem" }}
                      >
                        {getEventTitle(item.eventId)}
                      </Link>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ padding: "0.875rem 1rem", color: "#475569" }}>
                    {item.quantity !== null ? `${item.quantity} ${item.unit || ""}` : "—"}
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.625rem",
                        background: "#f1f5f9",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        color: "#475569",
                      }}
                    >
                      {item.category || "Other"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
