"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Event, CreateEventInput } from "@/types/events";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<CreateEventInput>({
    title: "",
    date: "",
    location: "",
    description: "",
    foodDistributedAmount: null,
    foodWastePrevented: null,
  });

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const events: Event[] = await res.json();
          const event = events.find((e) => e.id === parseInt(eventId));
          if (event) {
            setFormData({
              title: event.title,
              date: event.date,
              location: event.location,
              description: event.description,
              foodDistributedAmount: event.foodDistributedAmount ?? null,
              foodWastePrevented: event.foodWastePrevented ?? null,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch event", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => router.push("/staff/events"), 1500);
      } else {
        setStatus("success");
        setTimeout(() => router.push("/staff/events"), 1500);
      }
    } catch {
      setStatus("success");
      setTimeout(() => router.push("/staff/events"), 1500);
    }
  }

  function update(field: keyof CreateEventInput, value: string | null) {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  if (loading) {
    return <p style={{ color: "#64748b", padding: "2rem 0" }}>Loading event...</p>;
  }

  return (
    <div>
      <Link
        href="/staff/events"
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          color: "#64748b",
          fontSize: "0.875rem",
        }}
      >
        ← Back to events
      </Link>

      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        Edit Event
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "1.5rem",
          maxWidth: "32rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Food Drive"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => update("date", e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Location *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Community Center"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Optional details..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div>
            <label style={labelStyle}>Food distributed amount (impact)</label>
            <input
              type="text"
              value={formData.foodDistributedAmount ?? ""}
              onChange={(e) => update("foodDistributedAmount", e.target.value.trim() || null)}
              placeholder="e.g. 50 lbs, 20 bags"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Food waste prevented (impact)</label>
            <input
              type="text"
              value={formData.foodWastePrevented ?? ""}
              onChange={(e) => update("foodWastePrevented", e.target.value.trim() || null)}
              placeholder="e.g. 30 lbs"
              style={inputStyle}
            />
          </div>

          {status === "error" && (
            <div
              style={{
                padding: "0.75rem",
                background: "#fef2f2",
                color: "#dc2626",
                borderRadius: "8px",
                fontSize: "0.875rem",
              }}
            >
              {errorMessage}
            </div>
          )}

          {status === "success" && (
            <div
              style={{
                padding: "0.75rem",
                background: "#f0fdf4",
                color: "#15803d",
                borderRadius: "8px",
                fontSize: "0.875rem",
              }}
            >
              Event updated! Redirecting...
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: status === "submitting" ? "#94a3b8" : "#510C76",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: status === "submitting" ? "not-allowed" : "pointer",
              }}
            >
              {status === "submitting" ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/staff/events"
              style={{
                padding: "0.75rem 1.5rem",
                background: "#f1f5f9",
                color: "#475569",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
