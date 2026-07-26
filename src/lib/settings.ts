import "server-only";
import { db } from "@/lib/db";

/**
 * إعدادات الموقع القابلة للتعديل من لوحة التحكم (مفتاح/قيمة).
 * القيم الافتراضية هنا تُستخدم عند عدم وجود قيمة محفوظة.
 */
export const SETTING_DEFAULTS: Record<string, string> = {
  // التواصل
  "contact.phone": "+966538131822",
  "contact.phoneDisplay": "+966 53 813 1822",
  "contact.whatsapp": "966538131822",
  "contact.email": "",
  // بريد استقبال الطلبات (إن اختلف عن بريد التواصل)
  "quotes.notifyEmail": "",

  // الأرقام
  "stats.foundedYear": "2018",
  "stats.equipment": "273",
  "stats.projects": "732",
  "stats.clients": "245",

  // صورة الهيدر (النصوص تُدار من "نصوص الموقع")
  "hero.image": "/images/equipment/hero.jpg",

  // نشاط الألمنيوم والواجهات (صفحة أنشطتنا)
  "aluminum.url": "", // رابط موقع النشاط — فارغ = "قريبًا"
  "aluminum.image": "",

  // روابط التواصل الاجتماعي (فارغ = يختفي من الموقع)
  "social.facebook": "",
  "social.instagram": "",
  "social.tiktok": "",
  "social.snapchat": "",
  "social.x": "",
};

/** منصات التواصل بالترتيب — مفتاح الإعداد + الاسم */
export const SOCIAL_PLATFORMS = [
  { key: "social.facebook", name: "فيسبوك" },
  { key: "social.instagram", name: "إنستقرام" },
  { key: "social.tiktok", name: "تيك توك" },
  { key: "social.snapchat", name: "سناب شات" },
  { key: "social.x", name: "X (تويتر)" },
] as const;

/** الروابط المفعّلة فقط (غير الفارغة) */
export function activeSocials(s: Settings) {
  return SOCIAL_PLATFORMS.map((p) => ({
    id: p.key.replace("social.", ""),
    name: p.name,
    url: (s[p.key] ?? "").trim(),
  })).filter((p) => p.url);
}

export type Settings = Record<string, string>;

/** كل الإعدادات مدموجة مع الافتراضيات */
export async function getSettings(): Promise<Settings> {
  const rows = await db.setting.findMany();
  const map: Settings = { ...SETTING_DEFAULTS };
  for (const r of rows) {
    // القيم الفارغة المحفوظة تبقى فارغة (تجاوز مقصود)
    map[r.key] = r.value;
  }
  return map;
}

export function num(map: Settings, key: string, fallback = 0): number {
  const v = parseInt(map[key] ?? "", 10);
  return Number.isFinite(v) ? v : fallback;
}
