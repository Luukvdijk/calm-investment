import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import HomePage from "@/components/HomePage";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <HomePage lang={lang} dict={getDictionary(lang)} />;
}
