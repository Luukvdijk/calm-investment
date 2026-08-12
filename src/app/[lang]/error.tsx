"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { getDictionary, isLocale, defaultLocale } from "@/lib/i18n";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ lang?: string }>();
  const lang =
    params?.lang && isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = getDictionary(lang);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[55vh] max-w-6xl flex-col items-start justify-center px-6 py-20 lg:px-8">
      <p className="label text-pine">500</p>
      <h1 className="display mt-4 text-4xl text-ink sm:text-5xl">
        {dict.errors.errorTitle}
      </h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
        {dict.errors.errorText}
      </p>
      <button
        type="button"
        onClick={reset}
        className="label mt-10 inline-block bg-pine px-7 py-4 text-cream transition-colors hover:bg-pine-deep"
      >
        {dict.errors.retry}
      </button>
    </div>
  );
}
