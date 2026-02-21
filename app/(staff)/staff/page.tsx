import Link from "next/link";

export default function StaffHomePage() {
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

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Welcome to Staff Portal
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
          Manage events, inventory, and track community impact.
        </p>
      </div>

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
            Create and manage community events. View, edit, or delete existing events.
          </p>
        </Link>

        <Link href="/staff/inventory" style={cardStyle}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📦</div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.375rem" }}>
            Inventory
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.5 }}>
            Track all inventory items across events. View quantities and categories.
          </p>
        </Link>

        <Link href="/staff/events/new" style={cardStyle}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>➕</div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.375rem" }}>
            New Event
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.5 }}>
            Create a new event that will appear on the client landing page.
          </p>
        </Link>
      </div>
    </div>
  );
}
