import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { baseFlat, getContentOverrides } from "@/lib/content";

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

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Session expired. Please sign in again." },
      { status: 401 }
    );
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Not authorized to update site content." },
      { status: 403 }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json(
      { success: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }

  const { section, values } = payload as { section?: unknown; values?: unknown };

  if (typeof section !== "string" || !isAllowedSection(section)) {
    return NextResponse.json(
      { success: false, message: "Invalid content section." },
      { status: 400 }
    );
  }

  if (!values || typeof values !== "object" || Array.isArray(values)) {
    return NextResponse.json(
      { success: false, message: "Invalid section values." },
      { status: 400 }
    );
  }

  const sectionKeys = new Set(SECTION_KEYS[section]);
  const entries = Object.entries(values);

  if (entries.length === 0) {
    return NextResponse.json(
      { success: false, message: "No valid fields were provided." },
      { status: 400 }
    );
  }

  const normalized: Record<"ar" | "en", Record<string, string>> = { ar: {}, en: {} };

  for (const [field, value] of entries) {
    if (typeof value !== "string") {
      return NextResponse.json(
        { success: false, message: "All field values must be strings." },
        { status: 400 }
      );
    }

    const match = /^(ar|en)::(.+)$/.exec(field);
    if (!match) {
      return NextResponse.json(
        { success: false, message: "Invalid field key format." },
        { status: 400 }
      );
    }

    const locale = match[1] as "ar" | "en";
    const key = match[2];

    if (!key.startsWith(section + ".") || !sectionKeys.has(key)) {
      return NextResponse.json(
        { success: false, message: "Request contains keys outside the selected section." },
        { status: 400 }
      );
    }

    normalized[locale][key] = value;
  }

  const validFieldsCount = Object.keys(normalized.ar).length + Object.keys(normalized.en).length;
  if (validFieldsCount === 0) {
    return NextResponse.json(
      { success: false, message: "No valid fields were provided." },
      { status: 400 }
    );
  }

  try {
    const nextOverridesByLocale = await Promise.all(
      (["ar", "en"] as const).map(async (locale) => {
        const base = BASE_BY_LOCALE[locale];
        const nextOverrides = { ...(await getContentOverrides(locale)) };

        for (const key of sectionKeys) {
          if (!(key in normalized[locale])) continue;

          const value = normalized[locale][key];
          if (value !== base[key]) nextOverrides[key] = value;
          else delete nextOverrides[key];
        }

        return { locale, nextOverrides };
      })
    );

    await Promise.all(
      nextOverridesByLocale.map(({ locale, nextOverrides }) =>
        db.setting.upsert({
          where: { key: "content." + locale },
          update: { value: JSON.stringify(nextOverrides) },
          create: { key: "content." + locale, value: JSON.stringify(nextOverrides) },
        })
      )
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "فشل حفظ التعديلات." },
      { status: 500 }
    );
  }

  revalidatePath("/", "layout");
  revalidatePath("/en", "layout");

  return NextResponse.json({ success: true, message: "تم حفظ التعديلات بنجاح." });
}
