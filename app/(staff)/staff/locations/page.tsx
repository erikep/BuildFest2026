"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LocationItem = {
  id: number;
  name: string;
  type: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  url: string | null;
};

const emptyForm = {
  name: "",
  type: "SHELF" as "SHELF" | "KITCHEN",
  address: "",
  latitude: "",
  longitude: "",
  url: "",
};

export default function StaffLocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function fetchLocations() {
    fetch("/api/locations")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: LocationItem[]) => setLocations(Array.isArray(data) ? data : []))
      .catch(() => setLocations([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchLocations();
  }, []);

  function setFormField<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function fillForm(loc: LocationItem) {
    setForm({
      name: loc.name,
      type: loc.type as "SHELF" | "KITCHEN",
      address: loc.address ?? "",
      latitude: loc.latitude != null ? String(loc.latitude) : "",
      longitude: loc.longitude != null ? String(loc.longitude) : "",
      url: loc.url ?? "",
    });
    setEditingId(loc.id);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        address: form.address.trim() || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        url: form.url.trim() || null,
      };
      if (editingId != null) {
        const res = await fetch(`/api/locations/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setMessage({ type: "success", text: "Location updated." });
          resetForm();
          fetchLocations();
        } else {
          const data = await res.json().catch(() => ({}));
          setMessage({ type: "error", text: data.error ?? "Update failed." });
        }
      } else {
        const res = await fetch("/api/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setMessage({ type: "success", text: "Location added." });
          resetForm();
          fetchLocations();
        } else {
          const data = await res.json().catch(() => ({}));
          setMessage({ type: "error", text: data.error ?? "Add failed." });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Request failed." });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this location? It will no longer appear on the Find food map.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/locations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLocations((prev) => prev.filter((l) => l.id !== id));
        if (editingId === id) resetForm();
      }
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: "0.625rem 0.875rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    background: "#fff",
    fontSize: "1rem",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "0.5rem",
  };

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
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Locations</h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Food shelves and kitchens shown on the client &quot;Find food&quot; map.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...buttonStyle, background: "#e0e7ff", color: "#3730a3", textDecoration: "none" }}
        >
          View Find food page →
        </Link>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem" }}>
          {editingId != null ? "Edit location" : "Add location"}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setFormField("name", e.target.value)}
              placeholder="e.g. Community Food Shelf"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Type *</label>
            <select
              value={form.type}
              onChange={(e) => setFormField("type", e.target.value)}
              style={inputStyle}
            >
              <option value="SHELF">Food shelf</option>
              <option value="KITCHEN">Kitchen</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setFormField("address", e.target.value)}
              placeholder="Street address"
              style={inputStyle}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Latitude</label>
              <input
                type="text"
                inputMode="decimal"
                value={form.latitude}
                onChange={(e) => setFormField("latitude", e.target.value)}
                placeholder="e.g. 44.9537"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Longitude</label>
              <input
                type="text"
                inputMode="decimal"
                value={form.longitude}
                onChange={(e) => setFormField("longitude", e.target.value)}
                placeholder="e.g. -93.09"
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Website URL</label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setFormField("url", e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
          </div>
          {message && (
            <p
              style={{
                fontSize: "0.875rem",
                color: message.type === "success" ? "#15803d" : "#dc2626",
              }}
            >
              {message.text}
            </p>
          )}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...buttonStyle,
                background: submitting ? "#94a3b8" : "#2563eb",
                color: "#fff",
              }}
            >
              {submitting ? "Saving..." : editingId != null ? "Update" : "Add location"}
            </button>
            {editingId != null && (
              <button
                type="button"
                onClick={resetForm}
                style={{ ...buttonStyle, background: "#f1f5f9", color: "#475569" }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem" }}>Existing locations</h3>
      {loading && <p style={{ color: "#64748b" }}>Loading...</p>}
      {!loading && locations.length === 0 && (
        <p style={{ color: "#64748b" }}>No locations yet. Add one above to show on the Find food map.</p>
      )}
      {!loading && locations.length > 0 && (
        <div>
          {locations.map((loc) => (
            <div key={loc.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#2563eb",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {loc.type}
                  </span>
                  <h4 style={{ fontSize: "1.125rem", fontWeight: 700, marginTop: "0.25rem" }}>{loc.name}</h4>
                  {loc.address && (
                    <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>{loc.address}</p>
                  )}
                  {(loc.latitude != null || loc.longitude != null) && (
                    <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                      {loc.latitude}, {loc.longitude}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => fillForm(loc)}
                    style={{ ...buttonStyle, background: "#f1f5f9", color: "#475569" }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(loc.id)}
                    disabled={deletingId === loc.id}
                    style={{
                      ...buttonStyle,
                      background: "#fef2f2",
                      color: "#dc2626",
                      opacity: deletingId === loc.id ? 0.6 : 1,
                    }}
                  >
                    {deletingId === loc.id ? "..." : "Delete"}
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
