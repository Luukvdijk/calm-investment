# CLAUDE.md

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
npm test         # Vitest (run once)
npm run test:watch
```

## Architecture

**Next.js 16 App Router**, TypeScript, Tailwind CSS v4. Bilingual (nl/en) brochure site for a private equity firm. No CMS: all content is in JSON.

- `content/nl.json` + `content/en.json` - all copy, mirrored structure (parity enforced by `tests/i18n-parity.test.ts` and by the `Record<Locale, Dictionary>` type in `src/lib/i18n.ts`).
- `content/portfolio.json` - portfolio companies with per-language `tags`/`summary` inline; `featured: true` items (max 3) appear on the homepage.
- `src/app/[lang]/` - locale-prefixed routes; `src/middleware.ts` redirects bare paths using `pickLocale` in `src/lib/locale.ts`: `NEXT_LOCALE` cookie (set by LanguageToggle) > Accept-Language (nl -> nl, other known language -> en) > nl default. `[...notfound]` catch-all + `not-found.tsx` + `error.tsx` give localized 404/500 pages.
- `/[lang]/privacy` + `/[lang]/voorwaarden` - legal pages rendered from `legalPages` in the locale JSONs via `LegalPage.tsx` (noindex).
- `src/app/api/contact/route.ts` - Resend email + Cloudflare Turnstile + in-memory rate limit. Localized errors based on `lang` in the body; shared validation in `src/lib/contact-validation.ts` (used by both client form and API).
- Path aliases: `@/*` -> `src/*`, `@content/*` -> `content/*` (both in tsconfig and vitest.config).

## Conventions

- Design tokens in `globals.css` `@theme` block (paper/cream/pine palette, Cormorant Garamond display + Instrument Sans).
- Turnstile is skipped when `TURNSTILE_SECRET_KEY` (server) / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (client) are unset, so local dev works without keys.
- No em-dashes in copy or code comments.
