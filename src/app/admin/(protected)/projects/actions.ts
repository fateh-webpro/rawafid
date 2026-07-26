"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  titleAr: z.string().trim().min(1),
  titleEn: z.string().trim().min(1),
  tagAr: z.string().trim().min(1),
  tagEn: z.string().trim().min(1),
  image: z.string().trim().min(1),
  descAr: z.string().trim().optional().or(z.literal("")),
  descEn: z.string().trim().optional().or(z.literal("")),
  published: z.union([z.literal("on"), z.null(), z.undefined()]).transform((v) => v === "on"),
});

async function guard() {
  if (!(await getSession())) redirect("/admin/login");
}

function revalidate() {
  revalidatePath("/admin/projects");
  revalidatePath("/ar/projects");
  revalidatePath("/en/projects");
}

export type ProjectFormState = { error?: string };

function parse(formData: FormData) {
  return schema.safeParse({
    titleAr: formData.get("titleAr"),
    titleEn: formData.get("titleEn"),
    tagAr: formData.get("tagAr"),
    tagEn: formData.get("tagEn"),
    image: formData.get("image"),
    descAr: formData.get("descAr") ?? "",
    descEn: formData.get("descEn") ?? "",
    published: formData.get("published"),
  });
}

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await guard();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "الرجاء تعبئة الحقول المطلوبة" };
  const d = parsed.data;
  const max = await db.project.aggregate({ _max: { order: true } });
  await db.project.create({
    data: {
      titleAr: d.titleAr,
      titleEn: d.titleEn,
      tagAr: d.tagAr,
      tagEn: d.tagEn,
      image: d.image,
      descAr: d.descAr || null,
      descEn: d.descEn || null,
      published: d.published,
      order: (max._max.order ?? 0) + 1,
    },
  });
  revalidate();
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await guard();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "الرجاء تعبئة الحقول المطلوبة" };
  const d = parsed.data;
  await db.project.update({
    where: { id },
    data: {
      titleAr: d.titleAr,
      titleEn: d.titleEn,
      tagAr: d.tagAr,
      tagEn: d.tagEn,
      image: d.image,
      descAr: d.descAr || null,
      descEn: d.descEn || null,
      published: d.published,
    },
  });
  revalidate();
  redirect("/admin/projects");
}

export async function toggleProjectPublish(id: string, published: boolean) {
  await guard();
  await db.project.update({ where: { id }, data: { published } });
  revalidate();
}

export async function deleteProject(id: string) {
  await guard();
  await db.project.delete({ where: { id } });
  revalidate();
}
