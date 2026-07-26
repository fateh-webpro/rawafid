"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export type Spec = { labelAr: string; labelEn: string; value: string };

const field =
  "w-full rounded-lg border border-navy-20 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-gold";

/** محرّر مواصفات اختيارية (المسمّى بلغتين + القيمة) — يُخزَّن كـ JSON */
export function SpecsEditor({
  name,
  defaultValue = [],
}: {
  name: string;
  defaultValue?: Spec[];
}) {
  const [rows, setRows] = useState<Spec[]>(defaultValue);

  const update = (i: number, patch: Partial<Spec>) =>
    setRows((r) => r.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const add = () => setRows((r) => [...r, { labelAr: "", labelEn: "", value: "" }]);
  const remove = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));

  const clean = rows.filter((r) => r.labelAr.trim() && r.value.trim());

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(clean)} readOnly />

      {rows.length > 0 ? (
        <div className="mb-3 flex flex-col gap-2">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2">
              <input
                type="text"
                value={row.labelAr}
                onChange={(e) => update(i, { labelAr: e.target.value })}
                placeholder="المسمّى (عربي)"
                className={field}
              />
              <input
                type="text"
                dir="ltr"
                value={row.labelEn}
                onChange={(e) => update(i, { labelEn: e.target.value })}
                placeholder="Label (English)"
                className={field + " text-start"}
              />
              <input
                type="text"
                value={row.value}
                onChange={(e) => update(i, { value: e.target.value })}
                placeholder="القيمة (مثال: 3 طن)"
                className={field}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-navy-20 text-red-500 hover:border-red-400"
                aria-label="حذف السطر"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg border border-navy-20 bg-white px-3 py-1.5 text-sm font-medium text-navy hover:border-gold"
      >
        <Plus size={15} />
        إضافة مواصفة
      </button>
    </div>
  );
}
