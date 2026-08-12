# Calm Investments

Bilingual (NL/EN) marketing site for Calm Investments, a Rotterdam private equity firm focused on Dutch SMEs. Next.js 16, Tailwind v4, no CMS: all content lives in three JSON files.

## Editing content (no CMS)

All copy is in `content/`:

| File | What is in it |
|---|---|
| `content/nl.json` | All Dutch copy (every section, form labels, error messages) |
| `content/en.json` | All English copy, same structure as `nl.json` |
| `content/portfolio.json` | Portfolio companies, one list for both languages |

- **Change a text**: edit the value in both `nl.json` and `en.json`. Keys must stay identical in both files (a test guards this).
- **Add/remove a portfolio company**: add or delete an object in `content/portfolio.json` -> `items`. Set `"featured": true` on the (max 3) items that should show on the homepage. `tags` and `summary` each have an `nl` and `en` version.
- **Swap an image**: drop the file in `public/images/` and change the path in the JSON (`image` fields for portfolio and team; hero/section images are referenced in the components under `src/components/`).

After editing, run `npm test` to verify nothing is broken.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
npm test         # Vitest test suite
```

## Environment

Copy `.env.example` to `.env` and fill in:

- `RESEND_API_KEY` - Resend API key for the contact form
- `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` - delivery address and verified sender
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` - Cloudflare Turnstile spam protection. Leave empty locally to skip the captcha.

## Architecture

- `src/app/[lang]/` - locale-prefixed pages (`/nl`, `/en`, `/nl/portfolio`, `/nl/privacy`, `/nl/voorwaarden`, ...). Middleware redirects bare paths to a locale.
- **Language detection**: an explicit toggle choice is stored in a `NEXT_LOCALE` cookie and always wins. Otherwise the browser's `Accept-Language` decides: Dutch browsers get `/nl`, browsers preferring any other language get `/en`, and when nothing is known Dutch is the default. Logic in `src/lib/locale.ts`.
- **Legal pages**: privacy statement and terms live in the same locale JSON files under `legalPages` and render via `src/components/LegalPage.tsx`. The texts are templates; have a lawyer review before launch.
- `src/app/api/contact/route.ts` - contact form endpoint: validation, rate limiting, Turnstile verification, Resend email. Error messages are localized via the `lang` field in the request body.
- `src/lib/i18n.ts` - loads the JSON dictionaries, typed from `nl.json`.
- `src/components/` - page sections. `error.tsx` and `not-found.tsx` under `[lang]/` render localized error pages.
- `tests/` - Vitest: content parity, validation, API route (mocked Resend/Turnstile), form behaviour, language toggle.
