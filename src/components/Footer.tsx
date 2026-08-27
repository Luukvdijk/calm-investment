import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import CookieSettingsLink from "./CookieSettingsLink";
import Logo from "./Logo";

export default function Footer({ lang, dict }: { lang: string; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const navLinks = [
    { label: dict.nav.about, href: `/${lang}#over` },
    { label: dict.nav.approach, href: `/${lang}#aanpak` },
    { label: dict.nav.portfolio, href: `/${lang}/portfolio` },
  ];

  return (
    <footer className="grain relative bg-pine-deep text-cream">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo tone="light" size="lg" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/60">
              {dict.footer.description}
            </p>
          </div>
          <nav aria-label={dict.footer.navigateLabel}>
            <p className="label text-cream/50">{dict.footer.navigateLabel}</p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/80 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={dict.footer.legalLabel}>
            <p className="label text-cream/50">{dict.footer.legalLabel}</p>
            <ul className="mt-5 space-y-3">
              {dict.footer.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href.startsWith("/") ? `/${lang}${link.href}` : link.href}
                    className="text-sm text-cream/80 transition-colors hover:text-cream"
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <CookieSettingsLink label={dict.cookieBanner.settings} />
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/15 pt-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {dict.footer.copyright}
          </p>
          <p className="display text-sm italic text-cream/60">
            {dict.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
