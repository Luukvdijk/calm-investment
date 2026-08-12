import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

interface LegalContent {
  title: string;
  updated: string;
  sections: { title: string; paragraphs: string[] }[];
}

export default function LegalPage({
  lang,
  dict,
  content,
}: {
  lang: string;
  dict: Dictionary;
  content: LegalContent;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 md:py-24 lg:px-8">
      <p className="label text-pine">Calm Investments</p>
      <h1 className="display mt-4 text-4xl text-ink sm:text-5xl">
        {content.title}
      </h1>
      <p className="mt-4 text-sm text-ink-soft">{content.updated}</p>

      <div className="mt-12 space-y-10">
        {content.sections.map((section) => (
          <section key={section.title}>
            <h2 className="display text-2xl text-ink">{section.title}</h2>
            <div className="mt-4 space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-[15px] leading-relaxed text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Link
        href={`/${lang}`}
        className="label group mt-14 inline-flex items-center gap-2 text-ink transition-colors hover:text-pine"
      >
        <ArrowLeft
          aria-hidden
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          strokeWidth={1.5}
        />
        {dict.errors.backHome}
      </Link>
    </div>
  );
}
