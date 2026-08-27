import { readFile } from "fs/promises";
import path from "path";
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

export default async function OgImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : defaultLocale);

  // Official cream wordmark, embedded as a data URI.
  const logoData = await readFile(
    path.join(process.cwd(), "public", "images", "logo-cream.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  const sans = await fetchGoogleFont("Instrument Sans", 500);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0e3a1e",
          padding: "64px 80px",
          color: "#faf9f5",
          fontFamily: sans ? "Instrument Sans" : undefined,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={220} height={115} alt="" />
        <div
          style={{
            display: "flex",
            fontSize: 58,
            lineHeight: 1.15,
            maxWidth: 950,
            fontWeight: 500,
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
    {
      ...size,
      fonts: sans
        ? [{ name: "Instrument Sans", data: sans, style: "normal" as const, weight: 500 as const }]
        : undefined,
    }
  );
}
