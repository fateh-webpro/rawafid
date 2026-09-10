import {
  absoluteUrl,
  getDefaultOgImagePath,
  getSiteDescription,
  getSiteName,
  SITE_URL,
  localeUrl,
} from "@/lib/seo";
import { activeSocials, type Settings } from "@/lib/settings";

type BreadcrumbItem = {
  name: string;
  path: string;
};

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * بيانات منظمة (JSON-LD) للنشاط المحلي.
 */
export function JsonLd({
  locale,
  settings,
}: {
  locale: string;
  settings: Settings;
}) {
  const isAr = locale === "ar";
  const name = getSiteName(locale);
  const socials = activeSocials(settings).map((s) => s.url);

  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name,
    url: localeUrl(locale, ""),
    telephone: settings["contact.phone"],
    ...(settings["contact.email"] ? { email: settings["contact.email"] } : {}),
    image: absoluteUrl(getDefaultOgImagePath(locale)),
    logo: absoluteUrl("/icon.png"),
    description: getSiteDescription(locale),
    address: {
      "@type": "PostalAddress",
      addressLocality: isAr ? "الرياض" : "Riyadh",
      addressCountry: "SA",
    },
    areaServed: {
      "@type": "Country",
      name: isAr ? "المملكة العربية السعودية" : "Saudi Arabia",
    },
    ...(socials.length ? { sameAs: socials } : {}),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name,
    inLanguage: isAr ? "ar-SA" : "en",
    publisher: { "@id": `${SITE_URL}/#business` },
  };

  return (
    <>
      <JsonLdScript data={business} />
      <JsonLdScript data={website} />
    </>
  );
}

export function BreadcrumbJsonLd({
  locale,
  items,
}: {
  locale: string;
  items: BreadcrumbItem[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${localeUrl(locale, items.at(-1)?.path || "")}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "ar" ? "الرئيسية" : "Home",
        item: localeUrl(locale, ""),
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: localeUrl(locale, item.path),
      })),
    ],
  };

  return <JsonLdScript data={data} />;
}

export function BlogPostingJsonLd({
  locale,
  slug,
  headline,
  description,
  image,
  datePublished,
  dateModified,
}: {
  locale: string;
  slug: string;
  headline: string;
  description: string;
  image?: string | null;
  datePublished: Date;
  dateModified: Date;
}) {
  const url = localeUrl(locale, `/blog/${slug}`);
  const publisherName = getSiteName(locale);
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline,
    description,
    ...(image ? { image: absoluteUrl(image) } : {}),
    datePublished: datePublished.toISOString(),
    dateModified: dateModified.toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: locale === "ar" ? "ar-SA" : "en",
    publisher: {
      "@id": `${SITE_URL}/#business`,
      "@type": "LocalBusiness",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.png"),
      },
    },
  };

  return <JsonLdScript data={data} />;
}
