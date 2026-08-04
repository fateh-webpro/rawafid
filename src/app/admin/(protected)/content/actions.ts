"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { baseFlat, getContentOverrides } from "@/lib/content";

export type ContentState = { success?: string; error?: string };

const BASE_BY_LOCALE = {
  ar: baseFlat("ar"),
  en: baseFlat("en"),
} as const;

const SECTION_KEYS = Object.entries(BASE_BY_LOCALE.ar).reduce<Record<string, string[]>>(
  (acc, [key]) => {
    const section = key.split(".")[0];
    (acc[section] ??= []).push(key);
    return acc;
  },
  {}
);

function isAllowedSection(section: string): section is keyof typeof SECTION_KEYS {
  return Object.prototype.hasOwnProperty.call(SECTION_KEYS, section);
}

export async function saveContentSection(
  _prev: ContentState,
  formData: FormData
): Promise<ContentState> {
  if (!(await getSession())) redirect("/admin/login");

  const rawSection = formData.get("section");
  if (typeof rawSection !== "string" || !isAllowedSection(rawSection)) {
    return { error: "القسم غير صالح للحفظ." };
  }

  const sectionKeys = SECTION_KEYS[rawSection];

  try {
    const nextOverridesByLocale = await Promise.all(
      (["ar", "en"] as const).map(async (locale) => {
        const base = BASE_BY_LOCALE[locale];
        const nextOverrides = { ...(await getContentOverrides(locale)) };
        let validFields = 0;

        for (const key of sectionKeys) {
          const rawValue = formData.get(`${locale}::${key}`);
          if (typeof rawValue !== "string") continue;

          validFields += 1;

          if (rawValue !== base[key]) nextOverrides[key] = rawValue;
          else delete nextOverrides[key];
        }

        return { locale, nextOverrides, validFields };
      })
    );

    const validFieldsCount = nextOverridesByLocale.reduce(
      (count, current) => count + current.validFields,
      0
    );

    if (validFieldsCount === 0) {
      return { error: "لم يُرسل أي حقل صالح لهذا القسم." };
    }

    await Promise.all(
      nextOverridesByLocale.map(({ locale, nextOverrides }) =>
        db.setting.upsert({
          where: { key: `content.${locale}` },
          update: { value: JSON.stringify(nextOverrides) },
          create: { key: `content.${locale}`, value: JSON.stringify(nextOverrides) },
        })
      )
    );
  } catch {
    return { error: "تعذّر حفظ نصوص القسم، حاول مجددًا." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/en", "layout");

  return { success: "تم حفظ نصوص القسم بنجاح." };
}
