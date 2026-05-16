import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "ALTR — Sponsorship OS for APAC and GCC live events, settled on XRPL";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#08080d",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              fontSize: 30,
              fontWeight: 500,
              color: "#f5f5f0",
              letterSpacing: "-0.02em",
            }}
          >
            ALTR
          </span>
          <div
            style={{
              width: 18,
              height: 18,
              background: "#FF3DD1",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span
            style={{
              fontSize: 26,
              color: "#41B888",
              fontWeight: 500,
            }}
          >
            Sponsorship OS for APAC + GCC
          </span>
          <h1
            style={{
              fontSize: 92,
              fontWeight: 500,
              color: "#f5f5f0",
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              margin: 0,
            }}
          >
            Sponsorship that pays for itself.
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <span style={{ fontSize: 22, color: "#a5a5b0" }}>
            Discover · Deal · Settle on XRPL · Measure
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid rgba(65, 184, 136, 0.4)",
              background: "rgba(65, 184, 136, 0.1)",
              fontSize: 18,
              fontWeight: 500,
              color: "#71CFA4",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: "#41B888",
              }}
            />
            Built on XRPL
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
