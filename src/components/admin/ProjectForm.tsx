"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import type { ProjectFormState } from "@/app/admin/(protected)/projects/actions";

export type ProjectDefaults = {
  titleAr: string;
  titleEn: string;
  tagAr: string;
  tagEn: string;
  image: string;
  descAr: string;
  descEn: string;
  published: boolean;
};

const field =
  "w-full rounded-lg border border-navy-20 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold";

export function ProjectForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (prev: ProjectFormState, fd: FormData) => Promise<ProjectFormState>;
  defaults?: ProjectDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {} as ProjectFormState);

  return (
    <form action={formAction} className="max-w-2xl rounded-xl border border-navy-20/50 bg-white p-6 lg:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">العنوان (عربي) *</span>
          <input type="text" name="titleAr" defaultValue={defaults?.titleAr} required className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">العنوان (إنجليزي) *</span>
          <input type="text" name="titleEn" dir="ltr" defaultValue={defaults?.titleEn} required className={field + " text-start"} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">الوسم (عربي) *</span>
          <input type="text" name="tagAr" defaultValue={defaults?.tagAr} required className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">الوسم (إنجليزي) *</span>
          <input type="text" name="tagEn" dir="ltr" defaultValue={defaults?.tagEn} required className={field + " text-start"} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">وصف (عربي) — اختياري</span>
          <textarea name="descAr" rows={2} defaultValue={defaults?.descAr} className={field + " resize-y"} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">وصف (إنجليزي) — اختياري</span>
          <textarea name="descEn" dir="ltr" rows={2} defaultValue={defaults?.descEn} className={field + " resize-y text-start"} />
        </label>
      </div>

      <div className="mt-5">
        <span className="mb-1.5 block text-sm font-medium text-navy-80">صورة المشروع *</span>
        <ImageUpload name="image" defaultValue={defaults?.image} />
      </div>

      <label className="mt-5 flex items-center gap-2.5">
        <input
          type="checkbox"
          name="published"
          defaultChecked={defaults ? defaults.published : true}
          className="h-4 w-4 accent-gold"
        />
        <span className="text-sm text-navy-80">منشور على الموقع</span>
      </label>

      {state.error ? (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
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
        <Link href="/admin/projects" className="text-sm text-gray hover:text-navy">إلغاء</Link>
      </div>
    </form>
  );
}
