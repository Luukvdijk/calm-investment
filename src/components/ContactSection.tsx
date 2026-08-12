import { MapPin, Phone, Mail } from "lucide-react";
import type { Locale, Dictionary } from "@/lib/i18n";
import ContactForm from "./ContactForm";
import Reveal from "./Reveal";

export default function ContactSection({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const phoneHref = `tel:${dict.contact.phone.replace(/[^+\d]/g, "")}`;

  return (
    <section id="contact" className="scroll-mt-20 bg-paper">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-2 md:py-28 lg:px-8">
        <Reveal>
          <h2 className="display text-4xl text-ink sm:text-5xl">
            {dict.contact.title}
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
            {dict.contact.text}
          </p>
          <address className="mt-10 space-y-4 not-italic">
            <p className="flex items-start gap-3 text-sm text-ink-soft">
              <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-pine" strokeWidth={1.5} />
              <span>
                {dict.contact.addressLabel}
                <br />
                {dict.contact.address}
              </span>
            </p>
            <p className="flex items-center gap-3 text-sm text-ink-soft">
              <Phone aria-hidden className="h-4 w-4 shrink-0 text-pine" strokeWidth={1.5} />
              <a href={phoneHref} className="transition-colors hover:text-pine">
                {dict.contact.phone}
              </a>
            </p>
            <p className="flex items-center gap-3 text-sm text-ink-soft">
              <Mail aria-hidden className="h-4 w-4 shrink-0 text-pine" strokeWidth={1.5} />
              <a
                href={`mailto:${dict.contact.email}`}
                className="transition-colors hover:text-pine"
              >
                {dict.contact.email}
              </a>
            </p>
          </address>
        </Reveal>
        <Reveal delay={150}>
          <ContactForm lang={lang} dict={dict} />
        </Reveal>
      </div>
    </section>
  );
}
