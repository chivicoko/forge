export const dynamic = "force-dynamic";

import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          background: "#fafafa",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>⬡</div>
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-2px",
            }}
          >
            404
          </h1>
          <p style={{ color: "#666", marginBottom: "2rem" }}>
            This page doesn&apos;t exist.
          </p>
          <Link
            href="/"
            style={{
              background: "#F59E0B",
              color: "white",
              padding: "0.75rem 2rem",
              borderRadius: "9999px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Go Home
          </Link>
        </div>
      </body>
    </html>
  );
}
