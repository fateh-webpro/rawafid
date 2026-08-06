import type { Metadata } from "next";

const FALLBACK_SITE_URL = "https://rawafidequipment.com";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);
const DEFAULT_OG_IMAGES = {
  ar: "/og-ar-v2.png",
  en: "/og-en-v2.png",
} as const;

const OG_IMAGE_DIMENSIONS = {
  "/og-ar-v2.png": { width: 896, height: 896 },
  "/og-en-v2.png": { width: 896, height: 896 },
  "/og-default.png": { width: 1200, height: 630 },
} as const;

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

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function getSiteName(locale: string) {
  return locale === "ar" ? SITE_NAMES.ar : SITE_NAMES.en;
}

export function getSiteDescription(locale: string) {
  return locale === "ar" ? SITE_DESCRIPTIONS.ar : SITE_DESCRIPTIONS.en;
}

export function getDefaultOgImagePath(locale: string) {
  return locale === "ar" ? DEFAULT_OG_IMAGES.ar : DEFAULT_OG_IMAGES.en;
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

export function localeUrl(locale: string, path = ""): string {
  const p = path === "/" ? "" : path;

  if (locale === "ar") {
    return p ? `${SITE_URL}${p}` : `${SITE_URL}/`;
  }

  return p ? `${SITE_URL}/en${p}` : `${SITE_URL}/en`;
}

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

function inferImageType(imageUrl: string) {
  const pathname = new URL(imageUrl).pathname.toLowerCase();

  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
  if (pathname.endsWith(".webp")) return "image/webp";
  return undefined;
}

function getOgImageDimensions(imageUrl: string) {
  const pathname = new URL(imageUrl).pathname.toLowerCase() as keyof typeof OG_IMAGE_DIMENSIONS;
  return OG_IMAGE_DIMENSIONS[pathname];
}

export function buildOpenGraph(
  locale: string,
  path: string,
  title: string,
  description: string,
  image?: string
): Metadata["openGraph"] {
  const imageUrl = absoluteUrl(image || getDefaultOgImagePath(locale));
  const imageType = inferImageType(imageUrl);
  const imageDimensions = getOgImageDimensions(imageUrl);

  return {
    type: "website",
    siteName: getSiteName(locale),
    locale: locale === "ar" ? "ar_SA" : "en_US",
    alternateLocale: locale === "ar" ? ["en_US"] : ["ar_SA"],
    url: localeUrl(locale, path),
    title,
    description,
    images: [
      {
        url: imageUrl,
        secureUrl: imageUrl,
        ...(imageDimensions || {}),
        ...(imageType ? { type: imageType } : {}),
        alt: title,
      },
    ],
  };
}

export function buildTwitterCard(
  locale: string,
  title: string,
  description: string,
  image?: string
): Metadata["twitter"] {
  const imageUrl = absoluteUrl(image || getDefaultOgImagePath(locale));

  return {
    card: "summary_large_image",
    title,
    description,
    images: [imageUrl],
  };
}