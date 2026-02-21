"use client";

import type { Event } from "@/types/events";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EventDetailModal({
  event,
  onClose,
}: {
  event: Event;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "1.5rem",
          maxWidth: "24rem",
          width: "100%",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <h2 id="event-modal-title" style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
            {event.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              fontSize: "1.25rem",
              cursor: "pointer",
              color: "#64748b",
              padding: "0.25rem",
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>
        <p style={{ fontSize: "0.875rem", color: "#7c3aed", fontWeight: 600, marginBottom: "0.5rem" }}>
          {formatDate(event.date)}
        </p>
        <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "0.75rem" }}>
          📍 {event.location}
        </p>
        {event.description && (
          <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.6 }}>
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}
