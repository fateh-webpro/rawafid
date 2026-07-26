import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { EquipmentList, type EquipItem } from "./EquipmentList";

export const dynamic = "force-dynamic";

export default async function AdminEquipmentPage() {
  const equipment = await db.equipment.findMany({
    include: { category: true },
    orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
  });

  const items: EquipItem[] = equipment.map((e) => ({
    id: e.id,
    nameAr: e.nameAr,
    image: e.image,
    status: e.status,
    categoryName: e.category.nameAr,
    categorySlug: e.category.slug,
  }));

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">إدارة المعدات</h1>
          <p className="mt-1 text-gray">
            <span className="latin-nums">{items.length}</span> وحدة عبر الفئات
          </p>
        </div>
        <Link
          href="/admin/equipment/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 font-heading font-bold text-navy transition-colors hover:bg-gold-80"
        >
          <Plus size={18} />
          إضافة معدة
        </Link>
      </header>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-navy-20 bg-white p-12 text-center text-gray">
          لا توجد معدات بعد. اضغط «إضافة معدة» للبدء.
        </p>
      ) : (
        <EquipmentList items={items} />
      )}
    </div>
  );
}
