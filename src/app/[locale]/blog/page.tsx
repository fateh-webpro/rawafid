import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Newspaper, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { getPublishedPosts } from "@/lib/data/equipment-query";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogPage" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/blog"),
    openGraph: buildOpenGraph(locale, "/blog", t("title"), t("subtitle")),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const t = await getTranslations("blogPage");
  const te = await getTranslations("emptyPage");

  const posts = await getPublishedPosts();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  if (posts.length === 0) {
    return (
      <EmptyState
        eyebrow={te("blogEyebrow")}
        title={te("blogTitle")}
        body={te("blogBody")}
        icon={<Newspaper size={34} strokeWidth={1.7} />}
      />
    );
  }

  return (
    <main>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.07}>
            {posts.map((p) => {
              const title = isAr ? p.titleAr : p.titleEn;
              const date = (p.publishedAt ?? p.createdAt).toLocaleDateString(
                isAr ? "ar-SA" : "en-GB",
                { year: "numeric", month: "long", day: "numeric" }
              );
              return (
                <StaggerItem key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-navy-20/50 bg-white transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-[0_16px_40px_-16px_rgba(28,47,71,0.3)]"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-navy">
                      {p.cover ? (
                        <Image
                          src={p.cover}
                          alt={title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-gold/40">
                          <Newspaper size={40} />
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="latin-nums text-xs text-gray">{date}</p>
                      <h2 className="mt-2 font-heading text-lg text-navy">{title}</h2>
                      <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-gold">
                        {t("readMore")}
                        <Arrow size={15} />
                      </span>
                    </div>
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
