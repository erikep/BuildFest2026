"use client";

import { useState } from "react";
import Link from "next/link";
import type { CreateEventInput } from "@/types/events";

const API_URL = "/api/events";

export default function NewEventPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [formData, setFormData] = useState<CreateEventInput>({
    title: "",
    date: "",
    location: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }

      setStatus("success");
      setFormData({ title: "", date: "", location: "", description: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Backend may not be ready yet.");
    }
  }

  function update(field: keyof CreateEventInput, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div>
      <Link
        href="/staff"
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          color: "#475569",
          fontSize: "0.875rem",
        }}
      >
        ← Back to staff home
      </Link>

      <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", fontWeight: 600 }}>
        Create event
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "28rem",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Title</span>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Food Drive"
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              background: "#fff",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Date</span>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => update("date", e.target.value)}
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              background: "#fff",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Location</span>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="e.g. Community Center"
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              background: "#fff",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>Description</span>
          <textarea
            value={formData.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Optional details..."
            rows={3}
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              background: "#fff",
              resize: "vertical",
            }}
          />
        </label>

        {status === "error" && (
          <div
            style={{
              padding: "0.75rem",
              background: "#fef2f2",
              color: "#b91c1c",
              borderRadius: "6px",
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
              borderRadius: "6px",
              fontSize: "0.875rem",
            }}
          >
            Event created successfully. It will appear on the client landing page.
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          style={{
            padding: "0.75rem 1.25rem",
            background: status === "submitting" ? "#94a3b8" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            marginTop: "0.5rem",
          }}
        >
          {status === "submitting" ? "Submitting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}
