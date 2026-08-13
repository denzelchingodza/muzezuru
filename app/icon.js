import { ImageResponse } from "next/og";

// Next.js picks this up automatically as the site favicon -- generated at
// build time from JSX/CSS rather than needing a separate .ico file to
// design and keep in sync with the header logo.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "#0f8a3e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: 34,
          fontWeight: 600,
          fontFamily: "sans-serif",
        }}
      >
        M
      </div>
    ),
    { ...size }
  );
}
