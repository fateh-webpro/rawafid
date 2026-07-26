import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { equipmentIconMap } from "@/components/icons/equipment";
import { getVisibleCategoriesWithCounts } from "@/lib/data/equipment-query";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "equipmentPage" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/equipment"),
    openGraph: buildOpenGraph(locale, "/equipment", t("title"), t("subtitle")),
  };
}

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const t = await getTranslations("equipmentPage");

  const categories = await getVisibleCategoriesWithCounts();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <main>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      {/* شريط تبويبات الفئات — وصول سريع لكل فئة */}
      <div className="sticky top-16 z-30 border-b border-navy-20/40 bg-cream/95 backdrop-blur-md lg:top-[68px]">
        <div className="mx-auto max-w-7xl overflow-x-auto px-5 py-3 lg:px-8">
          <div className="flex w-max gap-2">
            {categories.map((c) => {
              const name = isAr ? c.nameAr : c.nameEn;
              const Icon = equipmentIconMap[c.slug];
              return (
                <Link
                  key={c.id}
                  href={`/equipment/${c.slug}`}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-navy-20 bg-white px-4 py-2 text-[0.85rem] font-medium text-navy-80 transition-colors hover:border-gold hover:text-navy"
                >
                  {Icon ? <Icon size={16} strokeWidth={1.8} /> : null}
                  {name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Stagger
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            staggerDelay={0.06}
          >
            {categories.map((c) => {
              const name = isAr ? c.nameAr : c.nameEn;
              const count = c._count.equipment;
              return (
                <StaggerItem key={c.id}>
                  <Link
                    href={`/equipment/${c.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy-20/50 bg-white transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-[0_20px_48px_-18px_rgba(28,47,71,0.35)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {c.image ? (
                        <Image
                          src={c.image}
                          alt={name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="block h-full w-full bg-navy" />
                      )}
                      <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy/25 to-transparent" aria-hidden />
                      <span className="absolute bottom-3 start-4 inline-flex items-center gap-1 rounded-full bg-gold/95 px-3 py-1 text-[0.72rem] font-medium text-navy latin-nums">
                        {count} {t("unitsShort")}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-between gap-3 p-5">
                      <h2 className="font-heading text-xl text-navy">{name}</h2>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-navy transition-colors duration-300 group-hover:bg-gold">
                        <Arrow size={17} />
                      </span>
                    </div>
                    <span className="absolute bottom-0 start-0 h-[3px] w-0 bg-gold transition-all duration-300 group-hover:w-full" aria-hidden />
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </main>
  );
}
