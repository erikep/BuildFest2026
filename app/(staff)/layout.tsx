import Link from "next/link";
import Image from "next/image";

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
          background: "#510C76",
          color: "#f8fafc",
          borderBottom: "3px solid #3d0959",
        }}
      >
        <div style={{ maxWidth: "56rem", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/staff" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc" }} aria-label="Tommie Shelf Staff home">
            <Image
              src="/logo.png"
              alt="Tommie Shelf"
              width={300}
              height={100}
              style={{ height: "3.5rem", width: "auto" }}
              priority
            />
            <span style={{ fontSize: "2rem" }}>Staff</span>
          </Link>
          <nav style={{ display: "flex", gap: "1.5rem", fontSize: "1.0625rem" }}>
            <Link href="/staff" className="header-nav-link" style={{ color: "#fff", fontWeight: 700 }}>
              Home
            </Link>
            <Link href="/staff/events" className="header-nav-link" style={{ color: "#fff", fontWeight: 700 }}>
              Events
            </Link>
            <Link href="/staff/inventory" className="header-nav-link" style={{ color: "#fff", fontWeight: 700 }}>
              Inventory
            </Link>
            <Link href="/staff/impact" className="header-nav-link" style={{ color: "#fff", fontWeight: 700 }}>
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
