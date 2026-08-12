/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import Reveal from "./Reveal";

export default function Hero({ lang, dict }: { lang: string; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[1.15fr_1fr] md:py-28 lg:px-8">
        <Reveal>
          <p className="label mb-6 text-pine">{dict.hero.label}</p>
          <h1 className="display text-5xl text-ink sm:text-6xl lg:text-7xl">
            {dict.hero.title}
          </h1>
          <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            {dict.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href={`/${lang}#contact`}
              className="label inline-block bg-pine px-7 py-4 text-cream transition-colors hover:bg-pine-deep"
            >
              {dict.hero.ctaPrimary}
            </Link>
            <Link
              href={`/${lang}#over`}
              className="label group inline-flex items-center gap-2 text-ink transition-colors hover:text-pine"
            >
              {dict.hero.ctaSecondary}
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={150} className="justify-self-end">
          <div className="relative">
            <div className="absolute -inset-3 border border-line" aria-hidden />
            <img
              src="/images/hero-building.svg"
              alt={dict.hero.imageAlt}
              width={480}
              height={480}
              className="img-quiet relative aspect-square w-full max-w-[480px] object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
