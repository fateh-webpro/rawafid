"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SETTING_DEFAULTS } from "@/lib/settings";

export type SettingsState = { success?: string; error?: string };

export async function saveSettings(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  if (!(await getSession())) redirect("/admin/login");

  try {
    // نحفظ فقط المفاتيح المعروفة
    for (const key of Object.keys(SETTING_DEFAULTS)) {
      const value = formData.get(key);
      if (typeof value !== "string") continue;
      await db.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
  } catch {
    return { error: "تعذّر حفظ الإعدادات، حاول مجدداً." };
  }

  // إعادة توليد الصفحات المتأثرة
  revalidatePath("/ar");
  revalidatePath("/en");
  revalidatePath("/ar/about");
  revalidatePath("/en/about");
  revalidatePath("/ar/contact");
  revalidatePath("/en/contact");

  return { success: "تم حفظ الإعدادات بنجاح." };
}
