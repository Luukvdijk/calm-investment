"use client";

import { OPEN_COOKIE_SETTINGS_EVENT } from "./CookieConsent";

export default function CookieSettingsLink({ label }: { label: string }) {
  if (!process.env.NEXT_PUBLIC_GA_ID) return null;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      className="text-sm text-cream/80 transition-colors hover:text-cream"
    >
      {label}
    </button>
  );
}
