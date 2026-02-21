"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Event } from "@/types/events";

type InventoryItem = {
  id: number;
  name: string;
  quantity: number | null;
  unit: string | null;
  category: string | null;
};

const categories = [
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

const units = ["lbs", "oz", "kg", "items", "cases", "boxes", "bags", "gallons", "liters"];

export default function EventInventoryPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "items",
    category: "Other",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsRes = await fetch("/api/events");
        if (eventsRes.ok) {
          const events: Event[] = await eventsRes.json();
          const found = events.find((e) => e.id === parseInt(eventId));
          if (found) setEvent(found);
        }

        const invRes = await fetch(`/api/events/${eventId}/inventory`);
        if (invRes.ok) {
          const data = await invRes.json();
          setItems(data);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [eventId]);

  function resetForm() {
    setFormData({ name: "", quantity: "", unit: "items", category: "Other" });
    setShowForm(false);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const payload = {
      eventId: parseInt(eventId),
      name: formData.name,
      quantity: formData.quantity ? parseInt(formData.quantity) : null,
      unit: formData.unit,
      category: formData.category,
    };

    if (editingId) {
      try {
        await fetch(`/api/inventory/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        // API may not exist yet
      }
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...payload }
            : item
        )
      );
    } else {
      const newItem: InventoryItem = {
        id: Date.now(),
        ...payload,
      };
      
      try {
        const res = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          newItem.id = created.id;
        }
      } catch {
        // API may not exist yet
      }
      
      setItems((prev) => [...prev, newItem]);
    }

    resetForm();
  }

  function handleEdit(item: InventoryItem) {
    setFormData({
      name: item.name,
      quantity: item.quantity?.toString() || "",
      unit: item.unit || "items",
      category: item.category || "Other",
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this inventory item?")) return;
    
    try {
      await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    } catch {
      // API may not exist yet
    }
    
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  const inputStyle: React.CSSProperties = {
    padding: "0.625rem 0.875rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    background: "#fff",
    fontSize: "0.9rem",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#475569",
    marginBottom: "0.375rem",
  };

  if (loading) {
    return <p style={{ color: "#64748b", padding: "2rem 0" }}>Loading...</p>;
  }

  return (
    <div>
      <Link
        href="/staff/events"
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          color: "#64748b",
          fontSize: "0.875rem",
        }}
      >
        ← Back to events
      </Link>

      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          Inventory for {event?.title || "Event"}
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
          {event?.date} • {event?.location}
        </p>
      </div>

      {/* Add Item Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "0.625rem 1.25rem",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "1.5rem",
          }}
        >
          + Add Inventory Item
        </button>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "1.25rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>
            {editingId ? "Edit Item" : "Add New Item"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Item Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Canned Tomatoes"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                style={inputStyle}
              >
                {units.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={inputStyle}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
            <button
              type="submit"
              style={{
                padding: "0.625rem 1.25rem",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {editingId ? "Update Item" : "Add Item"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: "0.625rem 1.25rem",
                background: "#f1f5f9",
                color: "#475569",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Inventory List */}
      {items.length === 0 && !showForm && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "3rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#64748b" }}>No inventory items yet</p>
        </div>
      )}

      {items.length > 0 && (
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
                  Quantity
                </th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>
                  Category
                </th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "right", fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "0.875rem 1rem", fontWeight: 500 }}>{item.name}</td>
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
                  <td style={{ padding: "0.875rem 1rem", textAlign: "right" }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        padding: "0.375rem 0.75rem",
                        background: "#f1f5f9",
                        color: "#475569",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        marginRight: "0.5rem",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: "0.375rem 0.75rem",
                        background: "#fef2f2",
                        color: "#dc2626",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {items.length > 0 && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem 1.25rem",
            background: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: "8px",
          }}
        >
          <p style={{ fontSize: "0.9rem", color: "#0369a1" }}>
            <strong>{items.length}</strong> item{items.length !== 1 ? "s" : ""} in inventory
            {" • "}
            <strong>{items.reduce((sum, i) => sum + (i.quantity || 0), 0)}</strong> total units
          </p>
        </div>
      )}
    </div>
  );
}
