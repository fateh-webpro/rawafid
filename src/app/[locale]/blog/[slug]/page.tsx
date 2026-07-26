import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { getPostBySlug } from "@/lib/data/equipment-query";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "المقال" };
  const title = locale === "ar" ? post.titleAr : post.titleEn;
  const body = locale === "ar" ? post.bodyAr : post.bodyEn;
  const description = body.slice(0, 160);
  const path = `/blog/${slug}`;
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      ...buildOpenGraph(locale, path, title, description, post.cover || undefined),
      type: "article",
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const t = await getTranslations("blogPage");

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const title = isAr ? post.titleAr : post.titleEn;
  const body = isAr ? post.bodyAr : post.bodyEn;
  const date = (post.publishedAt ?? post.createdAt).toLocaleDateString(
    isAr ? "ar-SA" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const Back = isAr ? ArrowRight : ArrowLeft;
  const paragraphs = body.split(/\n{2,}/).filter((p) => p.trim());

  return (
    <main>
      <article className="bg-white pb-20">
        {/* الغلاف */}
        <div className="relative flex min-h-[46vh] items-end overflow-hidden bg-navy-deep pt-28">
          {post.cover ? (
            <Image src={post.cover} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy/30" aria-hidden />
          <div className="relative mx-auto w-full max-w-3xl px-5 pb-10">
            <Reveal>
              <p className="latin-nums mb-3 text-sm text-gold">{t("published")} {date}</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight text-white">{title}</h1>
            </Reveal>
          </div>
        </div>

        {/* المحتوى */}
        <div className="mx-auto max-w-3xl px-5">
          <Reveal className="prose-rs mt-12">
            {paragraphs.map((p, i) => (
              <p key={i} className="mb-5 text-lg leading-[1.9] text-navy-80">
                {p}
              </p>
            ))}
          </Reveal>

          <div className="mt-12 border-t border-navy-20/50 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-medium text-gold hover:text-navy transition-colors"
            >
              <Back size={16} />
              {t("backToBlog")}
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
