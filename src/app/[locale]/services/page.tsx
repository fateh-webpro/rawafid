import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ClipboardCheck,
  Clock3,
  KeyRound,
  Truck,
  UserCog,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/components/home/CtaSection";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { serviceSlugs } from "@/lib/data/categories";

const icons = {
  "operated-rental": UserCog,
  "bare-rental": KeyRound,
  "flexible-terms": Clock3,
  transport: Truck,
  maintenance: Wrench,
  "site-assessment": ClipboardCheck,
} as const;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/services"),
    openGraph: buildOpenGraph(locale, "/services", t("title"), t("subtitle")),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("servicesPage");
  const ts = await getTranslations("services");

  return (
    <main>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Stagger
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            staggerDelay={0.08}
          >
            {serviceSlugs.map((slug, i) => {
              const Icon = icons[slug];
              return (
                <StaggerItem key={slug}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-navy-20/50 bg-cream p-8 transition-all duration-300 hover:border-gold hover:-translate-y-1">
                    <span
                      className="absolute top-5 end-6 latin-nums text-3xl font-bold text-navy-20"
                      aria-hidden
                    >
                      0{i + 1}
                    </span>
                    <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-navy text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                      <Icon size={26} strokeWidth={1.7} />
                    </span>
                    <h3 className="text-2xl text-navy mb-3">{ts(`${slug}.title`)}</h3>
                    <p className="leading-relaxed text-gray">{ts(`${slug}.desc`)}</p>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <CtaSection locale={locale} />
    </main>
  );
}
