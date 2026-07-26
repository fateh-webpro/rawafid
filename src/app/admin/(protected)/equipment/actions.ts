"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  categoryId: z.string().min(1),
  nameAr: z.string().trim().min(1),
  nameEn: z.string().trim().min(1),
  image: z.string().trim().min(1),
  status: z.enum(["available", "rented", "hidden"]),
  specs: z.string().optional(),
});

/** تنقية سلسلة JSON للمواصفات — تُعيد سلسلة صالحة دائمًا */
function cleanSpecs(raw: unknown): string {
  if (typeof raw !== "string" || !raw.trim()) return "[]";
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return "[]";
    return JSON.stringify(
      arr
        .filter(
          (s) => s && typeof s.labelAr === "string" && typeof s.value === "string"
        )
        .map((s) => ({
          labelAr: String(s.labelAr).slice(0, 60),
          labelEn: String(s.labelEn ?? "").slice(0, 60),
          value: String(s.value).slice(0, 100),
        }))
    );
  } catch {
    return "[]";
  }
}

async function guard() {
  if (!(await getSession())) redirect("/admin/login");
}

function revalidate() {
  revalidatePath("/admin/equipment");
  revalidatePath("/ar/equipment");
  revalidatePath("/en/equipment");
  revalidatePath("/admin");
}

export type EquipFormState = { error?: string };

export async function createEquipment(
  _prev: EquipFormState,
  formData: FormData
): Promise<EquipFormState> {
  await guard();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "الرجاء تعبئة جميع الحقول المطلوبة" };

  const { specs, ...rest } = parsed.data;
  await db.equipment.create({ data: { ...rest, specs: cleanSpecs(specs) } });
  revalidate();
  redirect("/admin/equipment");
}

export async function updateEquipment(
  id: string,
  _prev: EquipFormState,
  formData: FormData
): Promise<EquipFormState> {
  await guard();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "الرجاء تعبئة جميع الحقول المطلوبة" };

  const { specs, ...rest } = parsed.data;
  await db.equipment.update({
    where: { id },
    data: { ...rest, specs: cleanSpecs(specs) },
  });
  revalidate();
  redirect("/admin/equipment");
}

export async function setEquipmentStatus(id: string, status: string) {
  await guard();
  if (!["available", "rented", "hidden"].includes(status)) return;
  await db.equipment.update({ where: { id }, data: { status } });
  revalidate();
}

export async function deleteEquipment(id: string) {
  await guard();
  await db.equipment.delete({ where: { id } });
  revalidate();
}
