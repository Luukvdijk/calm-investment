import type { Metadata } from "next";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { siteUrl, languageAlternates } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    icons: { icon: "/images/favicon.svg" },
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      ...languageAlternates(""),
    },
    openGraph: {
      type: "website",
      siteName: "Calm Investments",
      title: dict.meta.title,
      description: dict.meta.description,
      url: `${siteUrl}/${lang}`,
      locale: lang === "nl" ? "nl_NL" : "en_US",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang as Locale);

  return (
    <html lang={lang} className={`${cormorant.variable} ${instrument.variable}`}>
      <body>
        <Nav lang={lang} dict={dict} />
        <main>{children}</main>
        <Footer lang={lang} dict={dict} />
        <CookieConsent lang={lang} dict={dict} />
      </body>
    </html>
  );
}
