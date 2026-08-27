import type { Locale, Dictionary } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

export default function JsonLd({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Calm Investments",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description: dict.meta.description,
    foundingDate: "2021",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Blaak 34",
      postalCode: "3011 TA",
      addressLocality: "Rotterdam",
      addressCountry: "NL",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: dict.contact.email,
      telephone: "+31612338883",
      contactType: "customer service",
      availableLanguage: ["nl", "en"],
    },
    founder: [
      { "@type": "Person", name: "Olav van Caldenborgh" },
      { "@type": "Person", name: "Jonathan van der Helm" },
    ],
    sameAs: ["https://www.linkedin.com/company/80161694/"],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Calm Investments",
    inLanguage: lang,
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
