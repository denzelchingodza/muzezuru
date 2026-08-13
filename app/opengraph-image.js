import { ImageResponse } from "next/og";

// Generated on the fly (JSX/CSS -> PNG) rather than a designed static
// asset -- Next.js serves this automatically at /opengraph-image for link
// previews on Twitter, Slack, iMessage, etc.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f2f8ec",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", height: 10, width: "100%", position: "absolute", top: 0 }}>
          <div style={{ flex: 1, background: "#0f8a3e" }} />
          <div style={{ flex: 1, background: "#ffd200" }} />
          <div style={{ flex: 1, background: "#de2010" }} />
          <div style={{ flex: 1, background: "#17170f" }} />
        </div>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "#0f8a3e",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
            fontWeight: 600,
            marginBottom: 32,
          }}
        >
          M
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 600, color: "#17170f" }}>
          Muze<span style={{ color: "#0f8a3e" }}>zuru</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#5b5a52", marginTop: 16 }}>
          A Shona-speaking AI companion
        </div>
      </div>
    ),
    { ...size }
  );
}
