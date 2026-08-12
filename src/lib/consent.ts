export const CONSENT_COOKIE = "cookie_consent";
export type ConsentValue = "granted" | "denied";

export function readConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`)
  );
  return (match?.[1] as ConsentValue) ?? null;
}

export function writeConsent(value: ConsentValue) {
  document.cookie = `${CONSENT_COOKIE}=${value};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export const GA_SCRIPT_ID = "ga4-script";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Loads gtag.js and configures GA4. Only ever call this after consent. */
export function loadGoogleAnalytics(gaId: string) {
  if (document.getElementById(GA_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // GA requires the Arguments object itself, not a spread copy.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", gaId, { anonymize_ip: true });
}
