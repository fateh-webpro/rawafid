"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "@/components/brand/LogoMark";
import { StreamLines } from "@/components/motion/StreamLines";
import { WordsReveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { useSiteConfig, waLink } from "@/components/SiteConfig";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ image }: { image: string }) {
  const t = useTranslations("hero");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const { phone, phoneDisplay, whatsapp } = useSiteConfig();

  const waMessage =
    locale === "ar"
      ? "مرحباً، أرغب بالاستفسار عن تأجير معدات."
      : "Hello, I would like to inquire about equipment rental.";

  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden bg-navy-deep">
      {/* صورة الهيدر — قابلة للتغيير من إعدادات الموقع */}
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* التراكب الكحلي 70:40 — قاعدة من دليل الهوية لوضع النصوص فوق الصور */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/85 to-navy/40"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(36,64,94,0.5)_0%,rgba(22,37,58,0.75)_60%)]"
        aria-hidden
      />

      {/* شريط الروافد — يُرسم ذاتياً عند الافتتاح */}
      <StreamLines
        className="absolute inset-x-0 bottom-0 h-[70%] w-full text-gold/25"
        delay={0.4}
      />

      {/* مجرى الزاوية — الرمز مقصوصاً بشفافية وفق قاعدة الهوية (6-10%) */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute -top-10 -end-10 h-[220px] w-auto text-white opacity-[0.035] sm:-top-14 sm:-end-12 sm:h-[280px] sm:opacity-[0.04] md:-top-20 md:-end-16 md:h-[360px] md:opacity-[0.045] lg:-top-32 lg:-end-24 lg:h-[520px] lg:opacity-[0.05]"
        aria-hidden
      >
        <LogoMark className="h-full w-auto" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-8 pt-28 pb-20">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="mb-6 text-gold tracking-[0.2em] text-[0.82rem] font-medium latin-nums"
        >
          {t("eyebrow")}
        </motion.p>

        <h1 className="text-[2.6rem] leading-[1.15] md:text-6xl lg:text-7xl text-white max-w-4xl">
          <WordsReveal text={t("title")} delay={0.35} />
          <br />
          <WordsReveal text={t("titleAccent")} delay={0.7} className="text-gold" />
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05, ease: EASE }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-navy-20"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.25, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link href="/equipment" className={buttonClasses("gold")}>
            {t("ctaPrimary")}
          </Link>
          <a
            href={waLink(whatsapp, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("whatsapp")}
          >
            {t("ctaWhatsapp")}
          </a>
          <a
            href={`tel:${phone}`}
            className={buttonClasses("outline-light")}
            aria-label={`${t("ctaCall")} ${phoneDisplay}`}
          >
            <Phone size={17} />
            {t("ctaCall")}
          </a>
        </motion.div>
      </div>

      {/* إشارة التمرير */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-7 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex flex-col items-center gap-2 text-navy-40"
        aria-hidden
      >
        <span className="text-[0.7rem] tracking-[0.25em]">
          {t("scrollHint")}
        </span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block h-8 w-[1.5px] bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
