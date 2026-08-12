import { Handshake, BarChart3, TrendingUp, Wallet } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import Reveal from "./Reveal";

const icons = [Handshake, BarChart3, TrendingUp, Wallet];

export default function Approach({ dict }: { dict: Dictionary }) {
  return (
    <section id="aanpak" className="scroll-mt-20 bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 lg:px-8">
        <Reveal>
          <p className="label text-pine">{dict.approach.label}</p>
          <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
            {dict.approach.title}
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            {dict.approach.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-16 gap-y-14 sm:grid-cols-2">
          {dict.approach.pillars.map((pillar, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal
                key={pillar.title}
                delay={(i % 2) * 120}
                className={i % 2 === 1 ? "sm:mt-16" : ""}
              >
                <div className="rule mb-6" />
                <Icon aria-hidden className="h-6 w-6 text-pine" strokeWidth={1.5} />
                <h3 className="display mt-4 text-2xl text-ink">{pillar.title}</h3>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                  {pillar.text}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
