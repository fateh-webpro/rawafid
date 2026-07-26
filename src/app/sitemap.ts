import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { localeUrl } from "@/lib/seo";

/** إدخال ثنائي اللغة مع بدائل hreflang */
function entry(
  path: string,
  opts?: { priority?: number; changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]; lastModified?: Date }
): MetadataRoute.Sitemap {
  const languages = {
    ar: localeUrl("ar", path),
    en: localeUrl("en", path),
    "x-default": localeUrl("ar", path),
  };
  return (["ar", "en"] as const).map((loc) => ({
    url: localeUrl(loc, path),
    lastModified: opts?.lastModified,
    changeFrequency: opts?.changeFrequency ?? "weekly",
    priority: opts?.priority ?? 0.6,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: MetadataRoute.Sitemap = [
    ...entry("", { priority: 1, changeFrequency: "daily" }),
    ...entry("/equipment", { priority: 0.9 }),
    ...entry("/services", { priority: 0.8 }),
    ...entry("/projects", { priority: 0.7 }),
    ...entry("/about", { priority: 0.6 }),
    ...entry("/activities", { priority: 0.6 }),
    ...entry("/contact", { priority: 0.8 }),
    ...entry("/blog", { priority: 0.6 }),
  ];

  let dynamic: MetadataRoute.Sitemap = [];
  try {
    const [cats, posts] = await Promise.all([
      db.category.findMany({ where: { hidden: false }, select: { slug: true } }),
      db.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    dynamic = [
      ...cats.flatMap((c) => entry(`/equipment/${c.slug}`, { priority: 0.8 })),
      ...posts.flatMap((p) =>
        entry(`/blog/${p.slug}`, { priority: 0.5, lastModified: p.updatedAt })
      ),
    ];
  } catch {
    // في حال تعذّر الاتصال بقاعدة البيانات، نُبقي الصفحات الثابتة
  }

  return [...staticPaths, ...dynamic];
}
