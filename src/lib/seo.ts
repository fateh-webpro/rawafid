import type { Metadata } from "next";

const FALLBACK_SITE_URL = "https://rawafidequipment.com";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

const SITE_NAMES = {
  ar: "روافد سبأ للمعدات",
  en: "Rawafid Saba Equipment",
} as const;

const SITE_DESCRIPTIONS = {
  ar: "روافد سبأ للمعدات، شركة سعودية متخصصة في تأجير المعدات الثقيلة ومعدات الرفع والمناولة، بخدمات احترافية تغطي الرياض ومختلف مناطق المملكة.",
  en: "Rawafid Saba Equipment is a Saudi company specializing in heavy equipment, lifting equipment, and material handling rentals across Riyadh and the Kingdom.",
} as const;

function normalizeSiteUrl(raw?: string) {
  if (!raw) return FALLBACK_SITE_URL;

  try {
    const url = new URL(raw);
    if (LOCAL_HOSTS.has(url.hostname)) return FALLBACK_SITE_URL;
    return url.toString().replace(/\/$/, "");
  } catch {
    return FALLBACK_SITE_URL;
  }
}

/** رابط الموقع الأساسي — يُضبط عبر NEXT_PUBLIC_SITE_URL عند النشر، مع fallback آمن للإنتاج */
export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function getSiteName(locale: string) {
  return locale === "ar" ? SITE_NAMES.ar : SITE_NAMES.en;
}

export function getSiteDescription(locale: string) {
  return locale === "ar" ? SITE_DESCRIPTIONS.ar : SITE_DESCRIPTIONS.en;
}

export function absoluteUrl(value?: string | null) {
  if (!value) return SITE_URL;

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (LOCAL_HOSTS.has(url.hostname)) {
        return new URL(`${url.pathname}${url.search}${url.hash}`, SITE_URL).toString();
      }
      return url.toString();
    } catch {
      return SITE_URL;
    }
  }

  return new URL(value.startsWith("/") ? value : `/${value}`, SITE_URL).toString();
}

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
    siteName: getSiteName(locale),
    locale: locale === "ar" ? "ar_SA" : "en_US",
    alternateLocale: locale === "ar" ? ["en_US"] : ["ar_SA"],
    url: localeUrl(locale, path),
    title,
    description,
    images: [{ url: absoluteUrl(image || "/og-default.png"), width: 1200, height: 630 }],
  };
}

export function buildTwitterCard(
  title: string,
  description: string,
  image?: string
): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [absoluteUrl(image || "/og-default.png")],
  };
}