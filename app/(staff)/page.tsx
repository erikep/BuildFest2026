import Link from "next/link";

export default function StaffHomePage() {
  return (
    <div>
      <p style={{ marginBottom: "1.5rem", color: "#475569" }}>
        Create and manage events. New events will appear on the client landing page.
      </p>
      <Link
        href="/events/new"
        style={{
          display: "inline-block",
          padding: "0.75rem 1.25rem",
          background: "#2563eb",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 600,
        }}
      >
        Create event
      </Link>
    </div>
  );
}
