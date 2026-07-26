import "server-only";
import { db } from "@/lib/db";
import arMessages from "../../messages/ar.json";
import enMessages from "../../messages/en.json";

type Nested = { [k: string]: string | Nested };

/** تحويل كائن النصوص المتداخل إلى خريطة مسطّحة "a.b.c" -> "value" */
export function flatten(obj: Nested, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") Object.assign(out, flatten(v, key));
    else out[key] = String(v);
  }
  return out;
}

/** ضبط قيمة داخل كائن متداخل عبر مسار منقوط */
export function setPath(obj: Nested, path: string, value: string) {
  const parts = path.split(".");
  let cur: Nested = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (typeof cur[p] !== "object" || cur[p] === null) cur[p] = {};
    cur = cur[p] as Nested;
  }
  cur[parts[parts.length - 1]] = value;
}

export const BASE_MESSAGES: Record<"ar" | "en", Nested> = {
  ar: arMessages as Nested,
  en: enMessages as Nested,
};

/** النصوص الافتراضية المسطّحة لكل لغة */
export function baseFlat(locale: "ar" | "en") {
  return flatten(BASE_MESSAGES[locale]);
}

/** تعديلات النصوص المحفوظة من لوحة التحكم للغة معيّنة */
export async function getContentOverrides(
  locale: string
): Promise<Record<string, string>> {
  try {
    const row = await db.setting.findUnique({
      where: { key: `content.${locale}` },
    });
    if (!row) return {};
    return JSON.parse(row.value) as Record<string, string>;
  } catch {
    return {};
  }
}

/** رسائل اللغة كاملةً بعد دمج تعديلات اللوحة فوق الافتراضي */
export async function getMergedMessages(locale: string): Promise<Nested> {
  const base = BASE_MESSAGES[locale === "ar" ? "ar" : "en"];
  const messages = structuredClone(base);
  const overrides = await getContentOverrides(locale);
  for (const [key, value] of Object.entries(overrides)) {
    if (typeof value === "string") setPath(messages, key, value);
  }
  return messages;
}
