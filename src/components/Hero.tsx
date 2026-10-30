/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import Reveal from "./Reveal";

export type HeroVariant = "half" | "vol";

/** De tekstkolom, identiek in beide varianten op de kleurstelling na. */
function HeroText({
  lang,
  dict,
  onDark,
}: {
  lang: string;
  dict: Dictionary;
  onDark: boolean;
}) {
  return (
    <>
      <p className={`label mb-6 ${onDark ? "text-cream/70" : "text-pine"}`}>
        {dict.hero.label}
      </p>
      <h1
        className={`display text-5xl sm:text-6xl lg:text-7xl ${
          onDark ? "text-cream" : "text-ink"
        }`}
      >
        {dict.hero.title}
      </h1>
      <p
        className={`mt-7 max-w-xl text-[15px] leading-relaxed ${
          onDark ? "text-cream/80" : "text-ink-soft"
        }`}
      >
        {dict.hero.subtitle}
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Link
          href={`/${lang}#contact`}
          className={`label inline-block px-7 py-4 transition-colors ${
            onDark
              ? "bg-cream text-pine-deep hover:bg-white"
              : "bg-pine text-cream hover:bg-pine-deep"
          }`}
        >
          {dict.hero.ctaPrimary}
        </Link>
        <Link
          href={`/${lang}#over`}
          className={`label group inline-flex items-center gap-2 transition-colors ${
            onDark ? "text-cream hover:text-white" : "text-ink hover:text-pine"
          }`}
        >
          {dict.hero.ctaSecondary}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </Link>
      </div>
    </>
  );
}

export default function Hero({
  lang,
  dict,
  variant = "half",
}: {
  lang: string;
  dict: Dictionary;
  variant?: HeroVariant;
}) {
  if (variant === "vol") {
    return (
      <section className="relative isolate flex min-h-[78vh] items-end overflow-hidden">
        <div className="photo-warm absolute inset-0 -z-10">
          <img
            src="/images/hero-placeholder.jpg"
            alt={dict.hero.imageAlt}
            fetchPriority="high"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-pine-deep via-pine-deep/80 to-pine-deep/35"
        />
        <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-32 md:pb-28 lg:px-8">
          <Reveal>
            <HeroText lang={lang} dict={dict} onDark />
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <div className="grid items-stretch md:grid-cols-[1fr_0.92fr]">
        <div className="flex items-center px-6 py-20 md:py-28 lg:pl-[max(2rem,calc((100vw-72rem)/2))] lg:pr-14">
          <Reveal className="w-full">
            <HeroText lang={lang} dict={dict} onDark={false} />
          </Reveal>
        </div>
        <Reveal delay={150} className="relative">
          <div className="photo-warm relative h-64 w-full sm:h-80 md:h-full md:min-h-[32rem]">
            <img
              src="/images/hero-placeholder.jpg"
              alt={dict.hero.imageAlt}
              fetchPriority="high"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
