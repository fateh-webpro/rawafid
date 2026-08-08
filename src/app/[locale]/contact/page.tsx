import { buildAlternates, buildOpenGraph, buildTwitterCard } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactMethods } from "@/components/contact/ContactMethods";
import { QuoteForm, type QuoteFormLabels } from "@/components/contact/QuoteForm";
import { Reveal } from "@/components/motion/Reveal";
import { getCategories } from "@/lib/data/equipment-query";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/contact"),
    openGraph: buildOpenGraph(locale, "/contact", t("title"), t("subtitle")),
    twitter: buildTwitterCard(locale, t("title"), t("subtitle")),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contactPage");
  const isAr = locale === "ar";
  const dbCategories = await getCategories();

  const categories = [
    ...dbCategories
      .filter((c) => !c.hidden)
      .map((c) => ({ value: c.slug, label: isAr ? c.nameAr : c.nameEn })),
    { value: "other", label: t("fCategoryOther") },
  ];

  const labels: QuoteFormLabels = {
    title: t("formTitle"),
    note: t("formNote"),
    name: t("fName"),
    phone: t("fPhone"),
    phoneHint: t("fPhoneHint"),
    company: t("fCompany"),
    category: t("fCategory"),
    categoryPlaceholder: t("fCategoryPlaceholder"),
    duration: t("fDuration"),
    durationOptions: {
      daily: t("durDaily"),
      weekly: t("durWeekly"),
      monthly: t("durMonthly"),
      unspecified: t("durUnspecified"),
    },
    city: t("fCity"),
    details: t("fDetails"),
    detailsPlaceholder: t("fDetailsPlaceholder"),
    submit: t("submit"),
    submitting: t("submitting"),
    successTitle: t("successTitle"),
    successBody: t("successBody"),
    errorGeneric: t("errorGeneric"),
    errors: {
      name: t("errName"),
      phone: t("errPhone"),
      category: t("errCategory"),
      city: t("errCity"),
    },
  };

  return (
    <main>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="bg-cream px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.35fr]">
          <Reveal>
            <ContactMethods locale={locale} />
          </Reveal>
          <Reveal delay={0.15}>
            <QuoteForm
              categories={categories}
              labels={labels}
              defaultCity={site.city}
              locale={locale}
            />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
