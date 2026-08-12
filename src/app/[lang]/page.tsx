import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Approach from "@/components/Approach";
import PortfolioSection from "@/components/PortfolioSection";
import Focus from "@/components/Focus";
import Team from "@/components/Team";
import ContactSection from "@/components/ContactSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <Hero lang={lang} dict={dict} />
      <About dict={dict} />
      <Approach dict={dict} />
      <PortfolioSection lang={lang} dict={dict} />
      <Focus dict={dict} />
      <Team dict={dict} />
      <ContactSection lang={lang} dict={dict} />
    </>
  );
}
