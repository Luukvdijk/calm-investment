import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales } from "./lib/i18n";
import { pickLocale, LOCALE_COOKIE } from "./lib/locale";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = pickLocale(
      request.headers.get("accept-language"),
      request.cookies.get(LOCALE_COOKIE)?.value
    );
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|images|sitemap.xml|robots.txt).*)",
  ],
};
