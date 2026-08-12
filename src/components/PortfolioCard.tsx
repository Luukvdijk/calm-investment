/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from "lucide-react";
import type { Locale, Dictionary } from "@/lib/i18n";
import type { PortfolioItem } from "@/lib/portfolio";

export default function PortfolioCard({
  item,
  lang,
  dict,
}: {
  item: PortfolioItem;
  lang: Locale;
  dict: Dictionary;
}) {
  const card = (
    <article className="group flex h-full flex-col bg-cream p-4 shadow-[0_1px_0_var(--color-line)] transition-transform duration-500 hover:-translate-y-1">
      <img
        src={item.image}
        alt={item.name}
        width={360}
        height={220}
        loading="lazy"
        className="img-quiet aspect-[8/5] w-full object-cover"
      />
      <h3 className="label mt-5 text-sm tracking-[0.12em] text-ink">
        {item.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        {item.summary[lang]}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags[lang].map((tag) => (
          <span
            key={tag}
            className="border border-line px-2.5 py-1 text-[11px] text-ink-soft"
          >
            {tag}
          </span>
        ))}
      </div>
      {item.website && (
        <p className="label mt-auto flex items-center gap-1.5 pt-5 text-pine">
          {dict.portfolio.viewItem}
          <ArrowUpRight
            aria-hidden
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </p>
      )}
    </article>
  );

  if (item.website) {
    return (
      <a
        href={item.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.name}: ${dict.portfolio.viewItem}`}
        className="block h-full"
      >
        {card}
      </a>
    );
  }
  return card;
}
