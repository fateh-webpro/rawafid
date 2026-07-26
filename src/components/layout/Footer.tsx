import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { LogoMark } from "@/components/brand/LogoMark";
import { site } from "@/lib/site";
import { getSettings, activeSocials } from "@/lib/settings";
import { SocialLinks } from "./SocialLinks";

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const s = await getSettings();
  const phone = s["contact.phone"];
  const phoneDisplay = s["contact.phoneDisplay"];
  const email = s["contact.email"];
  const socials = activeSocials(s);

  const links = [
    { key: "activities", href: "/activities" },
    { key: "equipment", href: "/equipment" },
    { key: "services", href: "/services" },
    { key: "projects", href: "/projects" },
    { key: "about", href: "/about" },
    { key: "blog", href: "/blog" },
  ] as const;

  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white">
      {/* مجرى الزاوية — من قواعد الهوية: الرمز مقصوصاً بشفافية خفيفة */}
      <LogoMark className="pointer-events-none absolute -bottom-24 -end-16 h-[420px] w-auto text-white opacity-[0.05]" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Logo locale={locale} onDark />
            <p className="mt-5 max-w-xs text-navy-20 leading-relaxed">
              {t("tagline")}
            </p>
            <SocialLinks socials={socials} variant="dark" className="mt-6" />
          </div>

          <nav aria-label={t("quickLinks")}>
            <h3 className="text-gold text-sm font-bold tracking-wider mb-5">
              {t("quickLinks")}
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {links.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-navy-20 hover:text-gold transition-colors duration-200"
                  >
                    {tn(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-gold text-sm font-bold tracking-wider mb-5">
              {t("contactUs")}
            </h3>
            <ul className="space-y-4 text-navy-20">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 hover:text-gold transition-colors"
                >
                  <Phone size={17} className="text-gold shrink-0" />
                  <span dir="ltr" className="latin-nums">
                    {phoneDisplay}
                  </span>
                </a>
              </li>
              {email ? (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 hover:text-gold transition-colors"
                  >
                    <Mail size={17} className="text-gold shrink-0" />
                    <span dir="ltr" className="latin-nums">{email}</span>
                  </a>
                </li>
              ) : null}
              <li className="flex items-center gap-3">
                <MapPin size={17} className="text-gold shrink-0" />
                {t("address")}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-3 text-[0.8rem] text-navy-40">
          <p>
            © <span className="latin-nums">{new Date().getFullYear()}</span>{" "}
            {locale === "ar" ? site.nameAr : site.nameEn} — {t("rights")}
          </p>
          <p dir="ltr" className="latin-nums tracking-[0.18em]">
            RAWAFID SABA CO. LTD.
          </p>
        </div>
      </div>
    </footer>
  );
}
