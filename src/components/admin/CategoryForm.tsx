"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import type { CategoryFormState } from "@/app/admin/(protected)/categories/actions";

export type CategoryDefaults = {
  slug: string;
  nameAr: string;
  nameEn: string;
  image: string;
  operator: string;
};

const field =
  "w-full rounded-lg border border-navy-20 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold";

const OPERATORS = [
  { value: "both", label: "بمشغل أو بدون" },
  { value: "operated", label: "بمشغل محترف" },
  { value: "self", label: "تشغيل ذاتي" },
];

export function CategoryForm({
  action,
  defaults,
  submitLabel,
  lockSlug = false,
}: {
  action: (prev: CategoryFormState, fd: FormData) => Promise<CategoryFormState>;
  defaults?: CategoryDefaults;
  submitLabel: string;
  lockSlug?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {} as CategoryFormState);

  return (
    <form action={formAction} className="max-w-2xl rounded-xl border border-navy-20/50 bg-white p-6 lg:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">الاسم (عربي) *</span>
          <input type="text" name="nameAr" defaultValue={defaults?.nameAr} required className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">الاسم (إنجليزي) *</span>
          <input type="text" name="nameEn" dir="ltr" defaultValue={defaults?.nameEn} required className={field + " text-start"} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">
            الرابط (slug) *
          </span>
          <input
            type="text"
            name="slug"
            dir="ltr"
            defaultValue={defaults?.slug}
            required
            readOnly={lockSlug}
            placeholder="forklifts"
            className={field + " text-start latin-nums" + (lockSlug ? " bg-cream/60 text-gray" : "")}
          />
          <span className="mt-1 block text-xs text-gray">
            أحرف إنجليزية صغيرة وشرطات فقط — يظهر في رابط الصفحة.
          </span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">خيار التشغيل</span>
          <select name="operator" defaultValue={defaults?.operator ?? "operated"} className={field}>
            {OPERATORS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5">
        <span className="mb-1.5 block text-sm font-medium text-navy-80">صورة الفئة</span>
        <ImageUpload name="image" defaultValue={defaults?.image} />
      </div>

      {state.error ? (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      ) : null}

      <div className="mt-7 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 font-heading font-bold text-white transition-colors hover:bg-navy-deep disabled:opacity-60"
        >
          <Save size={17} />
          {pending ? "جارٍ الحفظ…" : submitLabel}
        </button>
        <Link href="/admin/categories" className="text-sm text-gray hover:text-navy">إلغاء</Link>
      </div>
    </form>
  );
}
