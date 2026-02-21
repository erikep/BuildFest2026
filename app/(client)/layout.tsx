import Link from "next/link";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#7c3aed",
            letterSpacing: "-0.025em",
          }}
        >
          Tommie Shelf
        </Link>
        <nav style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem" }}>
          <Link
            href="/"
            style={{ color: "#475569", fontWeight: 500 }}
          >
            Home
          </Link>
          <Link
            href="/events"
            style={{ color: "#475569", fontWeight: 500 }}
          >
            Events
          </Link>
        </nav>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      <footer
        style={{
          borderTop: "1px solid #e2e8f0",
          padding: "1.5rem",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#94a3b8",
        }}
      >
        Tommie Shelf &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
