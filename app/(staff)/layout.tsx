import Link from "next/link";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
      <header
        style={{
          padding: "1rem 1.5rem",
          background: "#0f172a",
          color: "#f8fafc",
          borderBottom: "3px solid #3b82f6",
        }}
      >
        <div style={{ maxWidth: "56rem", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/staff" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc" }}>
            Tommie Shelf Staff
          </Link>
          <nav style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem" }}>
            <Link href="/staff" style={{ color: "#94a3b8", fontWeight: 500 }}>
              Home
            </Link>
            <Link href="/staff/events" style={{ color: "#94a3b8", fontWeight: 500 }}>
              Events
            </Link>
            <Link href="/staff/inventory" style={{ color: "#94a3b8", fontWeight: 500 }}>
              Inventory
            </Link>
            <Link href="/staff/impact" style={{ color: "#94a3b8", fontWeight: 500 }}>
              Impact
            </Link>
            <Link href="/staff/locations" style={{ color: "#94a3b8", fontWeight: 500 }}>
              Locations
            </Link>
          </nav>
        </div>
      </header>
      <main style={{ padding: "1.5rem", maxWidth: "56rem", margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}
