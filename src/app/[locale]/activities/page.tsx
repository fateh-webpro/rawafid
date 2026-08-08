import { buildAlternates, buildOpenGraph, buildTwitterCard } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Truck, Building2, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "activitiesPage" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/activities"),
    openGraph: buildOpenGraph(locale, "/activities", t("title"), t("subtitle")),
    twitter: buildTwitterCard(locale, t("title"), t("subtitle")),
  };
}

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const t = await getTranslations("activitiesPage");

  const s = await getSettings();
  const aluminumUrl = s["aluminum.url"]?.trim();
  const aluminumImage = s["aluminum.image"]?.trim();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <main>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2 lg:px-8">
          {/* نشاط تأجير المعدات — داخلي */}
          <Reveal className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-20/50 bg-white transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-[0_24px_56px_-20px_rgba(28,47,71,0.4)]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/equipment/hero.jpg"
                  alt={t("equipmentTitle")}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 to-navy/20" aria-hidden />
                <span className="absolute top-4 start-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-navy">
                  <Truck size={22} />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h2 className="font-heading text-2xl text-navy">{t("equipmentTitle")}</h2>
                <p className="mt-3 flex-1 leading-relaxed text-gray">{t("equipmentDesc")}</p>
                <Link href="/equipment" className={buttonClasses("navy", "mt-6 w-fit")}>
                  {t("equipmentCta")}
                  <Arrow size={17} />
                </Link>
              </div>
            </article>
          </Reveal>

          {/* نشاط الألمنيوم — خارجي أو "قريبًا" */}
          <Reveal delay={0.15} className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-20/50 bg-white transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-[0_24px_56px_-20px_rgba(28,47,71,0.4)]">
              <div className="relative aspect-[16/10] overflow-hidden bg-navy">
                {aluminumImage ? (
                  <Image
                    src={aluminumImage}
                    alt={t("aluminumTitle")}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-gold/30">
                    <Building2 size={72} strokeWidth={1.2} />
                  </span>
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 to-navy/20" aria-hidden />
                <span className="absolute top-4 start-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-navy">
                  <Building2 size={22} />
                </span>
                {!aluminumUrl ? (
                  <span className="absolute top-4 end-4 rounded-full bg-white/95 px-3 py-1 text-[0.72rem] font-medium text-navy">
                    {t("comingSoon")}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h2 className="font-heading text-2xl text-navy">{t("aluminumTitle")}</h2>
                <p className="mt-3 flex-1 leading-relaxed text-gray">{t("aluminumDesc")}</p>
                {aluminumUrl ? (
                  <a
                    href={aluminumUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses("gold", "mt-6 w-fit")}
                  >
                    {t("aluminumCta")}
                    <ExternalLink size={16} />
                  </a>
                ) : (
                  <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-md border border-navy-20 px-7 py-3.5 font-heading font-bold text-navy-40">
                    {t("comingSoon")}
                  </span>
                )}
              </div>
            </article>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
