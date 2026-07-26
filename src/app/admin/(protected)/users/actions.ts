"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";

async function guardAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "admin") redirect("/admin");
  return session;
}

const baseSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(["admin", "editor"]),
});

export type UserFormState = { error?: string };

export async function createUser(
  _prev: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  await guardAdmin();
  const parsed = baseSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: "بيانات غير صحيحة — تحقّق من البريد والاسم" };

  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "كلمة المرور 8 أحرف على الأقل" };

  const exists = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return { error: "هذا البريد مستخدم بالفعل" };

  await db.user.create({
    data: { ...parsed.data, password: await hashPassword(password) },
  });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUser(
  id: string,
  _prev: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const session = await guardAdmin();
  const parsed = baseSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: "بيانات غير صحيحة" };

  // منع المدير من إسقاط صلاحيته إن كان آخر مدير
  if (session.id === id && parsed.data.role !== "admin") {
    const admins = await db.user.count({ where: { role: "admin" } });
    if (admins <= 1) return { error: "لا يمكن إزالة صلاحية آخر مدير في النظام" };
  }

  const emailOwner = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (emailOwner && emailOwner.id !== id) return { error: "هذا البريد مستخدم لحساب آخر" };

  const password = String(formData.get("password") ?? "");
  const data: {
    name: string;
    email: string;
    role: string;
    password?: string;
  } = { ...parsed.data };
  if (password) {
    if (password.length < 8) return { error: "كلمة المرور 8 أحرف على الأقل" };
    data.password = await hashPassword(password);
  }

  await db.user.update({ where: { id }, data });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(id: string) {
  const session = await guardAdmin();
  if (session.id === id) return; // لا يحذف المستخدم نفسه
  const target = await db.user.findUnique({ where: { id } });
  if (!target) return;
  if (target.role === "admin") {
    const admins = await db.user.count({ where: { role: "admin" } });
    if (admins <= 1) return; // لا يُحذف آخر مدير
  }
  await db.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
