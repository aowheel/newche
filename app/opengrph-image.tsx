import { ImageResponse } from "next/og";

export const alt = "About Newche";
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png";

export default async function Image() {
  const orbitronSemiBold = fetch(
    new URL("./Orbitron-SemiBold.ttf", import.meta.url)
  ).then(res => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Newche
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Orbitron",
          data: await orbitronSemiBold,
          style: "normal",
          weight: 700,
        }
      ]
    }
  );
}
