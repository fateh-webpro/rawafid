import { SITE_URL, localeUrl } from "@/lib/seo";
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
  const name = isAr ? "روافد سبأ المحدودة" : "Rawafid Saba Co. Ltd.";
  const socials = activeSocials(settings).map((s) => s.url);

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name,
    url: localeUrl(locale, ""),
    telephone: settings["contact.phone"],
    ...(settings["contact.email"] ? { email: settings["contact.email"] } : {}),
    image: `${SITE_URL}/images/equipment/hero.jpg`,
    description: isAr
      ? "تأجير المعدات الثقيلة ومعدات الرفع والمناولة وحلول دعم المشاريع في الرياض والمملكة العربية السعودية."
      : "Heavy equipment rental, lifting and handling equipment, and project support solutions in Riyadh, Saudi Arabia.",
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
