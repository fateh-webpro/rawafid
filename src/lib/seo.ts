import type { Metadata } from "next";

/** رابط الموقع الأساسي — يُضبط عبر NEXT_PUBLIC_SITE_URL عند النشر */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://rawafidsaba.com"
).replace(/\/$/, "");

/** رابط مطلق لمسار حسب اللغة (العربية بلا بادئة، الإنجليزية تحت /en) */
export function localeUrl(locale: string, path = ""): string {
  const p = path === "/" ? "" : path;
  return locale === "ar" ? `${SITE_URL}${p}` : `${SITE_URL}/en${p}`;
}

/** canonical ذاتي + بدائل اللغات (hreflang) لصفحة معيّنة */
export function buildAlternates(
  locale: string,
  path = ""
): Metadata["alternates"] {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      ar: localeUrl("ar", path),
      en: localeUrl("en", path),
      "x-default": localeUrl("ar", path),
    },
  };
}

/** كائن Open Graph أساسي لصفحة */
export function buildOpenGraph(
  locale: string,
  path: string,
  title: string,
  description: string,
  image?: string
): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: locale === "ar" ? "روافد سبأ المحدودة" : "Rawafid Saba Co. Ltd.",
    locale: locale === "ar" ? "ar_SA" : "en_US",
    url: localeUrl(locale, path),
    title,
    description,
    images: [{ url: image || "/images/equipment/hero.jpg", width: 1200, height: 630 }],
  };
}
