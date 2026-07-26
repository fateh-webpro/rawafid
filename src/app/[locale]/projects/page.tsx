import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/components/home/CtaSection";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/Reveal";
import { getPublishedProjects } from "@/lib/data/equipment-query";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projectsPage" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/projects"),
    openGraph: buildOpenGraph(locale, "/projects", t("title"), t("subtitle")),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const t = await getTranslations("projectsPage");

  const projects = await getPublishedProjects();

  return (
    <main>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Stagger
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            staggerDelay={0.07}
          >
            {projects.map((p) => {
              const title = isAr ? p.titleAr : p.titleEn;
              const tag = isAr ? p.tagAr : p.tagEn;
              return (
                <StaggerItem key={p.id}>
                  <article className="group relative overflow-hidden rounded-xl">
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy/25 to-transparent"
                        aria-hidden
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <span className="inline-block rounded-full bg-gold/90 px-3 py-1 text-[0.72rem] font-medium text-navy">
                        {tag}
                      </span>
                      <h3 className="mt-2 font-heading text-xl text-white">{title}</h3>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>

          <Reveal delay={0.2}>
            <p className="mt-10 text-center text-sm text-gray">{t("note")}</p>
          </Reveal>
        </div>
      </section>

      <CtaSection locale={locale} />
    </main>
  );
}
