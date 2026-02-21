"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ImpactData = {
  totalEvents: number;
  totalCheckIns: number;
  eventImpact: {
    id: number;
    title: string;
    date: string;
    foodDistributedAmount: string | null;
    foodWastePrevented: string | null;
  }[];
  checkInsWithFoodCount: number;
  foodReceivedAmounts: string[];
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function StaffImpactPage() {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImpact() {
      try {
        const res = await fetch("/api/impact");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch impact data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchImpact();
  }, []);

  const statCardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1.25rem",
    marginBottom: "1rem",
  };

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Impact</h2>
        <p style={{ color: "#64748b", padding: "2rem 0" }}>Loading impact data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Impact</h2>
        <p style={{ color: "#64748b" }}>Unable to load impact data.</p>
      </div>
    );
  }

  const eventsWithDistributed = data.eventImpact.filter((e) => e.foodDistributedAmount);
  const eventsWithWastePrevented = data.eventImpact.filter((e) => e.foodWastePrevented);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Impact</h2>
        <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
          Total events, people served, food distributed, and food waste prevented.
        </p>
      </div>

      {/* Main stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(11rem, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div style={statCardStyle}>
          <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.25rem" }}>Total events</p>
          <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b" }}>{data.totalEvents}</p>
        </div>
        <div style={statCardStyle}>
          <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.25rem" }}>People checked in</p>
          <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b" }}>{data.totalCheckIns}</p>
        </div>
        <div style={statCardStyle}>
          <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.25rem" }}>Check-ins with food recorded</p>
          <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#047857" }}>{data.checkInsWithFoodCount}</p>
        </div>
      </div>

      {/* Food distributed (event-level) */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem" }}>Amount of food distributed</h3>
        {eventsWithDistributed.length === 0 ? (
          <div style={{ ...cardStyle, color: "#64748b", fontSize: "0.9rem" }}>
            No event-level amounts recorded yet. Add &quot;Food distributed amount&quot; when editing an event.
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {eventsWithDistributed.map((e) => (
              <li key={e.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ fontWeight: 600 }}>{e.title}</span>
                  <span style={{ color: "#047857", fontWeight: 600 }}>{e.foodDistributedAmount}</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "0.25rem" }}>{formatDate(e.date)}</p>
                <Link href={`/staff/events/${e.id}/edit`} style={{ fontSize: "0.8125rem", color: "#510C76", marginTop: "0.5rem", display: "inline-block" }}>
                  Edit event
                </Link>
              </li>
            ))}
          </ul>
        )}
        {data.foodReceivedAmounts.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>
              From check-ins (amount received per household)
            </p>
            <div style={{ ...cardStyle, padding: "0.75rem" }}>
              <p style={{ fontSize: "0.9rem", color: "#334155", margin: 0 }}>
                {data.foodReceivedAmounts.join(" · ")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Food waste prevented */}
      <div>
        <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem" }}>Food waste prevented</h3>
        {eventsWithWastePrevented.length === 0 ? (
          <div style={{ ...cardStyle, color: "#64748b", fontSize: "0.9rem" }}>
            No data yet. Add &quot;Food waste prevented&quot; when editing an event.
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {eventsWithWastePrevented.map((e) => (
              <li key={e.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ fontWeight: 600 }}>{e.title}</span>
                  <span style={{ color: "#b45309", fontWeight: 600 }}>{e.foodWastePrevented}</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "0.25rem" }}>{formatDate(e.date)}</p>
                <Link href={`/staff/events/${e.id}/edit`} style={{ fontSize: "0.8125rem", color: "#510C76", marginTop: "0.5rem", display: "inline-block" }}>
                  Edit event
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
