import nl from "@content/nl.json";
import en from "@content/en.json";

export const locales = ["nl", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "nl";

export type Dictionary = typeof nl;

const dictionaries: Record<Locale, Dictionary> = { nl, en };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
