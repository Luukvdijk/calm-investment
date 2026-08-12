/* eslint-disable @next/next/no-img-element */
import type { Dictionary } from "@/lib/i18n";
import Reveal from "./Reveal";

export default function About({ dict }: { dict: Dictionary }) {
  return (
    <section id="over" className="grain relative scroll-mt-20 bg-pine text-cream">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <Reveal>
            <h2 className="display text-4xl sm:text-5xl">{dict.about.title}</h2>
            <div className="mt-8 max-w-xl space-y-5 text-[15px] leading-relaxed text-cream/80">
              {dict.about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150}>
            <img
              src="/images/about-screen.svg"
              alt={dict.about.imageAlt}
              width={440}
              height={330}
              loading="lazy"
              className="img-quiet aspect-[4/3] w-full object-cover"
            />
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <div className="grid grid-cols-2 gap-8 border-t border-cream/20 pt-10 sm:max-w-md">
            {dict.about.stats.map((stat) => (
              <div key={stat.label} className="border-l border-cream/20 pl-6">
                <p className="display text-5xl">{stat.value}</p>
                <p className="label mt-3 text-cream/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
