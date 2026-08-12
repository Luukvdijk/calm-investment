"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getDictionary, isLocale, defaultLocale } from "@/lib/i18n";

export default function NotFound() {
  const params = useParams<{ lang?: string }>();
  const lang =
    params?.lang && isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = getDictionary(lang);

  return (
    <div className="mx-auto flex min-h-[55vh] max-w-6xl flex-col items-start justify-center px-6 py-20 lg:px-8">
      <p className="label text-pine">404</p>
      <h1 className="display mt-4 text-4xl text-ink sm:text-5xl">
        {dict.errors.notFoundTitle}
      </h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
        {dict.errors.notFoundText}
      </p>
      <Link
        href={`/${lang}`}
        className="label mt-10 inline-block bg-pine px-7 py-4 text-cream transition-colors hover:bg-pine-deep"
      >
        {dict.errors.backHome}
      </Link>
    </div>
  );
}
