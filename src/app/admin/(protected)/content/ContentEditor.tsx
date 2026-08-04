"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type ContentRow = {
  key: string;
  section: string;
  ar: string;
  en: string;
};

type ContentState = {
  success?: string;
  error?: string;
};

const SECTION_NAMES: Record<string, string> = {   meta: "بيانات SEO (عنوان ووصف الموقع)",   nav: "القائمة العلوية",   hero: "الهيدر (الصفحة الرئيسية)",   stats: "مسمّيات الأرقام",   categories: "قسم الفئات",   services: "قسم الخدمات",   why: "قسم «لماذا نحن»",   cta: "دعوة التواصل",   common: "نصوص عامة",   footer: "التذييل",   equipmentPage: "صفحة المعدات",   contactPage: "صفحة التواصل / طلب عرض السعر",   aboutPage: "صفحة من نحن",   servicesPage: "صفحة الخدمات",   projectsPage: "صفحة المشاريع",   blogPage: "صفحة المدونة",   downloadsPage: "صفحة مركز التحميل",   emptyPage: "رسائل الصفحات الفارغة", };

export function ContentEditor({ rows }: { rows: ContentRow[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map: Record<string, ContentRow[]> = {};
    for (const row of rows) {
      if (
        q &&
        !row.ar.toLowerCase().includes(q) &&
        !row.en.toLowerCase().includes(q) &&
        !row.key.toLowerCase().includes(q)
      ) {
        continue;
      }
      (map[row.section] ??= []).push(row);
    }
    return map;
  }, [rows, query]);

  const sections = useMemo(() => {
    const order = Array.from(new Set(rows.map((row) => row.section)));
    return order.filter((section) => grouped[section]?.length);
  }, [grouped, rows]);

  const isOpen = (section: string) => (query ? true : open[section] ?? false);

  return (
    <>
      <div className="sticky top-16 z-20 -mx-5 mb-5 border-b border-navy-20/40 bg-cream/95 px-5 py-3 backdrop-blur-md lg:top-0 lg:mx-0 lg:rounded-xl lg:border lg:px-4">
        <div className="relative max-w-md">
          <Search size={18} className="pointer-events-none absolute top-1/2 start-3 -translate-y-1/2 text-gray" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
                onClick={() => setOpen((current) => ({ ...current, [section]: !opened }))}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start"
              >
                <span className="font-heading font-bold text-navy">
                  {SECTION_NAMES[section] ?? section}
                  <span className="latin-nums mr-2 text-sm font-normal text-gray"> ({list.length})</span>
                </span>
                <ChevronDown
                  size={18}
                  className={cn("shrink-0 text-gray transition-transform", opened && "rotate-180")}
                />
              </button>

              {opened ? <ContentSectionForm section={section} rows={list} /> : null}
            </section>
          );
        })}

        {sections.length === 0 ? (
          <p className="rounded-xl border border-dashed border-navy-20 bg-white p-10 text-center text-gray">
            لا نتائج مطابقة للبحث.
          </p>
        ) : null}
      </div>
    </>
  );
}

function ContentSectionForm({
  section,
  rows,
}: {
  section: string;
  rows: ContentRow[];
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [state, setState] = useState<ContentState>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setState({});

    const formData = new FormData(event.currentTarget);
    const rawSection = formData.get("section");
    const values: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (key === "section") continue;
      if (typeof value !== "string") continue;
      values[key] = value;
    }

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: typeof rawSection === "string" ? rawSection : "",
          values,
        }),
      });

      const responseType = response.headers.get("content-type") ?? "";
      const rawBody = await response.text();
      const parsed = responseType.includes("application/json")
        ? tryParseJson(rawBody)
        : null;

      if (response.status === 401) {
        setState({ error: "Session expired. Please sign in again." });
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        if (!parsed) {
          setState({ error: "Save request was rejected by the server with status " + response.status + "." });
          return;
        }

        setState({ error: parsed.message ?? "Failed to save this section. Please try again." });
        return;
      }

      if (!parsed) {
        setState({ error: "The server responded with an unexpected format." });
        return;
      }

      setState({ success: parsed.message ?? "Section saved successfully." });
      router.refresh();
    } catch {
      setState({ error: "Failed to save this section. Please try again." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="hidden" name="section" value={section} />

      <div className="border-t border-navy-20/40 divide-y divide-navy-20/30">
        {rows.map((row) => (
          <div key={row.key} className="px-5 py-4">
            <p dir="ltr" className="latin-nums mb-2 text-start text-[0.7rem] text-gray">
              {row.key}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-navy-60">عربي</span>
                <TextArea name={"ar::" + row.key} defaultValue={row.ar} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-navy-60">English</span>
                <TextArea name={"en::" + row.key} defaultValue={row.en} ltr />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-navy-20/40 px-5 py-4">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 font-heading font-bold text-navy transition-colors hover:bg-gold-80 disabled:opacity-60"
        >
          <Save size={17} />
          {isSaving ? "جارٍ الحفظ…" : "حفظ القسم"}
        </button>
        {state.success ? <span className="text-sm text-green-700">{state.success}</span> : null}
        {state.error ? <span className="text-sm text-red-600">{state.error}</span> : null}
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

function tryParseJson(value: string): { success?: boolean; message?: string } | null {
  try {
    return JSON.parse(value) as { success?: boolean; message?: string };
  } catch {
    return null;
  }
}
