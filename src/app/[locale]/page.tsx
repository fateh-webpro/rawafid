import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhySection } from "@/components/home/WhySection";
import { CtaSection } from "@/components/home/CtaSection";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const s = await getSettings();

  return (
    <main>
      <Hero image={s["hero.image"]} />
      <StatsBar />
      <CategoriesSection locale={locale} />
      <ServicesSection />
      <WhySection />
      <CtaSection locale={locale} />
    </main>
  );
}
