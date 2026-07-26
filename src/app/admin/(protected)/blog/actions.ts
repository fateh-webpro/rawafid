"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  titleAr: z.string().trim().min(1),
  titleEn: z.string().trim().min(1),
  bodyAr: z.string().trim().min(1),
  bodyEn: z.string().trim().min(1),
  cover: z.string().trim().optional().or(z.literal("")),
  slug: z.string().trim().optional().or(z.literal("")),
  published: z.union([z.literal("on"), z.null(), z.undefined()]).transform((v) => v === "on"),
});

async function guard() {
  if (!(await getSession())) redirect("/admin/login");
}

function revalidate() {
  revalidatePath("/admin/blog");
  revalidatePath("/ar/blog");
  revalidatePath("/en/blog");
}

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9؀-ۿ]+/g, "-")
      .replace(/^-+|-+$/g, "") || `post-${Date.now()}`
  );
}

export type PostFormState = { error?: string };

function parse(formData: FormData) {
  return schema.safeParse({
    titleAr: formData.get("titleAr"),
    titleEn: formData.get("titleEn"),
    bodyAr: formData.get("bodyAr"),
    bodyEn: formData.get("bodyEn"),
    cover: formData.get("cover") ?? "",
    slug: formData.get("slug") ?? "",
    published: formData.get("published"),
  });
}

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await db.post.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${++n}`;
  }
}

export async function createPost(
  _prev: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  await guard();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "الرجاء تعبئة العنوان والمحتوى باللغتين" };
  const d = parsed.data;

  const slug = await uniqueSlug(slugify(d.slug || d.titleEn));
  await db.post.create({
    data: {
      slug,
      titleAr: d.titleAr,
      titleEn: d.titleEn,
      bodyAr: d.bodyAr,
      bodyEn: d.bodyEn,
      cover: d.cover || null,
      published: d.published,
      publishedAt: d.published ? new Date() : null,
    },
  });
  revalidate();
  redirect("/admin/blog");
}

export async function updatePost(
  id: string,
  _prev: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  await guard();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "الرجاء تعبئة العنوان والمحتوى باللغتين" };
  const d = parsed.data;

  const current = await db.post.findUnique({ where: { id } });
  if (!current) return { error: "المقال غير موجود" };

  const slug = await uniqueSlug(slugify(d.slug || d.titleEn), id);
  await db.post.update({
    where: { id },
    data: {
      slug,
      titleAr: d.titleAr,
      titleEn: d.titleEn,
      bodyAr: d.bodyAr,
      bodyEn: d.bodyEn,
      cover: d.cover || null,
      published: d.published,
      publishedAt: d.published ? (current.publishedAt ?? new Date()) : null,
    },
  });
  revalidate();
  redirect("/admin/blog");
}

export async function togglePostPublish(id: string, published: boolean) {
  await guard();
  await db.post.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : null },
  });
  revalidate();
}

export async function deletePost(id: string) {
  await guard();
  await db.post.delete({ where: { id } });
  revalidate();
}
