import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/lib/i18n";
import { siteUrl, languageAlternates } from "@/lib/site";
import { getPortfolioItems } from "@/lib/portfolio";
import PortfolioCard from "@/components/PortfolioCard";
import Reveal from "@/components/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: `${dict.portfolio.pageTitle} | Calm Investments`,
    description: dict.portfolio.pageIntro,
    alternates: {
      canonical: `${siteUrl}/${lang}/portfolio`,
      ...languageAlternates("/portfolio"),
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const items = getPortfolioItems();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:py-24 lg:px-8">
      <Reveal>
        <p className="label text-pine">{dict.portfolio.pageLabel}</p>
        <h1 className="display mt-4 text-4xl text-ink sm:text-5xl lg:text-6xl">
          {dict.portfolio.pageTitle}
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
          {dict.portfolio.pageIntro}
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={(i % 3) * 120}>
            <PortfolioCard item={item} lang={lang} dict={dict} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <Link
          href={`/${lang}`}
          className="label group inline-flex items-center gap-2 text-ink transition-colors hover:text-pine"
        >
          <ArrowLeft
            aria-hidden
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            strokeWidth={1.5}
          />
          {dict.portfolio.backHome}
        </Link>
      </Reveal>
    </div>
  );
}
