import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import {
  Award,
  HeartHandshake,
  Infinity as InfinityIcon,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/home/SectionHeading";
import { StatsBar } from "@/components/home/StatsBar";
import { CtaSection } from "@/components/home/CtaSection";
import { LogoMark } from "@/components/brand/LogoMark";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

const valueIcons = {
  excellence: Award,
  reliability: ShieldCheck,
  safety: ShieldAlert,
  continuity: InfinityIcon,
  partnership: HeartHandshake,
  ambition: TrendingUp,
} as const;

const valueKeys = [
  "excellence",
  "reliability",
  "safety",
  "continuity",
  "partnership",
  "ambition",
] as const;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const title = `${tn("about")} — ${t("title")}`;
  return {
    title: { absolute: title },
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/about"),
    openGraph: buildOpenGraph(locale, "/about", title, t("subtitle")),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage");

  return (
    <main>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      {/* قصة العلامة */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/projects/p1.jpg"
                alt={t("storyTitle")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-navy/20" aria-hidden />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mb-3 text-[0.8rem] font-medium tracking-[0.22em] text-gold">
              {t("eyebrow")}
            </p>
            <h2 className="text-3xl md:text-4xl text-navy">{t("storyTitle")}</h2>
            <span className="diamond-divider mt-5 w-40 text-gold" aria-hidden>
              <span className="block h-1.5 w-1.5 rotate-45 bg-gold" />
            </span>
            <p className="mt-6 text-lg leading-relaxed text-navy-80">
              {t("storyBody")}
            </p>
          </Reveal>
        </div>
      </section>

      <StatsBar />

      {/* الرؤية والرسالة */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2 lg:px-8">
          <Reveal className="h-full">
            <article className="relative h-full overflow-hidden rounded-2xl bg-navy p-9 text-white">
              <LogoMark className="pointer-events-none absolute -bottom-16 -end-10 h-64 w-auto text-white opacity-[0.06]" />
              <p className="text-[0.78rem] tracking-[0.22em] text-gold">VISION</p>
              <h3 className="mt-2 text-2xl">{t("visionTitle")}</h3>
              <p className="mt-4 leading-relaxed text-navy-20">{t("visionBody")}</p>
            </article>
          </Reveal>
          <Reveal delay={0.15} className="h-full">
            <article className="h-full rounded-2xl border border-navy-20/60 bg-white p-9">
              <p className="text-[0.78rem] tracking-[0.22em] text-gold">MISSION</p>
              <h3 className="mt-2 text-2xl text-navy">{t("missionTitle")}</h3>
              <p className="mt-4 leading-relaxed text-navy-80">{t("missionBody")}</p>
            </article>
          </Reveal>
        </div>
      </section>

      {/* القيم */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow={t("valuesEyebrow")} title={t("valuesTitle")} />
          <Stagger
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            staggerDelay={0.08}
          >
            {valueKeys.map((key, i) => {
              const Icon = valueIcons[key];
              return (
                <StaggerItem key={key}>
                  <article className="group h-full rounded-xl border border-navy-20/50 bg-cream p-7 transition-all duration-300 hover:border-gold hover:-translate-y-1">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                        <Icon size={23} strokeWidth={1.8} />
                      </span>
                      <span className="latin-nums text-2xl font-bold text-navy-20">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="text-xl text-navy mb-2">
                      {t(`values.${key}.title`)}
                    </h3>
                    <p className="text-[0.95rem] leading-relaxed text-gray">
                      {t(`values.${key}.desc`)}
                    </p>
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
