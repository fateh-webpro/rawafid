import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PostForm } from "@/components/admin/PostForm";
import { updatePost } from "../actions";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await db.post.findUnique({ where: { id } });
  if (!p) notFound();

  const action = updatePost.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-navy">تعديل المقال</h1>
      <PostForm
        action={action}
        defaults={{
          titleAr: p.titleAr,
          titleEn: p.titleEn,
          bodyAr: p.bodyAr,
          bodyEn: p.bodyEn,
          cover: p.cover ?? "",
          slug: p.slug,
          published: p.published,
        }}
        submitLabel="حفظ التعديلات"
      />
    </div>
  );
}
