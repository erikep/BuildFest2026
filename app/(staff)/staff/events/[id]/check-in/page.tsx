"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Event } from "@/types/events";

type CheckInRecord = {
  id: number;
  firstName: string;
  lastName: string | null;
  householdSize: number | null;
  zipCode: string | null;
  firstTimeVisitor: boolean;
  foodReceivedAmount: string | null;
  createdAt: string;
};

export default function EventCheckInPage() {
  const params = useParams();
  const eventId = params.id as string;
  const eventIdNum = parseInt(eventId, 10);

  const [event, setEvent] = useState<Event | null>(null);
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    householdSize: "",
    zipCode: "",
    firstTimeVisitor: true,
    foodReceivedAmount: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, checkInsRes] = await Promise.all([
          fetch("/api/events"),
          fetch(`/api/events/${eventId}/check-ins`),
        ]);
        if (eventsRes.ok) {
          const events: Event[] = await eventsRes.json();
          const found = events.find((e) => e.id === eventIdNum);
          if (found) setEvent(found);
        }
        if (checkInsRes.ok) {
          const data = await checkInsRes.json();
          setCheckIns(data);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [eventId, eventIdNum]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/check-ins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: eventIdNum,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim() || null,
          householdSize: formData.householdSize ? parseInt(formData.householdSize, 10) : null,
          zipCode: formData.zipCode.trim() || null,
          firstTimeVisitor: formData.firstTimeVisitor,
          foodReceivedAmount: formData.foodReceivedAmount.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save check-in");
      }

      const created = await res.json();
      setCheckIns((prev) => [
        {
          id: created.id,
          firstName: created.firstName,
          lastName: created.lastName,
          householdSize: created.householdSize,
          zipCode: created.zipCode,
          firstTimeVisitor: created.firstTimeVisitor,
          foodReceivedAmount: created.foodReceivedAmount,
          createdAt: created.createdAt,
        },
        ...prev,
      ]);
      setStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        householdSize: "",
        zipCode: "",
        firstTimeVisitor: true,
        foodReceivedAmount: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
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
    return <p style={{ color: "#64748b", padding: "2rem 0" }}>Loading...</p>;
  }

  if (!event) {
    return (
      <div>
        <p style={{ color: "#64748b" }}>Event not found.</p>
        <Link href="/staff/events" style={{ color: "#2563eb", marginTop: "1rem", display: "inline-block" }}>
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/staff/events/${eventId}/edit`}
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          color: "#475569",
          fontSize: "0.875rem",
        }}
      >
        ← Back to event
      </Link>

      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        Demographic data — {event.title}
      </h2>
      <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        Collect demographic information for first-time visitors at this event.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem" }}>
            New check-in
          </h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label htmlFor="firstName" style={labelStyle}>
                First name *
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                style={inputStyle}
                placeholder="e.g. Jane"
              />
            </div>
            <div>
              <label htmlFor="lastName" style={labelStyle}>
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                style={inputStyle}
                placeholder="e.g. Doe"
              />
            </div>
            <div>
              <label htmlFor="householdSize" style={labelStyle}>
                Household size
              </label>
              <input
                id="householdSize"
                type="number"
                min={1}
                max={99}
                value={formData.householdSize}
                onChange={(e) => setFormData((p) => ({ ...p, householdSize: e.target.value }))}
                style={inputStyle}
                placeholder="e.g. 4"
              />
            </div>
            <div>
              <label htmlFor="zipCode" style={labelStyle}>
                ZIP code
              </label>
              <input
                id="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData((p) => ({ ...p, zipCode: e.target.value }))}
                style={inputStyle}
                placeholder="e.g. 55455"
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                id="firstTimeVisitor"
                type="checkbox"
                checked={formData.firstTimeVisitor}
                onChange={(e) => setFormData((p) => ({ ...p, firstTimeVisitor: e.target.checked }))}
                style={{ width: "1rem", height: "1rem" }}
              />
              <label htmlFor="firstTimeVisitor" style={{ ...labelStyle, marginBottom: 0, fontWeight: 500 }}>
                First-time visitor
              </label>
            </div>
            <div>
              <label htmlFor="foodReceivedAmount" style={labelStyle}>
                Food received (optional)
              </label>
              <input
                id="foodReceivedAmount"
                type="text"
                value={formData.foodReceivedAmount}
                onChange={(e) => setFormData((p) => ({ ...p, foodReceivedAmount: e.target.value }))}
                style={inputStyle}
                placeholder="e.g. 2 bags"
              />
            </div>
            {status === "error" && (
              <p style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errorMessage}</p>
            )}
            {status === "success" && (
              <p style={{ color: "#16a34a", fontSize: "0.875rem" }}>Check-in recorded.</p>
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
                fontSize: "0.95rem",
                cursor: status === "submitting" ? "not-allowed" : "pointer",
              }}
            >
              {status === "submitting" ? "Saving…" : "Save check-in"}
            </button>
          </form>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem" }}>
            Check-ins at this event ({checkIns.length})
          </h3>
          {checkIns.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No check-ins yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {checkIns.map((c) => (
                <li
                  key={c.id}
                  style={{
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #f1f5f9",
                    fontSize: "0.9rem",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {c.firstName} {c.lastName || ""}
                  </span>
                  {c.householdSize != null && (
                    <span style={{ color: "#64748b", marginLeft: "0.5rem" }}>
                      · Household: {c.householdSize}
                    </span>
                  )}
                  {c.zipCode && (
                    <span style={{ color: "#64748b", marginLeft: "0.5rem" }}>· {c.zipCode}</span>
                  )}
                  {c.firstTimeVisitor && (
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        padding: "0.125rem 0.5rem",
                        background: "#dbeafe",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        color: "#1d4ed8",
                      }}
                    >
                      First-time
                    </span>
                  )}
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                    {formatDate(c.createdAt)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
