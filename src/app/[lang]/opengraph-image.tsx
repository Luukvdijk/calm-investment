import { ImageResponse } from "next/og";
import { getDictionary, isLocale, locales, defaultLocale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Calm Investments";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

async function fetchGoogleFont(
  family: string,
  weight: number
): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`
    );
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    if (!url) return null;
    const fontRes = await fetch(url);
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

// All-or-nothing: registering only one custom font would make satori render
// every text in it, so fall back to the default face unless both load.
async function loadFonts() {
  const [logo, sans] = await Promise.all([
    fetchGoogleFont("Pacifico", 400),
    fetchGoogleFont("Instrument Sans", 500),
  ]);
  if (!logo || !sans) return null;
  return [
    { name: "Pacifico", data: logo, style: "normal" as const, weight: 400 as const },
    { name: "Instrument Sans", data: sans, style: "normal" as const, weight: 500 as const },
  ];
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : defaultLocale);
  const fonts = await loadFonts();
  const sansFamily = fonts ? "Instrument Sans" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#2a4234",
          padding: "64px 80px",
          color: "#faf9f5",
          fontFamily: sansFamily,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              lineHeight: 1,
              fontFamily: fonts ? "Pacifico" : undefined,
            }}
          >
            Calm
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              marginTop: 10,
              color: "#c9d4c5",
            }}
          >
            Investments
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 58,
            lineHeight: 1.15,
            maxWidth: 950,
            fontWeight: 600,
          }}
        >
          {dict.hero.title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 24, color: "#c9d4c5" }}>
            {dict.hero.label}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#c9d4c5" }}>
            Rotterdam
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts ?? undefined }
  );
}
