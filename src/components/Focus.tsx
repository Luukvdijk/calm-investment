/* eslint-disable @next/next/no-img-element */
import { Check } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import Reveal from "./Reveal";

export default function Focus({ dict }: { dict: Dictionary }) {
  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28 lg:px-8">
        <Reveal>
          <p className="label text-pine">{dict.focus.label}</p>
          <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
            {dict.focus.title}
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
            {dict.focus.intro}
          </p>
          <ul className="mt-8">
            {dict.focus.areas.map((area, i) => (
              <li key={area} className="group">
                <div className="flex items-baseline gap-5 border-b border-line py-4 transition-colors group-hover:border-pine">
                  <span className="label text-ink-soft/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="display text-2xl text-ink transition-transform duration-300 group-hover:translate-x-2">
                    {area}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={150}>
          <div className="relative mb-10">
            <div
              className="absolute -bottom-4 -right-4 h-full w-full bg-pine/10"
              aria-hidden
            />
            <img
              src="/images/focus-laptop.svg"
              alt={dict.focus.imageAlt}
              width={480}
              height={280}
              className="img-quiet relative aspect-[12/7] w-full object-cover"
            />
          </div>
          <h3 className="label text-pine">{dict.focus.criteriaTitle}</h3>
          <ul className="mt-5 space-y-3">
            {dict.focus.criteria.map((criterion) => (
              <li key={criterion} className="flex items-start gap-3">
                <Check
                  aria-hidden
                  className="mt-0.5 h-4 w-4 shrink-0 text-pine"
                  strokeWidth={2}
                />
                <span className="text-[15px] leading-relaxed text-ink-soft">
                  {criterion}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
