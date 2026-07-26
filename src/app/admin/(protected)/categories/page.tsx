import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { CategoriesList, type CatItem } from "./CategoriesList";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const cats = await db.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { equipment: true } } },
  });

  const items: CatItem[] = cats.map((c) => ({
    id: c.id,
    slug: c.slug,
    nameAr: c.nameAr,
    image: c.image,
    hidden: c.hidden,
    count: c._count.equipment,
  }));

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">إدارة الفئات</h1>
          <p className="mt-1 text-gray">
            <span className="latin-nums">{items.length}</span> فئة — أضف المعدات داخل فئاتها.
          </p>
        </div>
        <Link href="/admin/categories/new" className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 font-heading font-bold text-navy transition-colors hover:bg-gold-80">
          <Plus size={18} />
          إضافة فئة
        </Link>
      </header>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-navy-20 bg-white p-12 text-center text-gray">
          لا توجد فئات بعد. اضغط «إضافة فئة» للبدء.
        </p>
      ) : (
        <CategoriesList items={items} />
      )}
    </div>
  );
}
