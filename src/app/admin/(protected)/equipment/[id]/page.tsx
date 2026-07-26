import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EquipmentForm } from "@/components/admin/EquipmentForm";
import { parseSpecs } from "@/lib/specs";
import { updateEquipment } from "../actions";

export default async function EditEquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, categories] = await Promise.all([
    db.equipment.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!item) notFound();

  const action = updateEquipment.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-navy">تعديل المعدة</h1>
      <EquipmentForm
        action={action}
        categories={categories.map((c) => ({ id: c.id, nameAr: c.nameAr }))}
        defaults={{
          categoryId: item.categoryId,
          nameAr: item.nameAr,
          nameEn: item.nameEn,
          image: item.image,
          status: item.status,
          specs: parseSpecs(item.specs),
        }}
        submitLabel="حفظ التعديلات"
      />
    </div>
  );
}
