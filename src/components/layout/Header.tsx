"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { useSiteConfig } from "@/components/SiteConfig";
import { cn } from "@/lib/utils";

const NAV_KEYS = [
  { key: "home", href: "/" },
  { key: "equipment", href: "/equipment" },
  { key: "services", href: "/services" },
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "activities", href: "/activities" },
  { key: "contact", href: "/contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const { phone } = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-navy/95 backdrop-blur-md shadow-[0_2px_24px_rgba(22,37,58,0.35)] py-2.5"
          : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" aria-label={locale === "ar" ? "روافد سبأ — الرئيسية" : "Rawafid Saba — Home"}>
          <Logo locale={locale} onDark markClassName="h-8" />
        </Link>

        {/* سطح المكتب */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Main">
          {NAV_KEYS.map(({ key, href }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  "relative py-1 text-[0.92rem] font-medium transition-colors duration-200",
                  active ? "text-gold" : "text-white/85 hover:text-white"
                )}
              >
                {t(key)}
                <span
                  className={cn(
                    "absolute -bottom-0.5 start-0 h-[2px] bg-gold transition-all duration-300",
                    active ? "w-full" : "w-0"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href={pathname}
            locale={locale === "ar" ? "en" : "ar"}
            className="latin-nums text-[0.8rem] tracking-wide text-white/70 hover:text-gold transition-colors"
          >
            {tc("language")}
          </Link>
          <Link href="/contact" className={buttonClasses("gold", "px-5 py-2.5 text-[0.85rem]")}>
            {t("requestQuote")}
          </Link>
        </div>

        {/* زر القائمة للجوال */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 text-white"
          aria-expanded={open}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* قائمة الجوال */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-navy-deep/98 backdrop-blur-md border-t border-white/10"
            aria-label="Mobile"
          >
            <div className="flex flex-col px-6 py-4">
              {NAV_KEYS.map(({ key, href }) => (
                <Link
                  key={key}
                  href={href}
                  className="py-3.5 text-white/90 font-medium border-b border-white/8 last:border-0"
                >
                  {t(key)}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4 pb-2">
                <Link href="/contact" className={buttonClasses("gold", "flex-1 py-3")}>
                  {t("requestQuote")}
                </Link>
                <a
                  href={`tel:${phone}`}
                  className={buttonClasses("outline-light", "px-4 py-3")}
                  aria-label={tc("language") === "English" ? "اتصل بنا" : "Call us"}
                >
                  <Phone size={18} />
                </a>
                <Link
                  href={pathname}
                  locale={locale === "ar" ? "en" : "ar"}
                  className="latin-nums text-sm text-white/70"
                >
                  {tc("language")}
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
