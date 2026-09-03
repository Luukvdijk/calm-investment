"use client";

/**
 * Last-resort fallback: shown when the root layout itself crashes, so it
 * must render its own <html>/<body> and cannot rely on globals.css or the
 * dictionaries being available. Language is derived from the URL.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isEnglish =
    typeof window !== "undefined" && window.location.pathname.startsWith("/en");

  const t = isEnglish
    ? {
        title: "Something went wrong",
        text: "An unexpected error occurred. Please try again.",
        retry: "Try again",
      }
    : {
        title: "Er ging iets mis",
        text: "Er is een onverwachte fout opgetreden. Probeer het opnieuw.",
        retry: "Opnieuw proberen",
      };

  return (
    <html lang={isEnglish ? "en" : "nl"}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 24px",
          background: "#f2f1ea",
          color: "#20261f",
          fontFamily: "Georgia, serif",
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#145029",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Calm Investments
        </p>
        <h1 style={{ fontSize: 40, margin: "12px 0 0", fontWeight: 500 }}>
          {t.title}
        </h1>
        <p
          style={{
            margin: "16px 0 0",
            maxWidth: 420,
            fontSize: 15,
            lineHeight: 1.6,
            color: "#4c544b",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {t.text}
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 32,
            background: "#145029",
            color: "#faf9f5",
            border: "none",
            padding: "16px 28px",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {t.retry}
        </button>
      </body>
    </html>
  );
}
