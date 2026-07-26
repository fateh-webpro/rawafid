import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { UnitsGrid } from "@/components/equipment/UnitsGrid";
import type { CatalogItem, CardLabels } from "@/components/equipment/EquipmentCard";
import { getCategoryWithUnits } from "@/lib/data/equipment-query";
import { parseSpecs } from "@/lib/specs";
import { whatsappLink } from "@/lib/site";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const cat = await getCategoryWithUnits(category);
  if (!cat) return { title: "المعدات" };
  const name = locale === "ar" ? cat.nameAr : cat.nameEn;
  const t = await getTranslations({ locale, namespace: "equipmentPage" });
  const title = `${t("categoryTitlePrefix")} ${name}`;
  const description = `${title} — ${t("subtitle")}`;
  const path = `/equipment/${category}`;
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: buildOpenGraph(locale, path, title, description, cat.image || undefined),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  const cat = await getCategoryWithUnits(category);
  if (!cat) notFound();

  const t = await getTranslations("equipmentPage");
  const tcommon = await getTranslations("common");
  const Back = isAr ? ArrowRight : ArrowLeft;

  const name = isAr ? cat.nameAr : cat.nameEn;
  const opLabel =
    cat.operator === "both" ? t("opBoth") : cat.operator === "self" ? t("opSelf") : t("opOperated");

  const items: CatalogItem[] = cat.equipment.map((u) => {
    const unitName = isAr ? u.nameAr : u.nameEn;
    const specs = parseSpecs(u.specs).map((s) => ({
      label: isAr ? s.labelAr : s.labelEn || s.labelAr,
      value: s.value,
    }));
    return {
      id: u.id,
      categorySlug: cat.slug,
      name: unitName,
      image: u.image,
      operatorLabel: opLabel,
      whatsappUrl: whatsappLink(t("whatsappMsg", { name: unitName })),
      specs,
    };
  });

  const labels: CardLabels = {
    unitLabel: t("unitLabel"),
    terms: t("terms"),
    requestUnit: t("requestUnit"),
    available: tcommon("available"),
  };

  return (
    <main>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={name}
        subtitle={`${cat.equipment.length} ${t("unitsShort")} — ${opLabel}`}
      />

      <section className="bg-cream px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/equipment"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-navy-80 transition-colors hover:text-gold"
          >
            <Back size={16} />
            {t("backToCategories")}
          </Link>

          {items.length === 0 ? (
            <p className="py-16 text-center text-gray">{t("noUnitsYet")}</p>
          ) : (
            <UnitsGrid items={items} labels={labels} />
          )}
        </div>
      </section>
    </main>
  );
}
