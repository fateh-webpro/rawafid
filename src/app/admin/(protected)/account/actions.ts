"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createSession,
  getSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

export type AccountState = { error?: string; success?: string };

/** تغيير كلمة مرور الحساب الحالي */
export async function changePassword(
  _prev: AccountState,
  formData: FormData
): Promise<AccountState> {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 8) return { error: "كلمة المرور الجديدة 8 أحرف على الأقل" };
  if (next !== confirm) return { error: "تأكيد كلمة المرور غير مطابق" };

  const user = await db.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/admin/login");

  if (!(await verifyPassword(current, user.password))) {
    return { error: "كلمة المرور الحالية غير صحيحة" };
  }

  await db.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(next) },
  });

  return { success: "تم تغيير كلمة المرور بنجاح" };
}

/** تحديث اسم الحساب الحالي */
export async function updateOwnName(
  _prev: AccountState,
  formData: FormData
): Promise<AccountState> {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return { error: "الاسم قصير جداً" };

  const user = await db.user.update({
    where: { id: session.id },
    data: { name },
  });
  // تحديث الجلسة بالاسم الجديد
  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return { success: "تم تحديث الاسم" };
}
