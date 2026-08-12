import Link from "next/link";
import type { Locale, Dictionary } from "@/lib/i18n";
import { getFeaturedItems } from "@/lib/portfolio";
import PortfolioCard from "./PortfolioCard";
import Reveal from "./Reveal";

export default function PortfolioSection({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const items = getFeaturedItems();

  return (
    <section className="grain relative bg-pine-deep text-cream">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 lg:px-8">
        <Reveal className="text-center">
          <h2 className="display text-4xl sm:text-5xl">{dict.portfolio.title}</h2>
          <p className="mt-4 text-sm text-cream/70">{dict.portfolio.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 120}>
              <PortfolioCard item={item} lang={lang} dict={dict} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Link
            href={`/${lang}/portfolio`}
            className="label inline-block border border-cream/40 px-7 py-3.5 text-cream transition-colors hover:bg-cream hover:text-pine-deep"
          >
            {dict.portfolio.viewAll}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
