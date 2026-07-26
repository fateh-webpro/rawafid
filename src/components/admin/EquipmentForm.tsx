"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { SpecsEditor, type Spec } from "./SpecsEditor";
import type { EquipFormState } from "@/app/admin/(protected)/equipment/actions";

type CategoryOpt = { id: string; nameAr: string };

export type EquipmentDefaults = {
  categoryId: string;
  nameAr: string;
  nameEn: string;
  image: string;
  status: string;
  specs: Spec[];
};

const STATUS = [
  { value: "available", label: "متاح" },
  { value: "rented", label: "مؤجَّر حالياً" },
  { value: "hidden", label: "مخفي عن الموقع" },
];

export function EquipmentForm({
  action,
  categories,
  defaults,
  submitLabel,
}: {
  action: (prev: EquipFormState, fd: FormData) => Promise<EquipFormState>;
  categories: CategoryOpt[];
  defaults?: EquipmentDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {} as EquipFormState);

  return (
    <form action={formAction} className="max-w-2xl rounded-xl border border-navy-20/50 bg-white p-6 lg:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">الفئة *</span>
          <select
            name="categoryId"
            defaultValue={defaults?.categoryId ?? ""}
            required
            className="w-full rounded-lg border border-navy-20 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold"
          >
            <option value="" disabled>اختر الفئة…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameAr}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">الحالة</span>
          <select
            name="status"
            defaultValue={defaults?.status ?? "available"}
            className="w-full rounded-lg border border-navy-20 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold"
          >
            {STATUS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">الاسم (عربي) *</span>
          <input
            type="text"
            name="nameAr"
            defaultValue={defaults?.nameAr ?? ""}
            required
            className="w-full rounded-lg border border-navy-20 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">الاسم (إنجليزي) *</span>
          <input
            type="text"
            name="nameEn"
            dir="ltr"
            defaultValue={defaults?.nameEn ?? ""}
            required
            className="w-full rounded-lg border border-navy-20 bg-white px-4 py-2.5 text-start text-navy outline-none focus:border-gold"
          />
        </label>
      </div>

      <div className="mt-5">
        <span className="mb-1.5 block text-sm font-medium text-navy-80">صورة المعدة *</span>
        <ImageUpload name="image" defaultValue={defaults?.image} />
      </div>

      <div className="mt-6">
        <span className="mb-1 block text-sm font-medium text-navy-80">
          المواصفات (اختياري)
        </span>
        <p className="mb-3 text-xs text-gray">
          تظهر للزائر أسفل المعدة — مثل: الحمولة، الارتفاع، الموديل. اتركها فارغة إن لم تتوفر.
        </p>
        <SpecsEditor name="specs" defaultValue={defaults?.specs ?? []} />
      </div>

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
        <Link href="/admin/equipment" className="text-sm text-gray hover:text-navy">
          إلغاء
        </Link>
      </div>
    </form>
  );
}
