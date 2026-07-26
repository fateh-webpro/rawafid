import { db } from "@/lib/db";

/** كل الفئات (للنماذج والقوائم) مرتّبة */
export async function getCategories() {
  return db.category.findMany({ orderBy: { order: "asc" } });
}

/** الفئات الظاهرة (غير المحجوبة) مع عدد معداتها المتاحة — لبطاقات صفحة المعدات */
export async function getVisibleCategoriesWithCounts() {
  const cats = await db.category.findMany({
    where: { hidden: false },
    orderBy: { order: "asc" },
    include: {
      _count: { select: { equipment: { where: { status: { not: "hidden" } } } } },
    },
  });
  return cats;
}

/** فئة واحدة بالـ slug مع وحداتها الظاهرة */
export async function getCategoryWithUnits(slug: string) {
  return db.category.findFirst({
    where: { slug, hidden: false },
    include: {
      equipment: {
        where: { status: { not: "hidden" } },
        orderBy: { order: "asc" },
      },
    },
  });
}

/** وحدات المعدات الظاهرة (غير المخفية) مع فئاتها */
export async function getVisibleEquipment() {
  return db.equipment.findMany({
    where: { status: { not: "hidden" }, category: { hidden: false } },
    include: { category: true },
    orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
  });
}

/** المشاريع المنشورة مرتّبة */
export async function getPublishedProjects() {
  return db.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

/** مقالات المدونة المنشورة (الأحدث أولاً) */
export async function getPublishedPosts() {
  return db.post.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getPostBySlug(slug: string) {
  return db.post.findFirst({ where: { slug, published: true } });
}

/** ملفات مركز التحميل مرتّبة */
export async function getDownloadFiles() {
  return db.downloadFile.findMany({ orderBy: { order: "asc" } });
}
