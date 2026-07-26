export type Spec = { labelAr: string; labelEn: string; value: string };

/** تحويل سلسلة JSON المخزّنة إلى مصفوفة مواصفات آمنة */
export function parseSpecs(raw: string | null | undefined): Spec[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((s) => s && typeof s.labelAr === "string" && typeof s.value === "string")
      .map((s) => ({
        labelAr: String(s.labelAr),
        labelEn: String(s.labelEn ?? ""),
        value: String(s.value),
      }));
  } catch {
    return [];
  }
}
