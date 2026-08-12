import { ImageResponse } from "next/og";
import { getDictionary, isLocale, locales, defaultLocale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Calm Investments";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : defaultLocale);

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
          padding: "72px 80px",
          color: "#faf9f5",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#c9d4c5",
          }}
        >
          Calm Investments
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            lineHeight: 1.1,
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
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 10,
            backgroundColor: "#faf9f5",
            display: "flex",
          }}
        />
      </div>
    ),
    size
  );
}
