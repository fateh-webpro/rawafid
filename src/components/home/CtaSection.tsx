import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { StreamLines } from "@/components/motion/StreamLines";
import { buttonClasses } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/site";

export async function CtaSection({ locale }: { locale: string }) {
  const t = await getTranslations("cta");

  const waMessage =
    locale === "ar"
      ? "مرحباً، أرغب بطلب عرض سعر لتأجير معدات."
      : "Hello, I would like to request an equipment rental quote.";

  return (
    <section className="relative overflow-hidden bg-navy-deep py-20 lg:py-24">
      <StreamLines
        className="absolute inset-x-0 -bottom-10 h-full w-full text-gold/15"
        delay={0.2}
      />
      <Reveal className="relative mx-auto max-w-3xl px-5 text-center">
        <h2 className="text-3xl md:text-4xl text-white leading-snug">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-navy-20">{t("subtitle")}</p>
        <div className="mt-9 flex flex-col items-center gap-4">
          <Link
            href="/contact"
            className={buttonClasses("gold", "px-10 py-4 text-base")}
          >
            {t("primary")}
          </Link>
          <a
            href={whatsappLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy-20 underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold"
          >
            {t("orWhatsapp")}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
