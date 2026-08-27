"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import LanguageToggle from "./LanguageToggle";
import Logo from "./Logo";

export default function Nav({ lang, dict }: { lang: string; dict: Dictionary }) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: dict.nav.about, href: `/${lang}#over` },
    { label: dict.nav.approach, href: `/${lang}#aanpak` },
    { label: dict.nav.portfolio, href: `/${lang}/portfolio` },
    { label: dict.nav.contact, href: `/${lang}#contact` },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href={`/${lang}`}
          aria-label="Calm Investments"
          onClick={() => setOpen(false)}
        >
          <Logo tone="dark" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="label text-ink-soft transition-colors hover:text-pine"
            >
              {link.label}
            </Link>
          ))}
          <LanguageToggle lang={lang} />
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <LanguageToggle lang={lang} />
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`h-px w-5 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-5 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-line bg-paper px-6 py-6 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="label text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
