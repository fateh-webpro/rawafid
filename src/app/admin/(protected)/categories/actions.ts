"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug"),
  nameAr: z.string().trim().min(1),
  nameEn: z.string().trim().min(1),
  image: z.string().trim().optional().or(z.literal("")),
  operator: z.enum(["both", "operated", "self"]),
});

async function guard() {
  if (!(await getSession())) redirect("/admin/login");
}

function revalidate() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/equipment");
  revalidatePath("/ar/equipment");
  revalidatePath("/en/equipment");
  revalidatePath("/ar");
  revalidatePath("/en");
}

export type CategoryFormState = { error?: string };

function parse(formData: FormData) {
  return schema.safeParse({
    slug: formData.get("slug"),
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn"),
    image: formData.get("image") ?? "",
    operator: formData.get("operator"),
  });
}

export async function createCategory(
  _prev: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await guard();
  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: "تحقّق من الحقول — الرابط بأحرف إنجليزية صغيرة وشرطات فقط." };
  }
  const d = parsed.data;

  const exists = await db.category.findUnique({ where: { slug: d.slug } });
  if (exists) return { error: "هذا الرابط (slug) مستخدم لفئة أخرى." };

  const max = await db.category.aggregate({ _max: { order: true } });
  await db.category.create({
    data: {
      slug: d.slug,
      nameAr: d.nameAr,
      nameEn: d.nameEn,
      image: d.image || "",
      operator: d.operator,
      order: (max._max.order ?? 0) + 1,
    },
  });
  revalidate();
  redirect("/admin/categories");
}

export async function updateCategory(
  id: string,
  _prev: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await guard();
  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: "تحقّق من الحقول — الرابط بأحرف إنجليزية صغيرة وشرطات فقط." };
  }
  const d = parsed.data;

  const owner = await db.category.findUnique({ where: { slug: d.slug } });
  if (owner && owner.id !== id) return { error: "هذا الرابط (slug) مستخدم لفئة أخرى." };

  await db.category.update({
    where: { id },
    data: {
      slug: d.slug,
      nameAr: d.nameAr,
      nameEn: d.nameEn,
      image: d.image || "",
      operator: d.operator,
    },
  });
  revalidate();
  redirect("/admin/categories");
}

export async function toggleCategoryHidden(id: string, hidden: boolean) {
  await guard();
  await db.category.update({ where: { id }, data: { hidden } });
  revalidate();
}

/** الحذف مسموح فقط إن كانت الفئة فارغة من المعدات */
export async function deleteCategory(id: string): Promise<{ error?: string }> {
  await guard();
  const count = await db.equipment.count({ where: { categoryId: id } });
  if (count > 0) {
    return { error: `لا يمكن حذف فئة تحتوي على ${count} معدة. انقل أو احذف معداتها أولًا.` };
  }
  await db.category.delete({ where: { id } });
  revalidate();
  return {};
}
