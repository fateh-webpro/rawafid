import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { updateCategory } from "../actions";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await db.category.findUnique({ where: { id } });
  if (!c) notFound();

  const action = updateCategory.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-navy">تعديل الفئة</h1>
      <CategoryForm
        action={action}
        defaults={{
          slug: c.slug,
          nameAr: c.nameAr,
          nameEn: c.nameEn,
          image: c.image,
          operator: c.operator,
        }}
        submitLabel="حفظ التعديلات"
      />
    </div>
  );
}
