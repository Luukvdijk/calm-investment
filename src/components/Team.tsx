/* eslint-disable @next/next/no-img-element */
import type { Dictionary } from "@/lib/i18n";
import Reveal from "./Reveal";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export default function Team({ dict }: { dict: Dictionary }) {
  return (
    <section className="grain relative bg-pine text-cream">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 lg:px-8">
        <Reveal className="text-center">
          <h2 className="display text-4xl italic sm:text-5xl">{dict.team.title}</h2>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl gap-12 md:grid-cols-2">
          {dict.team.members.map((member, i) => (
            <Reveal key={member.name} delay={i * 120}>
              <img
                src={member.image}
                alt={member.imageAlt}
                width={320}
                height={380}
                loading="lazy"
                className="img-quiet mx-auto aspect-[5/6] w-full max-w-[320px] object-cover"
              />
              <div className="mt-6 flex items-center justify-center gap-3">
                <h3 className="display text-2xl">{member.name}</h3>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn: ${member.name}`}
                  className="text-cream/60 transition-colors hover:text-cream"
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
              </div>
              <p className="label mt-2 text-center text-cream/60">{member.role}</p>
              <p className="mt-5 text-sm leading-relaxed text-cream/80">
                {member.bio}
              </p>
              <p className="mt-3 text-sm italic leading-relaxed text-cream/60">
                {member.personality}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
