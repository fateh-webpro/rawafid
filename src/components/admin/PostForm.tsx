"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import type { PostFormState } from "@/app/admin/(protected)/blog/actions";

export type PostDefaults = {
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  cover: string;
  slug: string;
  published: boolean;
};

const field =
  "w-full rounded-lg border border-navy-20 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold";

export function PostForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (prev: PostFormState, fd: FormData) => Promise<PostFormState>;
  defaults?: PostDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {} as PostFormState);

  return (
    <form action={formAction} className="max-w-3xl rounded-xl border border-navy-20/50 bg-white p-6 lg:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">العنوان (عربي) *</span>
          <input type="text" name="titleAr" defaultValue={defaults?.titleAr} required className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">العنوان (إنجليزي) *</span>
          <input type="text" name="titleEn" dir="ltr" defaultValue={defaults?.titleEn} required className={field + " text-start"} />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-1.5 block text-sm font-medium text-navy-80">المحتوى (عربي) *</span>
        <textarea name="bodyAr" rows={7} defaultValue={defaults?.bodyAr} required className={field + " resize-y leading-relaxed"} />
        <span className="mt-1 block text-xs text-gray">افصل الفقرات بسطر فارغ.</span>
      </label>

      <label className="mt-5 block">
        <span className="mb-1.5 block text-sm font-medium text-navy-80">المحتوى (إنجليزي) *</span>
        <textarea name="bodyEn" dir="ltr" rows={7} defaultValue={defaults?.bodyEn} required className={field + " resize-y text-start leading-relaxed"} />
      </label>

      <label className="mt-5 block">
        <span className="mb-1.5 block text-sm font-medium text-navy-80">
          الرابط (slug) — اختياري
        </span>
        <input type="text" name="slug" dir="ltr" defaultValue={defaults?.slug} placeholder="يُولّد تلقائياً من العنوان الإنجليزي" className={field + " text-start"} />
      </label>

      <div className="mt-5">
        <span className="mb-1.5 block text-sm font-medium text-navy-80">صورة الغلاف — اختياري</span>
        <ImageUpload name="cover" defaultValue={defaults?.cover} />
      </div>

      <label className="mt-5 flex items-center gap-2.5">
        <input type="checkbox" name="published" defaultChecked={defaults ? defaults.published : false} className="h-4 w-4 accent-gold" />
        <span className="text-sm text-navy-80">منشور على الموقع</span>
      </label>

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
        <Link href="/admin/blog" className="text-sm text-gray hover:text-navy">إلغاء</Link>
      </div>
    </form>
  );
}
