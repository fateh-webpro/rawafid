import { Phone, MapPin, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getSettings, activeSocials } from "@/lib/settings";
import { SocialLinks } from "@/components/layout/SocialLinks";

function WhatsAppGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
    </svg>
  );
}

export async function ContactMethods({ locale }: { locale: string }) {
  const t = await getTranslations("contactPage");
  const s = await getSettings();
  const phone = s["contact.phone"];
  const phoneDisplay = s["contact.phoneDisplay"];
  const whatsapp = s["contact.whatsapp"];
  const email = s["contact.email"];
  const socials = activeSocials(s);

  const waMsg =
    locale === "ar"
      ? "مرحباً، أرغب بطلب عرض سعر لتأجير معدات."
      : "Hello, I would like to request an equipment rental quote.";
  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(waMsg)}`;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[0.8rem] font-medium tracking-[0.18em] text-gold">
        {t("directTitle")}
      </p>

      {/* واتساب — الأولوية الأولى */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 rounded-xl border border-[#1faa53]/30 bg-[#1faa53]/[0.06] p-5 transition-colors hover:bg-[#1faa53]/[0.12]"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1faa53] text-white">
          <WhatsAppGlyph />
        </span>
        <span className="min-w-0">
          <span className="block font-heading font-bold text-navy">
            {t("whatsappTitle")}
          </span>
          <span className="block text-sm text-gray">{t("whatsappDesc")}</span>
          <span dir="ltr" className="latin-nums mt-0.5 block text-sm font-medium text-navy-80">
            {phoneDisplay}
          </span>
        </span>
      </a>

      {/* اتصال هاتفي */}
      <a
        href={`tel:${phone}`}
        className="group flex items-center gap-4 rounded-xl border border-navy-20/60 bg-white p-5 transition-colors hover:border-gold"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
          <Phone size={21} />
        </span>
        <span className="min-w-0">
          <span className="block font-heading font-bold text-navy">{t("callTitle")}</span>
          <span className="block text-sm text-gray">{t("callDesc")}</span>
          <span dir="ltr" className="latin-nums mt-0.5 block text-sm font-medium text-navy-80">
            {phoneDisplay}
          </span>
        </span>
      </a>

      {/* البريد */}
      {email ? (
        <a
          href={`mailto:${email}`}
          className="group flex items-center gap-4 rounded-xl border border-navy-20/60 bg-white p-5 transition-colors hover:border-gold"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
            <Mail size={21} />
          </span>
          <span className="min-w-0">
            <span className="block font-heading font-bold text-navy">{t("emailTitle")}</span>
            <span dir="ltr" className="latin-nums block text-start text-sm text-navy-80">{email}</span>
          </span>
        </a>
      ) : (
        <div className="flex items-center gap-4 rounded-xl border border-navy-20/60 bg-white p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream text-navy-60">
            <Mail size={21} />
          </span>
          <span>
            <span className="block font-heading font-bold text-navy">{t("emailTitle")}</span>
            <span className="block text-sm text-gray">{t("emailPending")}</span>
          </span>
        </div>
      )}

      {/* الموقع */}
      <div className="flex items-center gap-4 rounded-xl border border-navy-20/60 bg-white p-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream text-gold">
          <MapPin size={21} />
        </span>
        <span>
          <span className="block font-heading font-bold text-navy">
            {t("addressTitle")}
          </span>
          <span className="block text-sm text-gray">{t("addressValue")}</span>
        </span>
      </div>

      {/* التواصل الاجتماعي */}
      {socials.length > 0 ? (
        <div className="pt-1">
          <p className="mb-3 text-sm font-medium text-navy-80">{t("followUs")}</p>
          <SocialLinks socials={socials} variant="light" />
        </div>
      ) : null}
    </div>
  );
}
