import { db } from "@/lib/db";
import { EquipmentForm } from "@/components/admin/EquipmentForm";
import { createEquipment } from "../actions";

export default async function NewEquipmentPage() {
  const categories = await db.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-navy">إضافة معدة جديدة</h1>
      <EquipmentForm
        action={createEquipment}
        categories={categories.map((c) => ({ id: c.id, nameAr: c.nameAr }))}
        submitLabel="إضافة المعدة"
      />
    </div>
  );
}
