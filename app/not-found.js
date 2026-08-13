export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 32,
        gap: 12,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "var(--emblem-bg)",
          color: "var(--zw-green)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        M
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Hapana. Page not found.</h1>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, maxWidth: 360 }}>
        This page doesn't exist. Head back and try Muzezuru instead.
      </p>
      <a
        href="/"
        style={{
          marginTop: 12,
          fontSize: 14,
          padding: "10px 20px",
          borderRadius: 999,
          background: "var(--zw-green)",
          color: "#fff",
          textDecoration: "none",
        }}
      >
        Back to Muzezuru
      </a>
    </main>
  );
}
