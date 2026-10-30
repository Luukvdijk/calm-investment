import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import HomePage from "@/components/HomePage";
import type { HeroVariant } from "@/components/Hero";

/**
 * Previewroutes om de twee headervarianten naast elkaar te kunnen beoordelen.
 * Zodra de keuze gemaakt is kan deze map weg en gaat de gekozen variant
 * rechtstreeks de homepage in.
 */
const VARIANTS: Record<string, { variant: HeroVariant; naam: string; ander: string }> = {
  vol: { variant: "vol", naam: "Variant A: volledige afbeelding", ander: "half" },
  half: { variant: "half", naam: "Variant B: halve afbeelding", ander: "vol" },
};

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    Object.keys(VARIANTS).map((v) => ({ lang, v }))
  );
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function VariantPage({
  params,
}: {
  params: Promise<{ lang: string; v: string }>;
}) {
  const { lang, v } = await params;
  const keuze = VARIANTS[v];
  if (!isLocale(lang) || !keuze) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <div className="bg-ink text-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-2.5 lg:px-8">
          <p className="label text-cream/70">{keuze.naam}</p>
          <Link
            href={`/${lang}/variant/${keuze.ander}`}
            className="label underline underline-offset-4 transition-colors hover:text-white"
          >
            {VARIANTS[keuze.ander].naam}
          </Link>
        </div>
      </div>
      <HomePage lang={lang} dict={dict} heroVariant={keuze.variant} />
    </>
  );
}
