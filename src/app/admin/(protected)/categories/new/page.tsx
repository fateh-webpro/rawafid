import { CategoryForm } from "@/components/admin/CategoryForm";
import { createCategory } from "../actions";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-navy">إضافة فئة جديدة</h1>
      <CategoryForm action={createCategory} submitLabel="إضافة الفئة" />
    </div>
  );
}
