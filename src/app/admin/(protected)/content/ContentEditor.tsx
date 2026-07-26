"use client";

import { useActionState, useMemo, useState } from "react";
import { Save, ChevronDown, Search } from "lucide-react";
import { saveContent, type ContentState } from "./actions";
import { cn } from "@/lib/utils";

export type ContentRow = {
  key: string;
  section: string;
  ar: string;
  en: string;
};

const SECTION_NAMES: Record<string, string> = {
  meta: "بيانات SEO (عنوان ووصف الموقع)",
  nav: "القائمة العلوية",
  hero: "الهيدر (الصفحة الرئيسية)",
  stats: "مسمّيات الأرقام",
  categories: "قسم الفئات",
  services: "قسم الخدمات",
  why: "قسم «لماذا نحن»",
  cta: "دعوة التواصل",
  common: "نصوص عامة",
  footer: "التذييل",
  equipmentPage: "صفحة المعدات",
  contactPage: "صفحة التواصل / طلب عرض السعر",
  aboutPage: "صفحة من نحن",
  servicesPage: "صفحة الخدمات",
  projectsPage: "صفحة المشاريع",
  blogPage: "صفحة المدونة",
  downloadsPage: "صفحة مركز التحميل",
  emptyPage: "رسائل الصفحات الفارغة",
};

export function ContentEditor({ rows }: { rows: ContentRow[] }) {
  const [state, formAction, pending] = useActionState(saveContent, {} as ContentState);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map: Record<string, ContentRow[]> = {};
    for (const r of rows) {
      if (q && !r.ar.toLowerCase().includes(q) && !r.en.toLowerCase().includes(q) && !r.key.toLowerCase().includes(q))
        continue;
      (map[r.section] ??= []).push(r);
    }
    return map;
  }, [rows, query]);

  const sections = Object.keys(grouped);
  const isOpen = (s: string) => (query ? true : open[s] ?? false);

  return (
    <form action={formAction}>
      {/* البحث */}
      <div className="sticky top-16 z-20 -mx-5 mb-5 border-b border-navy-20/40 bg-cream/95 px-5 py-3 backdrop-blur-md lg:top-0 lg:mx-0 lg:rounded-xl lg:border lg:px-4">
        <div className="relative max-w-md">
          <Search size={18} className="pointer-events-none absolute top-1/2 start-3 -translate-y-1/2 text-gray" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في النصوص…"
            className="w-full rounded-lg border border-navy-20 bg-white py-2.5 ps-10 pe-4 text-navy outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-24">
        {sections.map((section) => {
          const list = grouped[section];
          const opened = isOpen(section);
          return (
            <section key={section} className="overflow-hidden rounded-xl border border-navy-20/50 bg-white">
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [section]: !opened }))}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start"
              >
                <span className="font-heading font-bold text-navy">
                  {SECTION_NAMES[section] ?? section}
                  <span className="latin-nums mr-2 text-sm font-normal text-gray"> ({list.length})</span>
                </span>
                <ChevronDown size={18} className={cn("shrink-0 text-gray transition-transform", opened && "rotate-180")} />
              </button>

              {opened ? (
                <div className="border-t border-navy-20/40 divide-y divide-navy-20/30">
                  {list.map((r) => (
                    <div key={r.key} className="px-5 py-4">
                      <p dir="ltr" className="latin-nums mb-2 text-start text-[0.7rem] text-gray">{r.key}</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-1 block text-xs font-medium text-navy-60">عربي</span>
                          <TextArea name={`ar::${r.key}`} defaultValue={r.ar} />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-xs font-medium text-navy-60">English</span>
                          <TextArea name={`en::${r.key}`} defaultValue={r.en} ltr />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
        {sections.length === 0 ? (
          <p className="rounded-xl border border-dashed border-navy-20 bg-white p-10 text-center text-gray">
            لا نتائج مطابقة للبحث.
          </p>
        ) : null}
      </div>

      {/* شريط الحفظ الثابت */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-navy-20/50 bg-white/95 px-5 py-3 backdrop-blur lg:pe-8 lg:ps-72">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 font-heading font-bold text-navy transition-colors hover:bg-gold-80 disabled:opacity-60"
          >
            <Save size={17} />
            {pending ? "جارٍ الحفظ…" : "حفظ كل النصوص"}
          </button>
          {state.success ? <span className="text-sm text-green-700">{state.success}</span> : null}
          {state.error ? <span className="text-sm text-red-600">{state.error}</span> : null}
        </div>
      </div>
    </form>
  );
}

function TextArea({ name, defaultValue, ltr }: { name: string; defaultValue: string; ltr?: boolean }) {
  const long = defaultValue.length > 60;
  return (
    <textarea
      name={name}
      dir={ltr ? "ltr" : undefined}
      rows={long ? 3 : 1}
      defaultValue={defaultValue}
      className={cn(
        "w-full resize-y rounded-lg border border-navy-20 bg-cream/40 px-3 py-2 text-sm text-navy outline-none focus:border-gold focus:bg-white",
        ltr && "text-start"
      )}
    />
  );
}
