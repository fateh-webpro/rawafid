"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { baseFlat } from "@/lib/content";

export type ContentState = { success?: string; error?: string };

/**
 * حفظ تعديلات النصوص: نخزّن فقط ما اختلف عن النص الافتراضي (لكل لغة)
 * في مفتاحين: content.ar و content.en كـ JSON.
 */
export async function saveContent(
  _prev: ContentState,
  formData: FormData
): Promise<ContentState> {
  if (!(await getSession())) redirect("/admin/login");

  try {
    for (const locale of ["ar", "en"] as const) {
      const base = baseFlat(locale);
      const overrides: Record<string, string> = {};

      for (const [key, defaultValue] of Object.entries(base)) {
        const field = `${locale}::${key}`;
        const raw = formData.get(field);
        if (typeof raw !== "string") continue;
        const value = raw;
        // خزّن فقط ما تغيّر فعلاً عن الافتراضي
        if (value !== defaultValue) overrides[key] = value;
      }

      await db.setting.upsert({
        where: { key: `content.${locale}` },
        update: { value: JSON.stringify(overrides) },
        create: { key: `content.${locale}`, value: JSON.stringify(overrides) },
      });
    }
  } catch {
    return { error: "تعذّر حفظ النصوص، حاول مجدداً." };
  }

  // تحديث كل صفحات الموقع
  revalidatePath("/", "layout");

  return { success: "تم حفظ النصوص بنجاح — ستظهر على الموقع فوراً." };
}
