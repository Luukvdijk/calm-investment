"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE } from "@/lib/locale";

export default function LanguageToggle({ lang }: { lang: string }) {
  const pathname = usePathname() ?? `/${lang}`;
  const other = lang === "nl" ? "en" : "nl";
  const switched = pathname.replace(new RegExp(`^/${lang}`), `/${other}`);

  function rememberChoice() {
    document.cookie = `${LOCALE_COOKIE}=${other};path=/;max-age=31536000;samesite=lax`;
  }

  return (
    <Link
      href={switched}
      onClick={rememberChoice}
      className="label rounded-full border border-line px-3 py-1.5 text-ink-soft transition-colors hover:border-pine hover:text-pine"
      aria-label={other === "en" ? "Switch to English" : "Wissel naar Nederlands"}
    >
      {lang === "nl" ? "EN" : "NL"}
    </Link>
  );
}
