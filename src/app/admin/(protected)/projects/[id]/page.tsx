import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { updateProject } from "../actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await db.project.findUnique({ where: { id } });
  if (!p) notFound();

  const action = updateProject.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-navy">تعديل المشروع</h1>
      <ProjectForm
        action={action}
        defaults={{
          titleAr: p.titleAr,
          titleEn: p.titleEn,
          tagAr: p.tagAr,
          tagEn: p.tagEn,
          image: p.image,
          descAr: p.descAr ?? "",
          descEn: p.descEn ?? "",
          published: p.published,
        }}
        submitLabel="حفظ التعديلات"
      />
    </div>
  );
}
