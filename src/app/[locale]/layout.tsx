import type { Metadata } from "next";
import { Almarai, Tajawal, Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { SiteConfigProvider } from "@/components/SiteConfig";
import { getSettings } from "@/lib/settings";
import { SITE_URL, buildAlternates, buildOpenGraph } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import "../globals.css";

/* الخطوط الرسمية من دليل الهوية:
   Almarai للعناوين — Tajawal للنصوص — Montserrat للاتيني والأرقام */
const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("description"),
    alternates: buildAlternates(locale, ""),
    openGraph: buildOpenGraph(locale, "", t("title"), t("description")),
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/images/equipment/hero.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";

  const settings = await getSettings();
  const siteConfig = {
    phone: settings["contact.phone"],
    phoneDisplay: settings["contact.phoneDisplay"],
    whatsapp: settings["contact.whatsapp"],
    email: settings["contact.email"],
  };

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${almarai.variable} ${tajawal.variable} ${montserrat.variable}`}
    >
      <body className="antialiased">
        <JsonLd locale={locale} settings={settings} />
        <NextIntlClientProvider>
          <SiteConfigProvider value={siteConfig}>
            <Header />
            {children}
            <Footer locale={locale} />
            <WhatsAppFab />
          </SiteConfigProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
