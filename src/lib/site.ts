/* بيانات الشركة المركزية — مصدر واحد للحقيقة */
export const site = {
  nameAr: "روافد سبأ للمعدات",
  nameEn: "Rawafid Saba Equipment",
  phone: "+966538131822",
  phoneDisplay: "+966 53 813 1822",
  whatsapp: "966538131822",
  city: "الرياض",
  foundedYear: 2018,
  stats: {
    equipment: 273,
    projects: 732,
    clients: 245,
  },
} as const;

/** رابط واتساب برسالة مسبقة (تُمرر بلغة الزائر) */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink() {
  return `tel:${site.phone}`;
}
