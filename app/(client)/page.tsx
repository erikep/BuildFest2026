import Link from "next/link";

export default function ClientLandingPage() {
  return (
    <div style={{ maxWidth: "42rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Tommie Shelf
      </h1>
      <p style={{ color: "#475569", marginBottom: "1.5rem" }}>
        Events and resources for our community.
      </p>
      <Link
        href="/events"
        style={{
          display: "inline-block",
          padding: "0.75rem 1.25rem",
          background: "#2563eb",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 600,
        }}
      >
        View events
      </Link>
      <p style={{ marginTop: "2rem", fontSize: "0.875rem", color: "#64748b" }}>
        Staff: <Link href="/staff" style={{ color: "#2563eb" }}>Event management</Link>
      </p>
    </div>
  );
}
