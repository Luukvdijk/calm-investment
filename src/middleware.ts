import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales } from "./lib/i18n";
import { pickLocale, LOCALE_COOKIE } from "./lib/locale";
import { magGeindexeerd, NOINDEX_HEADER } from "./lib/indexing";

/** Previewomgevingen uit de zoekresultaten houden; alleen het echte domein mag erin. */
function metIndexering(response: NextResponse, request: NextRequest): NextResponse {
  if (!magGeindexeerd(request.headers.get("host"))) {
    response.headers.set("X-Robots-Tag", NOINDEX_HEADER);
  }
  return response;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return metIndexering(NextResponse.next(), request);
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = pickLocale(
      request.headers.get("accept-language"),
      request.cookies.get(LOCALE_COOKIE)?.value
    );
    return metIndexering(
      NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url)),
      request
    );
  }

  return metIndexering(NextResponse.next(), request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|images|sitemap.xml|robots.txt).*)",
  ],
};
