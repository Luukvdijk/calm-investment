"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import {
  readConsent,
  writeConsent,
  loadGoogleAnalytics,
  type ConsentValue,
} from "@/lib/consent";

export const OPEN_COOKIE_SETTINGS_EVENT = "open-cookie-settings";

export default function CookieConsent({
  lang,
  dict,
}: {
  lang: string;
  dict: Dictionary;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!gaId) return;
    if (readConsent() === "granted") {
      loadGoogleAnalytics(gaId);
    }

    // Deferred so the banner appears after hydration, not during it.
    const timer = setTimeout(() => {
      if (readConsent() === null) setVisible(true);
    }, 0);

    const reopen = () => setVisible(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    };
  }, [gaId]);

  if (!gaId || !visible) return null;

  function choose(value: ConsentValue) {
    writeConsent(value);
    setVisible(false);
    if (value === "granted" && gaId) loadGoogleAnalytics(gaId);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={dict.cookieBanner.settings}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-cream/20 bg-pine-deep text-cream"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p className="max-w-2xl text-sm leading-relaxed text-cream/90">
          {dict.cookieBanner.text}{" "}
          <Link
            href={`/${lang}/privacy`}
            className="underline underline-offset-2 transition-colors hover:text-cream"
          >
            {dict.cookieBanner.more}
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="label border border-cream/40 px-5 py-3 text-cream transition-colors hover:bg-cream/10"
          >
            {dict.cookieBanner.reject}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="label bg-cream px-5 py-3 text-pine-deep transition-colors hover:bg-white"
          >
            {dict.cookieBanner.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
