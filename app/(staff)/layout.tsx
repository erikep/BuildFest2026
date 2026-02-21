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
        <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Staff · Event management</h1>
      </header>
      <main style={{ padding: "1.5rem", maxWidth: "42rem", margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}
