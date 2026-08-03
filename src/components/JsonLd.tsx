import { absoluteUrl, getSiteDescription, getSiteName, SITE_URL, localeUrl } from "@/lib/seo";
import { activeSocials, type Settings } from "@/lib/settings";

/**
 * بيانات منظّمة (JSON-LD) للنشاط المحلي — تساعد جوجل على فهم الشركة
 * وإظهارها في نتائج البحث المحلية.
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

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name,
    url: localeUrl(locale, ""),
    telephone: settings["contact.phone"],
    ...(settings["contact.email"] ? { email: settings["contact.email"] } : {}),
    image: absoluteUrl("/og-default.png"),
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
    priceRange: "$$",
    ...(socials.length ? { sameAs: socials } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
