import type { Locale, Dictionary } from "@/lib/i18n";
import Hero, { type HeroVariant } from "./Hero";
import About from "./About";
import Approach from "./Approach";
import PortfolioSection from "./PortfolioSection";
import Focus from "./Focus";
import Team from "./Team";
import ContactSection from "./ContactSection";

export default function HomePage({
  lang,
  dict,
  heroVariant,
}: {
  lang: Locale;
  dict: Dictionary;
  heroVariant?: HeroVariant;
}) {
  return (
    <>
      <Hero lang={lang} dict={dict} variant={heroVariant} />
      <About dict={dict} />
      <Approach dict={dict} />
      <PortfolioSection lang={lang} dict={dict} />
      <Focus dict={dict} />
      <Team dict={dict} />
      <ContactSection lang={lang} dict={dict} />
    </>
  );
}
